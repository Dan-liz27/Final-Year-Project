import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ArticleModal({ article, onClose }) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!article) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-slate-700 p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
                                    {article.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {article.title}
                                    </h2>
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg">
                                            {article.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {article.readTime} min read
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-slate-700/50 hover:bg-red-500/20 border border-slate-600 hover:border-red-500/50 text-gray-400 hover:text-red-400 transition-all"
                                aria-label="Close"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto p-6 custom-scrollbar" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                        <div className="prose prose-invert prose-cyan max-w-none">
                            {article.content.split('\n\n').map((paragraph, index) => {
                                // Check if paragraph is a heading (starts with **)
                                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                    const heading = paragraph.replace(/\*\*/g, '');
                                    return (
                                        <h3 key={index} className="text-xl font-bold text-cyan-400 mt-6 mb-3 flex items-center gap-2">
                                            <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
                                            {heading}
                                        </h3>
                                    );
                                }

                                // Check if paragraph contains bold text
                                if (paragraph.includes('**')) {
                                    const parts = paragraph.split('**');
                                    return (
                                        <p key={index} className="text-gray-300 leading-relaxed mb-4">
                                            {parts.map((part, i) =>
                                                i % 2 === 0 ? part : <strong key={i} className="text-white font-semibold">{part}</strong>
                                            )}
                                        </p>
                                    );
                                }

                                // Regular paragraph
                                return (
                                    <p key={index} className="text-gray-300 leading-relaxed mb-4">
                                        {paragraph}
                                    </p>
                                );
                            })}
                        </div>

                        {/* Medical Disclaimer */}
                        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                    <h4 className="text-yellow-400 font-semibold mb-1">Medical Disclaimer</h4>
                                    <p className="text-gray-400 text-sm">
                                        This information is for educational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-xl border-t border-slate-700 p-4">
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/50"
                        >
                            Close Article
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
