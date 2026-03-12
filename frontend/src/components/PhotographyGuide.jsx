import React from 'react';
import { motion } from 'framer-motion';
import educationalContent from '../data/educationalContent.json';

export default function PhotographyGuide() {
    const { photographyTips } = educationalContent;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{photographyTips.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">{photographyTips.description}</p>
            </div>

            {/* Do's Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Do's - Best Practices</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {photographyTips.dos.map((tip, index) => (
                        <motion.div
                            key={index}
                            className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-5 hover:border-green-500/50 transition-all"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-3xl">{tip.icon}</span>
                                <div>
                                    <h4 className="text-green-400 font-bold mb-2">{tip.title}</h4>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{tip.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Don'ts Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-red-500 to-rose-600 p-3 rounded-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Don'ts - Common Mistakes</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {photographyTips.donts.map((tip, index) => (
                        <motion.div
                            key={index}
                            className="bg-gradient-to-br from-red-900/20 to-rose-900/20 border border-red-500/30 rounded-xl p-5 hover:border-red-500/50 transition-all"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-3xl">{tip.icon}</span>
                                <div>
                                    <h4 className="text-red-400 font-bold mb-2">{tip.title}</h4>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{tip.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Common Mistakes Summary */}
            <motion.div
                className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-start gap-3 mb-4">
                    <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <h4 className="text-yellow-400 font-bold mb-3">⚠️ Most Common Mistakes to Avoid:</h4>
                        <ul className="space-y-2">
                            {photographyTips.commonMistakes.map((mistake, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                                    <span className="text-yellow-400 mt-1">•</span>
                                    <span>{mistake}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </motion.div>

            {/* Pro Tip */}
            <motion.div
                className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <div>
                        <h4 className="text-cyan-400 font-bold mb-2">💡 Pro Tip</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            Take multiple photos from different angles and in different lighting conditions. This gives you options to choose the clearest image and helps ensure the AI has the best possible input for accurate analysis. Remember: quality over quantity!
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
