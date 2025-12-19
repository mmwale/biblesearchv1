/*
 * Pages/Reader.js
 * Page wrapper for the BibleReader component. Reads URL params and passes them down.
 */
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import BibleReader from "../Components/reader/biblereader";
import { Button } from "../Components/ui/button";
import { createPageUrl } from "../utils";

export default function Reader() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const params = {
        version: urlParams.get('version') || 'KJV',
        book: urlParams.get('book') || 'Genesis',
        chapter: parseInt(urlParams.get('chapter')) || 1,
        verse: parseInt(urlParams.get('verse')) || null,
        highlight: urlParams.get('highlight') || ''
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="mb-6">
                        <Button
                            asChild
                            variant="ghost"
                            className="rounded-full hover:bg-slate-100"
                        >
                            <Link to={createPageUrl('Home')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Search
                            </Link>
                        </Button>
                    </div>

                    <BibleReader
                        version={params.version}
                        book={params.book}
                        chapter={params.chapter}
                        highlightVerse={params.verse}
                        highlightTerm={params.highlight}
                    />
                </motion.div>
            </div>
        </div>
    );
}