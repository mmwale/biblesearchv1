import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Badge } from "../ui/badge";

// When the dropdown scrolls we dispatch a small event the header listens to so it can hide/reveal even
// when the overall page scroll position does not change.

const versionColors = {
    KJV: "bg-blue-100 text-blue-700 border-blue-200",
    NKJV: "bg-purple-100 text-purple-700 border-purple-200",
    NIV: "bg-green-100 text-green-700 border-green-200",
    ESV: "bg-amber-100 text-amber-700 border-amber-200",
    ISV: "bg-rose-100 text-rose-700 border-rose-200",
    ASV: "bg-cyan-100 text-cyan-700 border-cyan-200"
};

export default function SearchResults({ results, searchTerm, onResultClick, isLoading }) {
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 z-50 flex items-center justify-center"
            >
                <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
            </motion.div>
        );
    }

    if (!results || results.length === 0) {
        if (searchTerm && searchTerm.length > 1) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 z-50 text-center"
                >
                    <p className="text-slate-500">No results found for "{searchTerm}"</p>
                </motion.div>
            );
        }
        return null;
    }

    const highlightText = (text, term) => {
        if (!term) return text;
        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) => 
            regex.test(part) ? 
                <mark key={i} className="bg-amber-200/60 text-slate-900 rounded px-0.5">{part}</mark> : 
                part
        );
    };

    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.version]) acc[result.version] = [];
        acc[result.version].push(result);
        return acc;
    }, {});

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[70vh] overflow-y-auto z-50"
            onScroll={(e) => {
                try {
                    const top = e.target.scrollTop || 0;
                    window.dispatchEvent(new CustomEvent('searchResultsScroll', { detail: { scrollTop: top } }));
                } catch (err) {}
            }}
            onWheel={() => {
                // also notify on wheel when scroll could be in progress
                window.dispatchEvent(new CustomEvent('searchResultsScroll', { detail: { scrollTop: 1 } }));
            }}
        >
            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl sticky top-0 z-10">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-slate-700">
                            Found {results.length}{results.length >= 100 ? '+' : ''} occurrence{results.length !== 1 ? 's' : ''}
                            {/* If we show 100+ results we append '+' to indicate truncation (we only display up to 100 entries) */}
                        </span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                        {Object.keys(groupedResults).map(version => (
                            <Badge key={version} variant="outline" className={`${versionColors[version] || 'bg-gray-100 text-gray-700'} border text-xs`}>
                                {version} ({groupedResults[version].length})
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-2">
                {results.map((result, index) => (
                    <Link
                        key={`${result.id}-${index}`}
                        to={`${createPageUrl('Reader')}?version=${result.version}&book=${encodeURIComponent(result.book)}&chapter=${result.chapter}&verse=${result.verse}&highlight=${encodeURIComponent(searchTerm)}`}
                        onClick={() => onResultClick(result)}
                        className="block p-4 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-slate-200"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge className={`${versionColors[result.version] || 'bg-gray-100 text-gray-700'} border text-xs`}>
                                        {result.version}
                                    </Badge>
                                    <span className="text-sm font-semibold text-slate-900">
                                        {result.book} {result.chapter}:{result.verse}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                                    {highlightText(result.text, searchTerm)}
                                </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                        </div>
                    </Link>
                ))}
            </div>
        </motion.div>
    );
}