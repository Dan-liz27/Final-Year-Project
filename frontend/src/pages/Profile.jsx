import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import RecommendationsCard from '../components/RecommendationsCard';
import { useTranslation } from 'react-i18next';

export default function Profile() {
    const { user, updateUser, updateSettings, clearHistory, stats, history, getRecommendations } = useApp();
    const { logout } = useAuth();
    const { t } = useTranslation();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        role: user.role
    });

    // Force re-render when history changes
    useEffect(() => {
        console.log('Profile - Stats updated:', {
            total: stats.total,
            avgConf: stats.avgConfidence,
            highConf: stats.highConfidence,
            historyLength: history.length
        });
    }, [history, stats]);

    const handleSave = () => {
        updateUser(formData);
        setIsEditing(false);
        toast.success(t('profile.profileUpdated'));
    };

    const handleClearData = () => {
        if (window.confirm(t('profile.clearDataConfirm'))) {
            clearHistory();
            toast.success(t('profile.dataCleared'));
        }
    };

    // Calculate achievements (use t() when rendering, not here since it's outside render)
    const achievements = [
        {
            id: 1,
            nameKey: 'profile.achievement1Name',
            descKey: 'profile.achievement1Desc',
            unlocked: stats.total >= 1,
            icon: '🎯'
        },
        {
            id: 2,
            nameKey: 'profile.achievement2Name',
            descKey: 'profile.achievement2Desc',
            unlocked: stats.total >= 10,
            icon: '🏆'
        },
        {
            id: 3,
            nameKey: 'profile.achievement3Name',
            descKey: 'profile.achievement3Desc',
            unlocked: stats.highConfidence >= 5,
            icon: '⭐'
        },
        {
            id: 4,
            nameKey: 'profile.achievement4Name',
            descKey: 'profile.achievement4Desc',
            unlocked: stats.total >= 25,
            icon: '🔬'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="mb-10">
                    <motion.h1
                        className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        USER PROFILE
                        {/* t('profile.pageTitle') */}
                    </motion.h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg flex items-center gap-2">
                        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                        {t('profile.pageSubtitle')}
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Profile Card */}
                    <motion.div
                        className="lg:col-span-2 bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-cyan-500/20 shadow-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Avatar and Info */}
                        <div className="flex items-center gap-6 mb-8">
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-5xl font-bold shadow-xl shadow-cyan-500/50">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-800 flex items-center justify-center">
                                    <span className="text-xs">✓</span>
                                </div>
                            </motion.div>

                            <div className="flex-grow">
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-300 dark:border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white text-lg font-bold"
                                            placeholder="Name"
                                        />
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-300 dark:border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                                        >
                                            <option value="Student">Student</option>
                                            <option value="Doctor">Doctor</option>
                                            <option value="Researcher">Researcher</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h2>
                                        <p className="text-cyan-600 dark:text-cyan-400 text-lg font-semibold">{user.role}</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('profile.memberSince')} {new Date().toLocaleDateString()}</p>
                                    </>
                                )}
                            </div>

                            <motion.button
                                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isEditing ? t('profile.saveBtn') : t('profile.editBtn')}
                            </motion.button>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: t('profile.totalScans'), value: stats.total, icon: '📊', color: 'cyan' },
                                { label: t('profile.avgConfidence'), value: stats.total > 0 ? `${(stats.avgConfidence * 100).toFixed(0)}%` : '0%', icon: '🎯', color: 'blue' },
                                { label: t('profile.highAccuracy'), value: stats.highConfidence, icon: '⭐', color: 'green' },
                                { label: t('profile.thisWeek'), value: stats.total, icon: '📅', color: 'purple' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    className="bg-gray-100 dark:bg-slate-700/30 border border-cyan-500/20 dark:border-slate-600/30 rounded-xl p-4 text-center"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="text-3xl mb-2">{stat.icon}</div>
                                    <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mb-1">{stat.value}</div>
                                    <div className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Personal Information Section */}
                        <div className="border-t border-cyan-500/20 pt-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></span>
                                PERSONAL INFORMATION
                                {/* t('profile.personalInfo') */}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-700 dark:text-gray-200 font-semibold mb-2 block text-sm">{t('profile.ageRange')}</label>
                                    <select
                                        value={user.ageRange}
                                        onChange={(e) => updateUser({ ageRange: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-300 dark:border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                                    >
                                        <option value="">{t('profile.selectAgeRange')}</option>
                                        <option value="18-25">18-25</option>
                                        <option value="26-35">26-35</option>
                                        <option value="36-45">36-45</option>
                                        <option value="46-60">46-60</option>
                                        <option value="60+">60+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-gray-700 dark:text-gray-200 font-semibold mb-2 block text-sm">{t('profile.gender')}</label>
                                    <select
                                        value={user.gender}
                                        onChange={(e) => updateUser({ gender: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-300 dark:border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                                    >
                                        <option value="">{t('profile.selectGender')}</option>
                                        <option value="Male">{t('profile.male')}</option>
                                        <option value="Female">{t('profile.female')}</option>
                                        <option value="Non-binary">{t('profile.nonBinary')}</option>
                                        <option value="Prefer not to say">{t('profile.preferNotSay')}</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-gray-700 dark:text-gray-200 font-semibold mb-2 block text-sm">{t('profile.locationLabel')}</label>
                                    <input
                                        type="text"
                                        value={user.location}
                                        onChange={(e) => updateUser({ location: e.target.value })}
                                        placeholder={t('profile.locationPlaceholder')}
                                        className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-300 dark:border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Skin Profile Section */}
                        <div className="border-t border-cyan-500/20 pt-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></span>
                                SKIN PROFILE
                                {/* t('profile.skinProfile') */}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="text-gray-700 dark:text-gray-200 font-semibold mb-2 block text-sm">{t('profile.skinType')}</label>
                                    <select
                                        value={user.skinType}
                                        onChange={(e) => updateUser({ skinType: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-300 dark:border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                                    >
                                        <option value="">{t('profile.selectSkinType')}</option>
                                        <option value="Oily">{t('profile.oily')}</option>
                                        <option value="Dry">{t('profile.dry')}</option>
                                        <option value="Combination">{t('profile.combination')}</option>
                                        <option value="Sensitive">{t('profile.sensitive')}</option>
                                        <option value="Normal">{t('profile.normal')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-gray-700 dark:text-gray-200 font-semibold mb-2 block text-sm">{t('profile.skinTone')}</label>
                                    <select
                                        value={user.skinTone}
                                        onChange={(e) => updateUser({ skinTone: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-300 dark:border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                                    >
                                        <option value="">{t('profile.selectSkinTone')}</option>
                                        <option value="Fair">{t('profile.fair')}</option>
                                        <option value="Medium">{t('profile.medium')}</option>
                                        <option value="Olive">{t('profile.olive')}</option>
                                        <option value="Brown">{t('profile.brown')}</option>
                                        <option value="Dark">{t('profile.dark')}</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-700 dark:text-gray-200 font-semibold mb-2 block text-sm">{t('profile.mainConcerns')}</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {['Acne', 'Aging', 'Hyperpigmentation', 'Sensitivity', 'Dryness', 'Oiliness'].map(concern => (
                                        <label key={concern} className="flex items-center gap-2 bg-gray-100 dark:bg-slate-700/30 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700/50 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={user.mainConcerns.includes(concern)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        updateUser({ mainConcerns: [...user.mainConcerns, concern] });
                                                    } else {
                                                        updateUser({ mainConcerns: user.mainConcerns.filter(c => c !== concern) });
                                                    }
                                                }}
                                                className="rounded text-cyan-500 focus:ring-cyan-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-200">{concern}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Medical History Section */}
                        <div className="border-t border-cyan-500/20 pt-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></span>
                                MEDICAL HISTORY
                                {/* t('profile.medicalHistory') */}
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={user.hasAllergies}
                                            onChange={(e) => updateUser({ hasAllergies: e.target.checked })}
                                            className="rounded text-cyan-500 focus:ring-cyan-500"
                                        />
                                        <label className="text-gray-700 dark:text-gray-200 font-semibold">{t('profile.hasAllergies')}</label>
                                    </div>
                                    {user.hasAllergies && (
                                        <input
                                            type="text"
                                            value={user.allergyDetails}
                                            onChange={(e) => updateUser({ allergyDetails: e.target.value })}
                                            placeholder={t('profile.allergyPlaceholder')}
                                            className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-300 dark:border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white text-sm"
                                        />
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={user.onMedication}
                                        onChange={(e) => updateUser({ onMedication: e.target.checked })}
                                        className="rounded text-cyan-500 focus:ring-cyan-500"
                                    />
                                    <label className="text-gray-700 dark:text-gray-200 font-semibold">{t('profile.onMedication')}</label>
                                </div>
                            </div>
                        </div>

                        {/* Lifestyle Section */}
                        <div className="border-t border-cyan-500/20 pt-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></span>
                                LIFESTYLE FACTORS
                                {/* t('profile.lifestyle') */}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-700 dark:text-gray-200 font-semibold mb-2 block text-sm">{t('profile.sunExposure')}</label>
                                    <select
                                        value={user.sunExposure}
                                        onChange={(e) => updateUser({ sunExposure: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-300 dark:border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                                    >
                                        <option value="">{t('profile.selectLevel')}</option>
                                        <option value="Low">{t('profile.sunLow')}</option>
                                        <option value="Moderate">{t('profile.sunModerate')}</option>
                                        <option value="High">{t('profile.sunHigh')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-gray-700 dark:text-gray-200 font-semibold mb-2 block text-sm">{t('profile.skincareRoutine')}</label>
                                    <select
                                        value={user.skincareLevel}
                                        onChange={(e) => updateUser({ skincareLevel: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-gray-300 dark:border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-white"
                                    >
                                        <option value="">{t('profile.selectLevel')}</option>
                                        <option value="None">{t('profile.skincareNone')}</option>
                                        <option value="Basic">{t('profile.skincareBasic')}</option>
                                        <option value="Moderate">{t('profile.skincareModerate')}</option>
                                        <option value="Advanced">{t('profile.skincareAdvanced')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Settings Section */}
                        <div className="border-t border-cyan-500/20 pt-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></span>
                                PREFERENCES
                                {/* t('profile.preferences') */}
                            </h3>

                            <div className="space-y-6">
                                {/* Confidence Threshold */}
                                <div>
                                    <div className="flex justify-between mb-3">
                                        <label className="text-gray-700 dark:text-gray-200 font-semibold">{t('profile.confidenceThreshold')}</label>
                                        <span className="text-cyan-600 dark:text-cyan-400 font-bold text-lg">{user.settings.confidenceThreshold}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max="95"
                                        value={user.settings.confidenceThreshold}
                                        onChange={(e) => updateSettings({ confidenceThreshold: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                    />
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                                        {t('profile.thresholdHint')}
                                    </p>
                                </div>

                                {/* View Mode */}
                                <div>
                                    <label className="text-gray-700 dark:text-gray-200 font-semibold mb-3 block">{t('profile.defaultViewMode')}</label>
                                    <div className="flex gap-4">
                                        {['grid', 'list'].map(mode => (
                                            <motion.button
                                                key={mode}
                                                onClick={() => updateSettings({ viewMode: mode })}
                                                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${user.settings.viewMode === mode
                                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                                                    : 'bg-gray-100 dark:bg-slate-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-300 dark:border-cyan-500/20'
                                                    }`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {mode === 'grid' ? t('profile.gridView') : t('profile.listView')}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="border-t border-red-500/20 mt-8 pt-6">
                            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-gradient-to-b from-red-500 to-pink-600 rounded"></span>
                                DANGER ZONE
                                {/* t('profile.dangerZone') */}
                            </h3>
                            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4">
                                <p className="text-gray-700 dark:text-gray-300 mb-4">
                                    {t('profile.dangerWarning')}
                                </p>
                                <motion.button
                                    onClick={handleClearData}
                                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t('profile.clearData')}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recommendations */}
                        <RecommendationsCard recommendations={getRecommendations()} />

                        {/* Achievements */}
                        <motion.div
                            className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-cyan-500/20 shadow-xl"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></span>
                                ACHIEVEMENTS
                                {/* t('profile.achievements') */}
                            </h3>
                            <div className="space-y-3">
                                {achievements.map((achievement, i) => (
                                    <motion.div
                                        key={achievement.id}
                                        className={`p-4 rounded-xl border ${achievement.unlocked
                                            ? 'bg-cyan-500/10 border-cyan-500/30'
                                            : 'bg-gray-100 dark:bg-slate-700/30 border-gray-300 dark:border-slate-600/30'
                                            }`}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`text-3xl ${!achievement.unlocked && 'grayscale opacity-30'}`}>
                                                {achievement.icon}
                                            </div>
                                            <div className="flex-grow">
                                                <p className={`font-bold ${achievement.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                                    {t(achievement.nameKey)}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{t(achievement.descKey)}</p>
                                            </div>
                                            {achievement.unlocked && (
                                                <div className="text-green-400">✓</div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Model Info */}
                        <motion.div
                            className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 shadow-xl"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-lg font-bold text-cyan-600 dark:text-cyan-400 mb-4">{t('profile.modelInfo')}</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">{t('profile.architecture')}</span>
                                    <span className="text-gray-900 dark:text-white font-semibold">CE-EEN-B0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">{t('profile.accuracy')}</span>
                                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">98.7%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">{t('profile.classes')}</span>
                                    <span className="text-gray-900 dark:text-white font-semibold">35</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">{t('profile.trainingData')}</span>
                                    <span className="text-gray-900 dark:text-white font-semibold">262K images</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
