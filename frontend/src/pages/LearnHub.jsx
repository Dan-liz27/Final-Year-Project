import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function LearnHub() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const sections = [
        { id: 'articles', title: t('learn.articlesTitle'), description: t('learn.articlesDesc'), icon: '📚', gradient: 'from-cyan-500 to-blue-600', path: '/learn/articles' },
        { id: 'photography', title: t('learn.photographyTitle'), description: t('learn.photographyDesc'), icon: '📸', gradient: 'from-purple-500 to-pink-600', path: '/learn/photography' },
        { id: 'prevention', title: t('learn.preventionTitle'), description: t('learn.preventionDesc'), icon: '💊', gradient: 'from-green-500 to-emerald-600', path: '/learn/prevention' },
        { id: 'doctor', title: t('learn.doctorTitle'), description: t('learn.doctorDesc'), icon: '🏥', gradient: 'from-red-500 to-rose-600', path: '/learn/doctor' },
        { id: 'faq', title: t('learn.faqTitle'), description: t('learn.faqDesc'), icon: '❓', gradient: 'from-yellow-500 to-orange-600', path: '/learn/faq' },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">
                        {t('learn.pageTitle')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
                        {t('learn.pageSubtitle')}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section, index) => (
                        <motion.div key={section.id} className="group cursor-pointer"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}
                            onClick={() => navigate(section.path)}>
                            <div className="relative h-full bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg overflow-hidden hover:border-cyan-500/50 transition-all duration-300">
                                <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                <div className="relative p-8">
                                    <div className="mb-6">
                                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${section.gradient} shadow-lg`}>
                                            <span className="text-4xl">{section.icon}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                        {section.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{section.description}</p>
                                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold group-hover:gap-4 transition-all">
                                        <span>{t('learn.learnMore')}</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                                <div className={`absolute -inset-1 bg-gradient-to-r ${section.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg">
                        <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">16</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{t('learn.articles')}</div>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">6</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{t('learn.preventionArticles')}</div>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">27+</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{t('learn.doctorGuidelines')}</div>
                    </div>
                    <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg">
                        <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">25</div>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{t('learn.faqs')}</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
