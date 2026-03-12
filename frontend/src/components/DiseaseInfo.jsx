import React, { useState } from 'react';
import diseaseData from '../data/diseaseInfo.json';

export default function DiseaseInfo({ diseaseName }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const info = diseaseData[diseaseName] || {
        description: "Information not available for this condition.",
        severity: "unknown",
        symptoms: ["Information not available"],
        treatment: "Please consult a healthcare professional.",
        whenToSeeDoctor: "If you have concerns about this condition."
    };

    const severityConfig = {
        high: {
            color: 'red',
            bg: 'bg-red-100 dark:bg-red-900/30',
            text: 'text-red-800 dark:text-red-300',
            label: 'High Risk',
            border: 'border-red-500 dark:border-red-600'
        },
        medium: {
            color: 'yellow',
            bg: 'bg-yellow-100 dark:bg-yellow-900/30',
            text: 'text-yellow-800 dark:text-yellow-300',
            label: 'Medium Risk',
            border: 'border-yellow-500 dark:border-yellow-600'
        },
        low: {
            color: 'green',
            bg: 'bg-green-100 dark:bg-green-900/30',
            text: 'text-green-800 dark:text-green-300',
            label: 'Low Risk',
            border: 'border-green-500 dark:border-green-600'
        },
        none: {
            color: 'blue',
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            text: 'text-blue-800 dark:text-blue-300',
            label: 'No Risk',
            border: 'border-blue-500 dark:border-blue-600'
        },
        unknown: {
            color: 'gray',
            bg: 'bg-gray-100 dark:bg-gray-700/30',
            text: 'text-gray-800 dark:text-gray-300',
            label: 'Unknown',
            border: 'border-gray-500 dark:border-gray-600'
        }
    };

    const config = severityConfig[info.severity] || severityConfig.unknown;

    return (
        <div className="bg-white/80 dark:bg-slate-800/50 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-cyan-500/20">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white flex items-center justify-between hover:from-blue-600 hover:to-blue-700 dark:hover:from-cyan-600 dark:hover:to-blue-700 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-lg">Disease Information</span>
                </div>
                <svg
                    className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Content */}
            {isExpanded && (
                <div className="p-6 space-y-4">
                    {/* Severity Badge */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Severity:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
                            {config.label}
                        </span>
                    </div>

                    {/* Description */}
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">About</h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{info.description}</p>
                    </div>

                    {/* Symptoms */}
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Common Symptoms</h4>
                        <ul className="space-y-1">
                            {info.symptoms.map((symptom, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-500 dark:text-cyan-400 mt-1">•</span>
                                    <span className="text-gray-600 dark:text-gray-300">{symptom}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Treatment */}
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Treatment</h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{info.treatment}</p>
                    </div>

                    {/* When to See Doctor */}
                    <div className={`p-4 rounded-lg ${config.bg} border-l-4 ${config.border}`}>
                        <h4 className={`font-semibold mb-2 ${config.text}`}>When to See a Doctor</h4>
                        <p className={config.text}>{info.whenToSeeDoctor}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
