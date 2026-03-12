import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col relative overflow-hidden">
            <Navbar />

            <main className="flex-grow relative z-10">
                <Outlet />
            </main>

            <footer className="mt-auto bg-slate-950 text-gray-400 py-6 border-t border-cyan-500/20">
                <div className="container mx-auto px-4 text-center">
                    <p className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                        {t('footer.copyright')}
                    </p>
                    <p className="text-sm mt-2 text-gray-500">
                        {t('footer.disclaimer')}
                    </p>
                </div>
            </footer>

            <Toaster
                position="top-right"
                toastOptions={{
                    className: 'bg-slate-800 text-white border border-cyan-500/30',
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                    },
                }}
            />
        </div>
    );
}
