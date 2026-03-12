import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function HistoryPage() {
    const { history, clearHistory } = useApp();
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Filter and sort history
    let filteredHistory = history.filter(item =>
        item.prediction.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === 'newest') {
        filteredHistory = [...filteredHistory].reverse();
    } else if (sortBy === 'confidence-high') {
        filteredHistory = [...filteredHistory].sort((a, b) => b.confidence - a.confidence);
    } else if (sortBy === 'confidence-low') {
        filteredHistory = [...filteredHistory].sort((a, b) => a.confidence - b.confidence);
    }

    const handleClearHistory = () => {
        if (window.confirm(t('history.clearConfirm'))) {
            clearHistory();
            toast.success(t('history.cleared'));
        }
    };

    const getConfidenceColor = (confidence) => {
        const conf = confidence * 100;
        if (conf >= 90) return { color: 'cyan', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' };
        if (conf >= 70) return { color: 'yellow', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' };
        return { color: 'red', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <motion.h1
                                className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                PREDICTION HISTORY
                                {/* t('history.pageTitle') */}
                            </motion.h1>
                            <p className="text-gray-400 text-lg flex items-center gap-2">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                                {t('history.pageSubtitle')}
                            </p>
                        </div>
                        {history.length > 0 && (
                            <motion.button
                                onClick={handleClearHistory}
                                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/50 transition-all"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t('history.clearAll')}
                            </motion.button>
                        )}
                    </div>
                </div>

                {history.length === 0 ? (
                    <motion.div
                        className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-16 text-center border border-gray-200 dark:border-cyan-500/20"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <svg className="w-24 h-24 mx-auto text-cyan-400/50 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-2xl font-bold text-gray-300 mb-3">{t('history.noHistory')}</h3>
                        <p className="text-gray-500 mb-6">{t('history.noHistoryDesc')}</p>
                        <a href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                            {t('history.makeFirstPrediction')}
                        </a>
                    </motion.div>
                ) : (
                    <>
                        {/* Controls */}
                        <motion.div
                            className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-gray-200 dark:border-cyan-500/20 shadow-xl"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex flex-wrap gap-4 items-center">
                                {/* Search */}
                                <div className="flex-grow min-w-[250px]">
                                    <div className="relative">
                                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder={t('history.searchPlaceholder')}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-gray-300 dark:border-cyan-500/30 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Sort */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-gray-300 dark:border-cyan-500/30 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all cursor-pointer"
                                >
                                    <option value="newest">{t('history.newestFirst')}</option>
                                    <option value="oldest">{t('history.oldestFirst')}</option>
                                    <option value="confidence-high">{t('history.highestConf')}</option>
                                    <option value="confidence-low">{t('history.lowestConf')}</option>
                                </select>

                                {/* View Toggle */}
                                <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl border border-cyan-500/20">
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' : 'text-gray-400 hover:text-cyan-400'}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' : 'text-gray-400 hover:text-cyan-400'}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-gray-400 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                                {t('history.showing')} <span className="text-cyan-400 font-semibold">{filteredHistory.length}</span> {t('history.of')} <span className="text-cyan-400 font-semibold">{history.length}</span> {t('history.predictions')}
                            </div>
                        </motion.div>

                        {/* History Display */}
                        <AnimatePresence mode="wait">
                            {viewMode === 'list' ? (
                                <motion.div
                                    key="list-view"
                                    className="space-y-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {filteredHistory.map((item, index) => {
                                        const conf = item.confidence * 100;
                                        const colors = getConfidenceColor(item.confidence);

                                        return (
                                            <motion.div
                                                key={item.id || index}
                                                className={`bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border ${colors.border} shadow-xl hover:shadow-2xl transition-all`}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                whileHover={{ x: 5, borderColor: `rgba(6, 182, 212, 0.5)` }}
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="relative group">
                                                        <img
                                                            src={item.imageUrl}
                                                            alt="Prediction"
                                                            className="w-28 h-28 object-cover rounded-xl border-2 border-cyan-500/30 group-hover:border-cyan-500/60 transition-all"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h3 className="text-xl font-bold text-white mb-2">{item.prediction}</h3>
                                                        <p className="text-sm text-gray-400 flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {new Date(item.timestamp).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`px-6 py-3 rounded-xl bg-gradient-to-r from-${colors.color}-500 to-${colors.color}-600 text-slate-900 font-bold text-xl shadow-lg shadow-${colors.color}-500/50`}>
                                                            {conf.toFixed(1)}%
                                                        </div>
                                                        <p className={`text-xs ${colors.text} mt-2 font-semibold uppercase tracking-wider`}>
                                                            {conf >= 90 ? t('history.highConfidence') : conf >= 70 ? t('history.mediumConfidence') : t('history.lowConfidence')} {t('history.confidence')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="grid-view"
                                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {filteredHistory.map((item, index) => {
                                        const conf = item.confidence * 100;
                                        const colors = getConfidenceColor(item.confidence);

                                        return (
                                            <motion.div
                                                key={item.id || index}
                                                className={`bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border ${colors.border} shadow-xl hover:shadow-2xl transition-all group`}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                whileHover={{ y: -8, borderColor: `rgba(6, 182, 212, 0.5)` }}
                                            >
                                                <div className="relative overflow-hidden">
                                                    <img
                                                        src={item.imageUrl}
                                                        alt="Prediction"
                                                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60"></div>
                                                    <div className={`absolute top-4 right-4 px-4 py-2 rounded-lg bg-gradient-to-r from-${colors.color}-500 to-${colors.color}-600 text-slate-900 font-bold text-lg shadow-lg shadow-${colors.color}-500/50`}>
                                                        {conf.toFixed(1)}%
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="font-bold text-white text-lg mb-3 line-clamp-2 min-h-[3.5rem]">{item.prediction}</h3>
                                                    <p className="text-xs text-gray-400 mb-3 flex items-center gap-2">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {new Date(item.timestamp).toLocaleString()}
                                                    </p>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${colors.bg} border ${colors.border}`}>
                                                        <span className={`w-2 h-2 ${colors.bg.replace('/10', '')} rounded-full animate-pulse`}></span>
                                                        <span className={`text-sm font-semibold ${colors.text} uppercase tracking-wider`}>
                                                            {conf >= 90 ? t('history.highConfidence') : conf >= 70 ? t('history.mediumConfidence') : t('history.lowConfidence')} {t('history.confidence')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
}
