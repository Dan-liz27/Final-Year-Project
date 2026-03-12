import React from 'react';
import { motion } from 'framer-motion';

export default function ImageQualityIndicator({ qualityData }) {
    if (!qualityData) return null;

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getBorderColor = (score) => {
        if (score >= 80) return 'border-green-500';
        if (score >= 60) return 'border-yellow-500';
        return 'border-red-500';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-slate-800 rounded-lg p-4 border-2 ${getBorderColor(qualityData.overall_score)}`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Image Quality</h3>
                <div className="flex items-center gap-2">
                    <span className={`text-2xl font-bold ${getScoreColor(qualityData.overall_score)}`}>
                        {qualityData.overall_score}%
                    </span>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${qualityData.quality_level === 'Good' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            qualityData.quality_level === 'Fair' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {qualityData.quality_level}
                    </span>
                </div>
            </div>

            {/* Quality Metrics */}
            <div className="space-y-3">
                {Object.entries(qualityData.metrics).map(([key, metric]) => (
                    <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="capitalize text-gray-700 dark:text-gray-300">{key}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">{metric.value}</span>
                                <span className={metric.ok ? 'text-green-500' : 'text-red-500'}>
                                    {metric.ok ? '✓' : '✗'}
                                </span>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.score}%` }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className={`h-2 rounded-full ${getScoreBg(metric.score)}`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recommendations */}
            {qualityData.recommendations && qualityData.recommendations.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700/50"
                >
                    <h4 className="font-semibold text-sm mb-2 text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                        <span>💡</span> Suggestions:
                    </h4>
                    <ul className="text-xs space-y-1 text-yellow-700 dark:text-yellow-400">
                        {qualityData.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Quality Level Badge */}
            {qualityData.overall_score < 60 && (
                <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-700/50">
                    <p className="text-xs text-red-700 dark:text-red-400">
                        ⚠️ <strong>Warning:</strong> Low quality images may result in inaccurate predictions. Consider retaking the photo.
                    </p>
                </div>
            )}
        </motion.div>
    );
}
