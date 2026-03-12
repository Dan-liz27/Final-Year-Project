import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ArticleCard from '../components/ArticleCard';
import PhotographyGuide from '../components/PhotographyGuide';
import FAQSection from '../components/FAQSection';
import educationalContent from '../data/educationalContent.json';

export default function Learn() {
    const [activeTab, setActiveTab] = useState('articles');

    const tabs = [
        { id: 'articles', name: 'Articles', icon: '📚' },
        { id: 'photography', name: 'Photography Tips', icon: '📸' },
        { id: 'prevention', name: 'Prevention & Care', icon: '💊' },
        { id: 'doctor', name: 'When to See a Doctor', icon: '🏥' },
        { id: 'faq', name: 'FAQ', icon: '❓' }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-10 text-center">
                    <motion.h1
                        className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        LEARN ABOUT SKIN HEALTH
                    </motion.h1>
                    <p className="text-gray-400 text-lg">
                        Educational resources to help you understand and monitor your skin health
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-3 mb-8 justify-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                                    : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            <span className="text-xl">{tab.icon}</span>
                            <span>{tab.name}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Articles Tab */}
                    {activeTab === 'articles' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {educationalContent.articles.map((article) => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    )}

                    {/* Photography Tips Tab */}
                    {activeTab === 'photography' && <PhotographyGuide />}

                    {/* Prevention & Care Tab */}
                    {activeTab === 'prevention' && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-3">Prevention & Daily Care</h2>
                                <p className="text-gray-400 text-lg">Essential tips for maintaining healthy skin</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {educationalContent.preventionTips.map((section, index) => (
                                    <motion.div
                                        key={section.id}
                                        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-4xl">{section.icon}</span>
                                            <div>
                                                <span className="text-xs text-cyan-400 uppercase tracking-wider">{section.category}</span>
                                                <h3 className="text-xl font-bold text-white">{section.title}</h3>
                                            </div>
                                        </div>
                                        <ul className="space-y-3">
                                            {section.tips.map((tip, tipIndex) => (
                                                <li key={tipIndex} className="flex items-start gap-3">
                                                    <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span className="text-gray-300 text-sm leading-relaxed">{tip}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* When to See a Doctor Tab */}
                    {activeTab === 'doctor' && (
                        <div className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-3">When to See a Dermatologist</h2>
                                <p className="text-gray-400 text-lg">Know when professional medical attention is needed</p>
                            </div>

                            {/* Urgent Cases */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-gradient-to-r from-red-500 to-rose-600 p-3 rounded-xl">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Urgent - See a Doctor Soon</h3>
                                </div>

                                <div className="space-y-3">
                                    {educationalContent.whenToSeeDoctor.urgent.map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className={`bg-gradient-to-br ${item.severity === 'high'
                                                    ? 'from-red-900/20 to-rose-900/20 border-red-500/30'
                                                    : 'from-yellow-900/20 to-orange-900/20 border-yellow-500/30'
                                                } border rounded-xl p-5`}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className={`p-2 rounded-lg ${item.severity === 'high' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                                                    }`}>
                                                    <svg className={`w-6 h-6 ${item.severity === 'high' ? 'text-red-400' : 'text-yellow-400'
                                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`font-bold mb-2 ${item.severity === 'high' ? 'text-red-400' : 'text-yellow-400'
                                                        }`}>{item.symptom}</h4>
                                                    <p className="text-gray-300 text-sm">{item.action}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Routine Checkups */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Routine Checkups</h3>
                                </div>

                                <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
                                    <ul className="space-y-3">
                                        {educationalContent.whenToSeeDoctor.routine.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-gray-300">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>

                            {/* Emergency */}
                            <motion.div
                                className="bg-gradient-to-r from-red-900/30 to-rose-900/30 border-2 border-red-500/50 rounded-xl p-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-start gap-3">
                                    <svg className="w-8 h-8 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <div>
                                        <h4 className="text-red-400 font-bold text-lg mb-3">🚨 Seek Emergency Care Immediately:</h4>
                                        <ul className="space-y-2">
                                            {educationalContent.whenToSeeDoctor.emergency.map((item, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <span className="text-red-400 mt-1">•</span>
                                                    <span className="text-gray-200">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* FAQ Tab */}
                    {activeTab === 'faq' && <FAQSection />}
                </motion.div>
            </div>
        </div>
    );
}
