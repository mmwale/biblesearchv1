/*
 * biblereader.js
 * Renders a selectable version/book/chapter and lists verses for the current selection.
 * - Uses react-query to request verses from the in-memory `base44` store
 * - Supports highlight and automatic scrolling to a verse (used when coming from a search result)
 */
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from 'react';
import { base44 } from "../../api/Client";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const BIBLE_BOOKS = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
    "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
    "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
    "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
    "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah",
    "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
    "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
    "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts",
    "Romans", "1 Corinthians", "2 Corinthians", "Galatians",
    "Ephesians", "Philippians", "Colossians", "1 Thessalonians",
    "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus",
    "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
    "1 John", "2 John", "3 John", "Jude", "Revelation"
];

export default function BibleReader({ version, book, chapter, highlightVerse, highlightTerm }) {
    const [currentVersion, setCurrentVersion] = useState(version || 'KJV');
    const [currentBook, setCurrentBook] = useState(book || 'Genesis');
    const [currentChapter, setCurrentChapter] = useState(chapter || 1);

    useEffect(() => {
        if (version) setCurrentVersion(version);
        if (book) setCurrentBook(book);
        if (chapter) setCurrentChapter(chapter);
    }, [version, book, chapter]);

    const { data: verses, isLoading } = useQuery({
        queryKey: ['bible-verses', currentVersion, currentBook, currentChapter],
        queryFn: async () => {
            const results = await base44.entities.BibleVerse.filter({
                version: currentVersion,
                book: currentBook,
                chapter: currentChapter
            });
            return results.sort((a, b) => a.verse - b.verse);
        },
        initialData: []
    });

    const { data: chapterCount } = useQuery({
        queryKey: ['chapter-count', currentVersion, currentBook],
        queryFn: async () => {
            const bookVerses = await base44.entities.BibleVerse.filter({
                version: currentVersion,
                book: currentBook
            });
            const chapters = [...new Set(bookVerses.map(v => v.chapter))];
            return Math.max(...chapters, 1);
        },
        initialData: 50
    });

    const highlightText = (text, term) => {
        if (!term) return text;
        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) => 
            regex.test(part) ? 
                <mark key={i} className="bg-amber-300/70 text-slate-900 rounded px-1 font-medium">{part}</mark> : 
                part
        );
    };

    const handlePrevChapter = () => {
        if (currentChapter > 1) {
            setCurrentChapter(currentChapter - 1);
        } else {
            const currentBookIndex = BIBLE_BOOKS.indexOf(currentBook);
            if (currentBookIndex > 0) {
                setCurrentBook(BIBLE_BOOKS[currentBookIndex - 1]);
                setCurrentChapter(50);
            }
        }
    };

    const handleNextChapter = () => {
        if (currentChapter < chapterCount) {
            setCurrentChapter(currentChapter + 1);
        } else {
            const currentBookIndex = BIBLE_BOOKS.indexOf(currentBook);
            if (currentBookIndex < BIBLE_BOOKS.length - 1) {
                setCurrentBook(BIBLE_BOOKS[currentBookIndex + 1]);
                setCurrentChapter(1);
            }
        }
    };

    useEffect(() => {
        if (highlightVerse) {
            const element = document.getElementById(`verse-${highlightVerse}`);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        }
    }, [highlightVerse, verses]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="p-6 border-2 border-slate-100 shadow-lg">
                <div className="flex flex-wrap items-center gap-4">
                    <Select value={currentVersion} onValueChange={setCurrentVersion}>
                        <SelectTrigger className="w-28">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="KJV">KJV</SelectItem>
                            <SelectItem value="NKJV">NKJV</SelectItem>
                            <SelectItem value="NIV">NIV</SelectItem>
                            <SelectItem value="ESV">ESV</SelectItem>
                            <SelectItem value="ISV">ISV</SelectItem>
                            <SelectItem value="ASV">ASV</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={currentBook} onValueChange={(b) => { setCurrentBook(b); setCurrentChapter(1); }}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {BIBLE_BOOKS.map(b => (
                                <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2 flex-1">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrevChapter}
                            className="rounded-full"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="text-center flex-1">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Chapter {currentChapter}
                            </h2>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNextChapter}
                            className="rounded-full"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {isLoading ? (
                <Card className="p-12 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
                </Card>
            ) : verses.length > 0 ? (
                <Card className="p-8 md:p-12 border-2 border-slate-100 shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                        {currentBook} {currentChapter}
                    </h2>
                    <div className="space-y-4">
                        {verses.map((verse, index) => (
                            <motion.div
                                key={verse.id}
                                id={`verse-${verse.verse}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className={`flex gap-3 ${
                                    highlightVerse && verse.verse === parseInt(highlightVerse)
                                        ? 'bg-amber-50 -mx-4 px-4 py-3 rounded-lg border-l-4 border-amber-400'
                                        : ''
                                }`}
                            >
                                <span className="text-sm font-bold text-amber-600 select-none flex-shrink-0 mt-1 w-6 text-right">
                                    {verse.verse}
                                </span>
                                <p className="text-base leading-relaxed text-slate-700">
                                    {highlightTerm ? highlightText(verse.text, highlightTerm) : verse.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            ) : (
                <Card className="p-12 text-center">
                    <p className="text-slate-500">No verses found. Please import Bible data first.</p>
                </Card>
            )}
        </div>
    );
}