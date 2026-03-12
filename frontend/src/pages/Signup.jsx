import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Signup() {
    const navigate = useNavigate();
    const { signup, loading: authLoading } = useAuth();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', agree: false });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = t('signup.usernameRequired');
        else if (formData.username.length < 3) newErrors.username = t('signup.usernameMin');
        if (!formData.email) newErrors.email = t('signup.emailRequired');
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('signup.emailInvalid');
        if (!formData.password) newErrors.password = t('signup.passwordRequired');
        else if (formData.password.length < 6) newErrors.password = t('signup.passwordMin');
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('signup.passwordsMismatch');
        if (!formData.agree) newErrors.agree = t('signup.mustAgree');
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        setServerError('');
        setIsSubmitting(true);
        try {
            const result = await signup(formData.username, formData.email, formData.password);
            if (result.success) {
                navigate('/login', { state: { email: result.email, username: result.username, fromSignup: true } });
            } else {
                setServerError(result?.error || t('signup.signupFailed'));
            }
        } catch (error) {
            setServerError(t('signup.signupError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-indigo-950 dark:to-slate-950 py-12 px-4">
            <div className="fixed top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>
            <motion.div className="max-w-md w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-purple-500/20">
                    <div className="text-center mb-8">
                        <motion.div className="inline-block bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-500 p-4 rounded-2xl shadow-lg mb-4"
                            whileHover={{ scale: 1.1 }} transition={{ type: "spring" }}>
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </motion.div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                            {t('signup.createAccount')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{t('signup.subtitle')}</p>
                    </div>

                    {serverError && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-6">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">{serverError}</p>
                            </div>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('signup.usernameLabel')}</label>
                            <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                placeholder={t('signup.usernamePlaceholder')} />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('signup.emailLabel')}</label>
                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                placeholder={t('signup.emailPlaceholder')} />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('signup.passwordLabel')}</label>
                            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                placeholder={t('signup.passwordPlaceholder')} />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('signup.confirmPasswordLabel')}</label>
                            <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                placeholder={t('signup.confirmPasswordPlaceholder')} />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                        <div>
                            <label className="flex items-start">
                                <input type="checkbox" checked={formData.agree} onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                                    className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{t('signup.agreeTerms')}</span>
                            </label>
                            {errors.agree && <p className="text-red-500 text-sm mt-1">{errors.agree}</p>}
                        </div>
                        <motion.button type="submit" disabled={isSubmitting || authLoading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={!isSubmitting && !authLoading ? { scale: 1.02 } : {}}
                            whileTap={!isSubmitting && !authLoading ? { scale: 0.98 } : {}}>
                            {isSubmitting || authLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    {t('signup.creatingAccount')}
                                </span>
                            ) : t('signup.createBtn')}
                        </motion.button>
                    </form>

                    <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
                        {t('signup.haveAccount')}{' '}
                        <Link to="/login" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">{t('signup.signIn')}</Link>
                    </p>
                    <p className="mt-3 text-center">
                        <Link to="/welcome" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">{t('signup.backToHome')}</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
