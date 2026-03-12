import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import educationalContent from '../data/educationalContent.json';

export default function FAQSection() {
    const [expandedId, setExpandedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...new Set(educationalContent.faqs.map(faq => faq.category))];

    // Filter FAQs based on search and category
    const filteredFAQs = educationalContent.faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleFAQ = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Frequently Asked Questions</h2>
                <p className="text-gray-600 dark:text-gray-400">Find answers to common questions about the app and skin health</p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Bar */}
                <div className="flex-1 relative">
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-700 focus:border-cyan-500 focus:outline-none transition-colors"
                    />
                </div>

                {/* Category Filter */}
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 border border-gray-300 dark:border-slate-700 focus:border-cyan-500 focus:outline-none transition-colors"
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            {/* Results Count */}
            {searchQuery && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''}
                </p>
            )}

            {/* FAQ List */}
            <div className="space-y-3">
                {filteredFAQs.length > 0 ? (
                    filteredFAQs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            className="bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-xl rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all shadow-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            {/* Question */}
                            <button
                                onClick={() => toggleFAQ(faq.id)}
                                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-gray-100 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex items-start gap-3 flex-1">
                                    <span className="text-cyan-400 text-xl flex-shrink-0 mt-1">
                                        {expandedId === faq.id ? '−' : '+'}
                                    </span>
                                    <div className="flex-1">
                                        <span className="text-xs text-cyan-400 uppercase tracking-wider">{faq.category}</span>
                                        <h3 className="text-gray-900 dark:text-white font-semibold mt-1">{faq.question}</h3>
                                    </div>
                                </div>
                                <svg
                                    className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${expandedId === faq.id ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Answer */}
                            <AnimatePresence>
                                {expandedId === faq.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-5 pl-14">
                                            <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border-l-4 border-cyan-500">
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-600 dark:text-gray-400">No questions found matching your search.</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All');
                            }}
                            className="mt-4 text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* Help Footer */}
            <motion.div
                className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-xl p-6 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h4 className="text-cyan-400 font-bold mb-2">Still have questions?</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                            If you couldn't find the answer you're looking for, remember that this app is designed to assist, not replace professional medical advice. For specific concerns about your skin health, please consult a qualified dermatologist.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
