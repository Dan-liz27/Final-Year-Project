import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'hi', flag: '🇮🇳', label: 'हिन्दी' },
    { code: 'ta', flag: '🇮🇳', label: 'தமிழ்' },
    { code: 'fr', flag: '🇫🇷', label: 'Français' },
    { code: 'es', flag: '🇪🇸', label: 'Español' },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem('i18nextLng', code);
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            {/* Trigger Button */}
            <motion.button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 dark:border-cyan-500/40 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-gray-700 dark:text-gray-200 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all text-sm font-medium shadow-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-label="Switch language"
                title="Switch language"
            >
                <span className="text-lg leading-none">{current.flag}</span>
                <span className="hidden sm:inline max-w-[60px] truncate">{current.label}</span>
                <svg
                    className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </motion.button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 border border-gray-200 dark:border-cyan-500/30 rounded-xl shadow-2xl shadow-black/20 z-50 overflow-hidden"
                    >
                        {LANGUAGES.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => handleSelect(lang.code)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                                    ${lang.code === i18n.language
                                        ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-semibold'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/60'
                                    }`}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                <span>{lang.label}</span>
                                {lang.code === i18n.language && (
                                    <span className="ml-auto">✓</span>
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
