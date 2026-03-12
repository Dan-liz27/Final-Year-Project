import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from '../LanguageSwitcher';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { stats } = useApp();
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    const isActive = (path) => {
        // Special handling for learn routes - match all /learn/* paths
        if (path === '/learn') {
            return location.pathname.startsWith('/learn');
        }
        return location.pathname === path;
    };

    const navLinkClass = (path) =>
        `px-4 py-2 rounded-lg transition-all duration-300 ${isActive(path)
            ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-semibold shadow-lg shadow-cyan-500/50 border border-cyan-500/50'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-cyan-600 dark:hover:text-cyan-400 border border-transparent'
        }`;

    const handleLogout = () => {
        logout();
        navigate('/welcome');
    };

    return (
        <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-gray-200/50 dark:shadow-cyan-500/10 sticky top-0 z-50 border-b border-gray-200 dark:border-cyan-500/20">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
                        <motion.div
                            className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2 rounded-lg shadow-lg shadow-cyan-500/50"
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <svg className="w-6 h-6 text-white dark:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </motion.div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-300 dark:to-blue-400">
                            SKIN CLASSIFIER
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center gap-2">
                        <Link to="/" className={navLinkClass('/')}>
                            <span className="hidden sm:inline">{t('nav.home')}</span>
                            <span className="sm:hidden">🏠</span>
                        </Link>
                        <Link to="/upload" id="upload-link" className={navLinkClass('/upload')}>
                            <span className="hidden sm:inline">{t('nav.upload')}</span>
                            <span className="sm:hidden">📸</span>
                        </Link>
                        <Link to="/history" id="history-link" className={navLinkClass('/history')}>
                            <span className="hidden sm:inline">{t('nav.history')}</span>
                            <span className="sm:hidden">📜</span>
                            {stats.total > 0 && (
                                <motion.span
                                    className="ml-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs px-2 py-0.5 rounded-full shadow-lg font-bold"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring" }}
                                >
                                    {stats.total}
                                </motion.span>
                            )}
                        </Link>
                        <Link to="/learn" id="learn-link" className={navLinkClass('/learn')}>
                            <span className="hidden sm:inline">{t('nav.learn')}</span>
                            <span className="sm:hidden">📚</span>
                        </Link>
                        <Link to="/profile" id="profile-link" className={navLinkClass('/profile')}>
                            <span className="hidden sm:inline">{t('nav.profile')}</span>
                            <span className="sm:hidden">👤</span>
                        </Link>

                        {/* User Menu */}
                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-300 dark:border-cyan-500/30">
                            {/* Language Switcher */}
                            <LanguageSwitcher />
                            {/* Theme Toggle */}
                            <ThemeToggle />

                            <motion.button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg transition-all text-sm font-semibold shadow-lg shadow-red-500/30"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="hidden sm:inline">{t('nav.logout')}</span>
                                <span className="sm:hidden">🚪</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
