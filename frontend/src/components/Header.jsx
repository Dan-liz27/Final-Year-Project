import React from 'react';

export default function Header() {
    return (
        <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold">🏥 Skin Disease Classifier</h1>
                <p className="text-primary-100 mt-2">
                    AI-powered skin disease detection using CE-EEN-B0 model (98.7% accuracy)
                </p>
            </div>
        </header>
    );
}
