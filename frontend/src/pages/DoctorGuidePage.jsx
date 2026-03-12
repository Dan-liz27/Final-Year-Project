import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Breadcrumb from '../components/Breadcrumb';
import VideoCard from '../components/VideoCard';
import educationalContent from '../data/educationalContent.json';

export default function DoctorGuidePage() {
    const navigate = useNavigate();
    const { whenToSeeDoctor, doctorVideos } = educationalContent;

    const severityColors = {
        high: 'from-red-500 to-rose-600',
        medium: 'from-yellow-500 to-orange-500',
        low: 'from-blue-500 to-cyan-500'
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-7xl mx-auto">
                <Breadcrumb />

                <motion.div className="mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400">
                            When to See a Doctor
                        </h1>
                        <button onClick={() => navigate('/learn')} className="px-4 py-2 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Learn Hub</span>
                        </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Know when professional medical attention is needed and how to prepare for your appointment.
                    </p>
                </motion.div>

                {/* Urgent Cases */}
                <motion.div className="mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="text-3xl">🚨</span>
                        Urgent Cases
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {whenToSeeDoctor.urgent.map((item, index) => (
                            <motion.div key={index} className={`bg-gradient-to-br ${severityColors[item.severity]}/10 border border-${item.severity === 'high' ? 'red' : 'yellow'}-500/30 rounded-xl p-6`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{item.severity === 'high' ? '⚠️' : '⚡'}</span>
                                    <div>
                                        <h3 className="text-gray-900 dark:text-white font-semibold mb-2">{item.symptom}</h3>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{item.action}</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.severity === 'high' ? 'bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'}`}>
                                            {item.severity === 'high' ? 'High Priority' : 'Medium Priority'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Routine Checkups */}
                <motion.div className="mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="text-3xl">📅</span>
                        Routine Checkups
                    </h2>
                    <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg">
                        <ul className="space-y-3">
                            {whenToSeeDoctor.routine.map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                    <span className="text-blue-400 mt-1">📌</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Emergency Situations */}
                <motion.div className="mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="text-3xl">🆘</span>
                        Emergency Situations
                    </h2>
                    <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-xl p-6">
                        <p className="text-red-600 dark:text-red-400 font-semibold mb-4">Seek immediate medical attention if you experience:</p>
                        <ul className="space-y-3">
                            {whenToSeeDoctor.emergency.map((item, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                    <span className="text-red-400 mt-1">🚨</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Video Tutorials - Only show if videos exist */}
                {doctorVideos && doctorVideos.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="text-3xl">🎥</span>
                            Video Tutorials
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {doctorVideos.map((video, index) => (
                                <motion.div key={video.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + index * 0.1 }}>
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
