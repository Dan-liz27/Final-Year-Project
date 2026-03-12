import React from 'react';
import { motion } from 'framer-motion';

export default function RecommendationsCard({ recommendations }) {
    if (!recommendations || recommendations.length === 0) {
        return (
            <motion.div
                className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-cyan-500/20 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></span>
                    PERSONALIZED RECOMMENDATIONS
                </h3>
                <div className="text-center py-8">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-gray-600 dark:text-gray-400">Complete your profile to get personalized recommendations</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></span>
                    PERSONALIZED RECOMMENDATIONS
                </h3>
                <div className="bg-cyan-500/20 px-3 py-1 rounded-full">
                    <span className="text-cyan-600 dark:text-cyan-400 text-sm font-bold">{recommendations.length} Tips</span>
                </div>
            </div>

            <div className="space-y-3">
                {recommendations.map((rec, index) => (
                    <motion.div
                        key={index}
                        className="bg-gray-100 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-300 dark:border-cyan-500/20 hover:border-cyan-500/40 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="text-3xl flex-shrink-0">{rec.icon}</div>
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-cyan-400 font-bold text-sm uppercase tracking-wide">
                                        {rec.category}
                                    </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{rec.tip}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-cyan-500/20">
                <p className="text-gray-600 dark:text-gray-400 text-xs text-center">
                    💡 These recommendations are based on your profile and prediction history
                </p>
            </div>
        </motion.div>
    );
}
