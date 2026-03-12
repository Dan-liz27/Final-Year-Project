import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Breadcrumb() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    const breadcrumbNames = {
        'learn': 'Learn',
        'articles': 'Articles',
        'photography': 'Photography Tips',
        'prevention': 'Prevention & Care',
        'doctor': 'When to See a Doctor',
        'faq': 'FAQ'
    };

    return (
        <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm">
                {/* Home */}
                <li>
                    <Link
                        to="/"
                        className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Home</span>
                    </Link>
                </li>

                {/* Breadcrumb Items */}
                {pathnames.map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    const displayName = breadcrumbNames[name] || name;

                    return (
                        <React.Fragment key={name}>
                            {/* Separator */}
                            <li className="text-gray-500 dark:text-gray-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </li>

                            {/* Breadcrumb Link */}
                            <li>
                                {isLast ? (
                                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{displayName}</span>
                                ) : (
                                    <Link
                                        to={routeTo}
                                        className="text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                                    >
                                        {displayName}
                                    </Link>
                                )}
                            </li>
                        </React.Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
