import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useTranslation();

    const features = [
        {
            icon: '👤',
            title: t('home.profileTitle'),
            description: t('home.profileDesc'),
            action: () => navigate('/profile'),
            gradient: 'from-purple-500 to-indigo-600',
            buttonText: t('home.profileBtn')
        },
        {
            icon: '📸',
            title: t('home.uploadTitle'),
            description: t('home.uploadDesc'),
            action: () => navigate('/upload'),
            gradient: 'from-cyan-500 to-blue-600',
            buttonText: t('home.uploadBtn')
        },
        {
            icon: '📚',
            title: t('home.learnTitle'),
            description: t('home.learnDesc'),
            action: () => navigate('/learn'),
            gradient: 'from-green-500 to-emerald-600',
            buttonText: t('home.learnBtn')
        },
        {
            icon: '📜',
            title: t('home.historyTitle'),
            description: t('home.historyDesc'),
            action: () => navigate('/history'),
            gradient: 'from-orange-500 to-red-600',
            buttonText: t('home.historyBtn')
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">
                        {t('home.welcomeBack', { name: user?.username || 'User' })}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        {t('home.subtitle')}
                    </p>
                </motion.div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            className="group cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            onClick={feature.action}
                        >
                            <div className="relative h-full bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-lg overflow-hidden hover:border-cyan-500/50 transition-all duration-300">
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                {/* Content */}
                                <div className="relative p-8">
                                    {/* Icon */}
                                    <div className="mb-6">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg`}>
                                            <span className="text-3xl">{feature.icon}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Button */}
                                    <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white font-semibold rounded-xl transition-all shadow-lg group-hover:shadow-xl`}>
                                        <span>{feature.buttonText}</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Hover Glow Effect */}
                                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Medical Disclaimer */}
                <motion.div
                    className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">⚠️</span>
                        <div>
                            <h3 className="text-yellow-700 dark:text-yellow-400 font-semibold mb-2">{t('home.disclaimerTitle')}</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                {t('home.disclaimerBody')}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
