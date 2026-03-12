import React from 'react';
import { motion } from 'framer-motion';

export default function ArticleCard({ article }) {
    return (
        <motion.div
            className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden shadow-lg"
            whileHover={{ y: -5, scale: 1.02 }}
        >
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Content */}
            <div className="relative z-10">
                {/* Icon and Category */}
                <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-3xl shadow-lg">
                        {article.icon}
                    </div>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-lg text-sm font-semibold">
                        {article.category}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                </p>

                {/* Read Time */}
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{article.readTime} min read</span>
                </div>

                {/* Click to Read Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between text-cyan-600 dark:text-cyan-400 text-sm font-semibold">
                    <span>Click to read full article</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity -z-10" />
        </motion.div>
    );
}
