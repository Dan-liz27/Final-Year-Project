import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/layout/ThemeToggle';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Welcome() {
    const { isAuthenticated } = useAuth();
    const { theme } = useTheme();
    const { t } = useTranslation();

    const howItWorks = [
        { step: '1', icon: '📱', title: t('welcome.step1Title'), description: t('welcome.step1Desc') },
        { step: '2', icon: '📸', title: t('welcome.step2Title'), description: t('welcome.step2Desc') },
        { step: '3', icon: '🤖', title: t('welcome.step3Title'), description: t('welcome.step3Desc') },
        { step: '4', icon: '📊', title: t('welcome.step4Title'), description: t('welcome.step4Desc') },
    ];

    const features = [
        { icon: '🎯', title: t('welcome.feature1Title'), description: t('welcome.feature1Desc') },
        { icon: '⚡', title: t('welcome.feature2Title'), description: t('welcome.feature2Desc') },
        { icon: '🔒', title: t('welcome.feature3Title'), description: t('welcome.feature3Desc') },
        { icon: '📚', title: t('welcome.feature4Title'), description: t('welcome.feature4Desc') },
        { icon: '📜', title: t('welcome.feature5Title'), description: t('welcome.feature5Desc') },
        { icon: '🌍', title: t('welcome.feature6Title'), description: t('welcome.feature6Desc') },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950">
            {/* Navbar */}
            <nav className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-b border-white/20 dark:border-cyan-500/20 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-blue-500 p-2 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400">
                            {t('welcome.navAppName')}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <ThemeToggle />
                        {isAuthenticated ? (
                            <Link to="/" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                                {t('welcome.goToApp')}
                            </Link>
                        ) : (
                            <>
                                <Link to="/login" className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-cyan-400 font-semibold transition-colors">
                                    {t('welcome.login')}
                                </Link>
                                <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                                    {t('welcome.signUp')}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <motion.div className="text-center max-w-4xl mx-auto mb-16"
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">
                        {t('welcome.heroTitle')}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        {t('welcome.heroSubtitle')}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/signup">
                                    <motion.button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-blue-600 text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/50 transition-all"
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        {t('welcome.getStartedFree')}
                                    </motion.button>
                                </Link>
                                <Link to="/login">
                                    <motion.button className="px-8 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl text-gray-800 dark:text-white text-lg font-semibold rounded-xl border-2 border-blue-600 dark:border-cyan-400 hover:bg-white/80 dark:hover:bg-slate-700/60 transition-all"
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        {t('welcome.signIn')}
                                    </motion.button>
                                </Link>
                            </>
                        ) : (
                            <Link to="/">
                                <motion.button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-blue-600 text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/50 transition-all"
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    {t('welcome.launchApp')}
                                </motion.button>
                            </Link>
                        )}
                    </div>
                </motion.div>

                {/* What is This Section */}
                <motion.div className="mb-16 max-w-4xl mx-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-cyan-500/20"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center">{t('welcome.whatIsTitle')}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{t('welcome.whatIsBody1')}</p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{t('welcome.whatIsBody2')}</p>
                </motion.div>

                {/* How It Works */}
                <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-12 text-center">{t('welcome.howItWorksTitle')}</h2>
                    <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {howItWorks.map((item, index) => (
                            <motion.div key={item.step}
                                className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-cyan-500/20 hover:border-blue-400 dark:hover:border-cyan-400 transition-all"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }} whileHover={{ y: -5 }}>
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                    {item.step}
                                </div>
                                <div className="text-5xl mb-4 mt-4 text-center">{item.icon}</div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 text-center">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm text-center">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-12 text-center">{t('welcome.whyChooseTitle')}</h2>
                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <motion.div key={index}
                                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-cyan-500/20 hover:shadow-xl transition-all"
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.05 }} whileHover={{ y: -5 }}>
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div className="mb-16 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-cyan-500/20 max-w-4xl mx-auto"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-blue-400 mb-2">35</div>
                            <div className="text-gray-600 dark:text-gray-300 font-semibold">{t('welcome.statClasses')}</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-2">262K</div>
                            <div className="text-gray-600 dark:text-gray-300 font-semibold">{t('welcome.statImages')}</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-blue-600 dark:from-pink-400 dark:to-cyan-400 mb-2">98.7%</div>
                            <div className="text-gray-600 dark:text-gray-300 font-semibold">{t('welcome.statAccuracy')}</div>
                        </div>
                    </div>
                </motion.div>

                {/* Disclaimer */}
                <motion.div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">⚠️</span>
                        <div>
                            <h3 className="text-yellow-600 dark:text-yellow-400 font-semibold mb-2">{t('welcome.disclaimerTitle')}</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{t('welcome.disclaimerBody')}</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="mt-20 bg-gray-900 dark:bg-black text-gray-400 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="mb-2">{t('welcome.footerText')}</p>
                    <p className="text-sm">{t('welcome.footerSub')}</p>
                </div>
            </footer>
        </div>
    );
}
