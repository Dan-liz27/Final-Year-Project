import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb';
import ArticleCard from '../components/ArticleCard';
import ArticleModal from '../components/ArticleModal';
import VideoCard from '../components/VideoCard';
import educationalContent from '../data/educationalContent.json';

export default function ArticlesPage() {
    const navigate = useNavigate();
    const [selectedArticle, setSelectedArticle] = useState(null);
    const { articles, articleVideos } = educationalContent;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <Breadcrumb />

                {/* Header */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">
                            Skin Health Articles
                        </h1>
                        <button
                            onClick={() => navigate('/learn')}
                            className="px-4 py-2 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Learn Hub</span>
                        </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Comprehensive guides to understanding your skin, common conditions, and warning signs to watch for.
                    </p>
                </motion.div>

                {/* Articles Grid */}
                <motion.div
                    className="mb-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="text-3xl">📚</span>
                        Educational Articles
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {articles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => setSelectedArticle(article)}
                                className="cursor-pointer"
                            >
                                <ArticleCard article={article} />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Video Tutorials - Only show if videos exist */}
                {articleVideos && articleVideos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="text-3xl">🎥</span>
                            Video Tutorials
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {articleVideos.map((video, index) => (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                >
                                    <VideoCard video={video} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Disclaimer */}
                <motion.div
                    className="mt-12 p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <h3 className="text-yellow-600 dark:text-yellow-400 font-semibold mb-2">Medical Disclaimer</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                The information provided in these articles is for educational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any medical concerns.
                            </p>
                        </div>
                    </div>
                </motion.div>
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
