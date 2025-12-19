/*
 * searchbar.js
 * Controlled search input used on the Home page. Auto-focuses on mount and exposes handlers for search/clear.
 */
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useRef } from 'react';
import { Input } from "../ui/input";

export default function SearchBar({ onSearch, onClear, value, onChange }) {
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            onSearch(value);
        }
    };

    const handleClear = () => {
        onChange('');
        onClear();
        inputRef.current?.focus();
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                <Input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search for any word or phrase in the Bible..."
                    className="pl-12 pr-12 py-6 text-base border-2 border-slate-200 rounded-2xl focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 transition-all shadow-sm hover:shadow-md"
                />
                <AnimatePresence>
                    {value && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            type="button"
                            onClick={handleClear}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-4 h-4 text-slate-400" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </form>
    );
}