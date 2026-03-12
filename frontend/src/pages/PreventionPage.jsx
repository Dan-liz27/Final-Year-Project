import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb';
import ArticleCard from '../components/ArticleCard';
import ArticleModal from '../components/ArticleModal';
import VideoCard from '../components/VideoCard';
import educationalContent from '../data/educationalContent.json';

export default function PreventionPage() {
    const navigate = useNavigate();
    const [selectedArticle, setSelectedArticle] = useState(null);
    const { preventionTips, preventionArticles, preventionVideos } = educationalContent;

    const categoryColors = {
        'Sun Protection 101': 'from-yellow-500 to-orange-500',
        'Daily Skincare Routine': 'from-blue-500 to-cyan-500',
        'Healthy Lifestyle for Healthy Skin': 'from-green-500 to-emerald-500',
        'Regular Monitoring': 'from-purple-500 to-pink-500'
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <Breadcrumb />

                <motion.div className="mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
                            Prevention & Care
                        </h1>
                        <button onClick={() => navigate('/learn')} className="px-4 py-2 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Learn Hub</span>
                        </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Daily skincare routines, sun protection, and healthy lifestyle tips for optimal skin health.
                    </p>
                </motion.div>

                <motion.div className="mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="text-3xl">💊</span>
                        Prevention Tips
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {preventionTips.map((category, index) => (
                            <motion.div key={category.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 hover:border-green-500/50 transition-all shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[category.title] || 'from-gray-500 to-gray-600'} flex items-center justify-center text-2xl`}>
                                        {category.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category.title}</h3>
                                </div>
                                <ul className="space-y-3">
                                    {category.tips.map((tip, tipIndex) => (
                                        <li key={tipIndex} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                            <span className="text-green-400 mt-1">✓</span>
                                            <span className="text-sm">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Prevention Articles */}
                {preventionArticles && preventionArticles.length > 0 && (
                    <motion.div className="mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="text-3xl">📚</span>
                            Prevention & Care Articles
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {preventionArticles.map((article, index) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    onClick={() => setSelectedArticle(article)}
                                    className="cursor-pointer"
                                >
                                    <ArticleCard article={article} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Video Tutorials - Only show if videos exist */}
                {preventionVideos && preventionVideos.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="text-3xl">🎥</span>
                            Video Tutorials
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {preventionVideos.map((video, index) => (
                                <motion.div key={video.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }}>
                                    <VideoCard video={video} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Article Modal */}
            {selectedArticle && (
                <ArticleModal
                    article={selectedArticle}
                    onClose={() => setSelectedArticle(null)}
                />
            )}
        </div>
    );
}
