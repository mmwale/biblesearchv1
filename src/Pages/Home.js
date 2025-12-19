/*
 * Pages/Home.js
 * Main search landing page. Manages debounced search input and displays the floating results dropdown.
 * Uses local `base44` data (no network requests required).
 */
import { AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useEffect, useRef, useState } from 'react';
import { base44 } from "../api/Client";
import SearchBar from "../Components/search/searchbar";
import SearchResults from "../Components/search/searchresults";



export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // layout helper -- keep hero centered and accessible
    const Hero = () => (
        <div className="home-hero">
            <div className="home-icon">
                <BookOpen className="w-8 h-8" />
            </div>
            <div className="max-w-3xl text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Search the Scriptures</h1>
                <p className="text-slate-700 mt-2">Explore God's Word across multiple translations with powerful search — all data is stored locally.</p>
            </div>
        </div>
    );

    // Daily verse helper component
    function DailyVerse() {
        const [verse, setVerse] = useState(null);
        const getRandomVerse = async () => {
            const all = await base44.entities.BibleVerse.filter({});
            if (!all || all.length === 0) return;
            const idx = Math.floor(Math.random() * all.length);
            setVerse(all[idx]);
        };

        useEffect(() => {
            getRandomVerse();
        }, []);

        if (!verse) return (
            <div className="p-3 rounded bg-white">
                <div className="text-sm text-slate-500">No verse available</div>
            </div>
        );

        const goToReader = () => {
            const url = `/reader?version=${encodeURIComponent(verse.version)}&book=${encodeURIComponent(verse.book)}&chapter=${verse.chapter}&verse=${verse.verse}`;
            window.location.href = url;
        };

        return (
            <div className="p-4 rounded bg-white resource-item">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="font-semibold text-sm">{verse.book} {verse.chapter}:{verse.verse} — {verse.version}</div>
                        <div className="text-sm text-slate-700 mt-1">{verse.text}</div>
                    </div>
                    <div className="flex-shrink-0">
                        <button className="cta-button" onClick={goToReader}>Read</button>
                    </div>
                </div>
            </div>
        );
    }


    useEffect(() => {
        const searchVerses = async () => {
            // Only perform search for meaningful input (more than one character)
            if (debouncedTerm.trim().length > 1) {
                setIsSearching(true);
                // For now we load all verses into memory and run a straightforward substring match.
                // This keeps the example simple; a production system would use an indexed search.
                const allVerses = await base44.entities.BibleVerse.filter({});
                const searchLower = debouncedTerm.toLowerCase();
                const foundAll = allVerses.filter(verse => 
                    verse.text.toLowerCase().includes(searchLower)
                );

                // Save total exact match count, but only show up to 100 items in the dropdown to keep UI responsive
                setTotalCount(foundAll.length);
                const found = foundAll.slice(0, 100);
                setResults(found);
                setShowResults(true);
                setIsSearching(false);
            } else {
                setResults([]);
                setTotalCount(0);
                setShowResults(false);
            }
        };
        searchVerses();
    }, [debouncedTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
        setShowResults(true);
    };

    const handleClear = () => {
        setShowResults(false);
    };

    const handleResultClick = () => {
        setShowResults(false);
    };

    return (
        <div className="min-h-screen">
            <Hero />

            <div className="container mx-auto px-4 py-8">
                <div className="home-cards">
                    <div className="section-card">
                        <div className="title">Search</div>
                        <p className="text-sm text-slate-600 mb-4">Search across 6 translations stored locally. Start typing below to find verses.</p>
                        <div ref={searchContainerRef} className="relative">
                            <SearchBar
                                value={searchTerm}
                                onChange={setSearchTerm}
                                onSearch={handleSearch}
                                onClear={handleClear}
                            />

                            <AnimatePresence>
                                {showResults && (
                                    <SearchResults
                                        results={results}
                                        searchTerm={debouncedTerm}
                                        onResultClick={handleResultClick}
                                        isLoading={isSearching}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {debouncedTerm && totalCount > 0 && showResults && (
                            <div className="text-sm text-slate-500 mt-4">
                                Found {totalCount} occurrence{totalCount !== 1 ? 's' : ''} {totalCount > results.length ? <span className="text-xs text-slate-400">(showing first {results.length})</span> : null}
                            </div>
                        )}
                    </div>

                    <div className="section-card">
                        <div className="title">Daily Verse</div>
                        <p className="text-sm text-slate-600 mb-4">Get a random verse from the bundled translations to inspire your study.</p>

                        <DailyVerse />

                    </div>
                </div>
            </div>
        </div>
    );
}