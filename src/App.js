/*
 * App.js
 * Top-level application shell: navigation, layout, and footer.
 * - Manages sticky navigation visuals and auto-hide-on-scroll behavior
 * - Exposes `currentPageName` so nav items can render as active
 */
import { BookOpen, FileText, Search } from "lucide-react";
import { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";

export default function App({ children, currentPageName }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [headerHidden, setHeaderHidden] = useState(false);
    const lastY = useRef(0);
    const lastSearchTop = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            // Read the current vertical scroll position and compute delta since last frame
            const y = window.scrollY || 0;
            const delta = y - (lastY.current || 0);

            // Small threshold to prevent flicker from micro-scrolls (e.g., touch bounce)
            if (Math.abs(delta) > 3) {
                // If near the top, always reveal the header so the page feels anchored
                if (y < 60) {
                    setHeaderHidden(false);
                } else if (delta > 0) {
                    // scrolling down — hide header to give more screen space
                    setHeaderHidden(true);
                } else if (delta < 0) {
                    // scrolling up — reveal header for navigation
                    setHeaderHidden(false);
                }
            }

            // Persist last Y for direction detection and update the 'scrolled' visual state
            lastY.current = y;
            setIsScrolled(y > 30);
        };

        const onSearchScroll = (e) => {
            // Handle scroll events coming from the search results dropdown which has its own scroll
            // This helps the header react when the page itself doesn't move (e.g., results panel scroll)
            const top = e?.detail?.scrollTop || 0;
            const delta = top - (lastSearchTop.current || 0);
            if (Math.abs(delta) > 3) {
                // If user scrolls down inside the dropdown, prefer hiding the header; reveal on scroll up
                if (top > lastSearchTop.current && top > 10) {
                    setHeaderHidden(true);
                } else {
                    setHeaderHidden(false);
                }
            }
            lastSearchTop.current = top;
            setIsScrolled(top > 0 || window.scrollY > 30);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('searchResultsScroll', onSearchScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('searchResultsScroll', onSearchScroll);
        };
    }, []);

    const navItems = [
        { name: 'Home', icon: Search, label: 'Search' },
        { name: 'Documents', icon: FileText, label: 'Resources' }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className={`sticky-nav ${isScrolled ? 'scrolled' : ''} ${headerHidden ? 'hide-up' : ''}`} >
                <div className="header-inner">
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <div className="flex items-center gap-3 hover:opacity-80 transition-opacity" style={{cursor: 'pointer'}}>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 hidden sm:block">Bible Search</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Link 
                            to={createPageUrl('Home')} 
                            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-900 hidden sm:block">
                                Bible Search
                            </span>
                        </Link>

                        <div className="flex items-center gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPageName === item.name;
                                return (
                                    <Link
                                        key={item.name}
                                        to={createPageUrl(item.name)}
                                        className={`nav-button flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${isActive ? 'active' : ''}`}
                                      >
                                        <Icon className="w-4 h-4" />
                                        <span className="hidden sm:inline">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-8 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-400 text-sm">
                        © {new Date().getFullYear()} Bible Search. All rights reserved.
                    </p>
                    <p className="text-slate-500 text-xs mt-2">
                        "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." - John 3:16
                    </p>
                </div>
            </footer>
        </div>
    );
}
