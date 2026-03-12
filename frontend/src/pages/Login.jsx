import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading: authLoading } = useAuth();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ email: '', password: '', remember: false });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (location.state?.fromSignup && location.state?.email) {
            setFormData(prev => ({ ...prev, email: location.state.email }));
            toast.success(t('login.accountCreated'));
            window.history.replaceState({}, document.title);
        }
    }, [location, t]);

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = t('login.emailRequired');
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('login.emailInvalid');
        if (!formData.password) newErrors.password = t('login.passwordRequired');
        else if (formData.password.length < 6) newErrors.password = t('login.passwordMin');
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        setServerError('');
        setIsSubmitting(true);
        const result = await login(formData.email, formData.password);
        setIsSubmitting(false);
        if (result === true || result.success) {
            navigate('/');
        } else {
            setServerError(result?.error || t('login.loginFailed'));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 py-12 px-4">
            {/* Language switcher top-right on auth pages */}
            <div className="fixed top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>
            <motion.div
                className="max-w-md w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 dark:border-cyan-500/20">
                    <div className="text-center mb-8">
                        <motion.div
                            className="inline-block bg-gradient-to-br from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-blue-500 p-4 rounded-2xl shadow-lg mb-4"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                        >
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </motion.div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400">
                            {t('login.welcomeBack')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{t('login.subtitle')}</p>
                    </div>

                    {serverError && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">{serverError}</p>
                            </div>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('login.emailLabel')}</label>
                            <input type="email" value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                placeholder={t('login.emailPlaceholder')} />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('login.passwordLabel')}</label>
                            <input type="password" value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                                placeholder={t('login.passwordPlaceholder')} />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" checked={formData.remember}
                                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{t('login.rememberMe')}</span>
                            </label>
                            <a href="#" className="text-sm text-blue-600 dark:text-cyan-400 hover:underline">{t('login.forgotPassword')}</a>
                        </div>
                        <motion.button type="submit" disabled={isSubmitting || authLoading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-cyan-500 dark:to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={!isSubmitting && !authLoading ? { scale: 1.02 } : {}}
                            whileTap={!isSubmitting && !authLoading ? { scale: 0.98 } : {}}>
                            {isSubmitting || authLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    {t('login.signingIn')}
                                </span>
                            ) : t('login.signIn')}
                        </motion.button>
                    </form>

                    <div className="mt-6 p-3 bg-blue-50 dark:bg-slate-700/50 rounded-lg border border-blue-200 dark:border-cyan-500/30">
                        <p className="text-xs text-blue-800 dark:text-cyan-300 font-semibold mb-1">{t('login.demoCredentials')}</p>
                        <p className="text-xs text-blue-700 dark:text-cyan-400">{t('login.demoEmail')}</p>
                        <p className="text-xs text-blue-700 dark:text-cyan-400">{t('login.demoPassword')}</p>
                    </div>

                    <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
                        {t('login.noAccount')}{' '}
                        <Link to="/signup" className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline">{t('login.signUp')}</Link>
                    </p>
                    <p className="mt-3 text-center">
                        <Link to="/welcome" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">{t('login.backToHome')}</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
