import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb';
import PhotographyGuide from '../components/PhotographyGuide';
import VideoCard from '../components/VideoCard';
import educationalContent from '../data/educationalContent.json';

export default function PhotographyPage() {
    const navigate = useNavigate();
    const { photographyVideos } = educationalContent;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <Breadcrumb />

                <motion.div className="mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                            Photography Tips
                        </h1>
                        <button onClick={() => navigate('/learn')} className="px-4 py-2 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Learn Hub</span>
                        </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Master the art of taking quality skin photos for accurate AI analysis.
                    </p>
                </motion.div>

                <motion.div className="mb-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <PhotographyGuide />
                </motion.div>

                {/* Video Tutorials - Only show if videos exist */}
                {photographyVideos && photographyVideos.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="text-3xl">🎥</span>
                            Video Tutorials
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {photographyVideos.map((video, index) => (
                                <motion.div key={video.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1 }}>
                                    <VideoCard video={video} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
