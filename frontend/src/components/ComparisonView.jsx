import React from 'react';
import { motion } from 'framer-motion';
import { subDays } from 'date-fns';

export default function ComparisonView({ history }) {
    const calculatePeriodStats = (predictions) => {
        if (predictions.length === 0) {
            return { scans: 0, avgConfidence: 0, uniqueDiseases: 0, highConfScans: 0 };
        }

        const scans = predictions.length;
        const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / scans;
        const uniqueDiseases = new Set(predictions.map(p => p.prediction)).size;
        const highConfScans = predictions.filter(p => p.confidence >= 0.9).length;

        return { scans, avgConfidence, uniqueDiseases, highConfScans };
    };

    const now = new Date();
    const currentPeriodStart = subDays(now, 30);
    const previousPeriodStart = subDays(now, 60);

    const currentPeriod = history.filter(p => new Date(p.timestamp) > currentPeriodStart);
    const previousPeriod = history.filter(p => {
        const date = new Date(p.timestamp);
        return date > previousPeriodStart && date <= currentPeriodStart;
    });

    const currentStats = calculatePeriodStats(currentPeriod);
    const previousStats = calculatePeriodStats(previousPeriod);

    const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    const metrics = [
        {
            name: 'Total Scans',
            current: currentStats.scans,
            previous: previousStats.scans,
            change: calculateChange(currentStats.scans, previousStats.scans),
            icon: '📊',
            format: (val) => val.toString()
        },
        {
            name: 'Avg Confidence',
            current: currentStats.avgConfidence,
            previous: previousStats.avgConfidence,
            change: calculateChange(currentStats.avgConfidence, previousStats.avgConfidence),
            icon: '🎯',
            format: (val) => `${(val * 100).toFixed(1)}%`
        },
        {
            name: 'Unique Conditions',
            current: currentStats.uniqueDiseases,
            previous: previousStats.uniqueDiseases,
            change: calculateChange(currentStats.uniqueDiseases, previousStats.uniqueDiseases),
            icon: '🔬',
            format: (val) => val.toString()
        },
        {
            name: 'High Confidence',
            current: currentStats.highConfScans,
            previous: previousStats.highConfScans,
            change: calculateChange(currentStats.highConfScans, previousStats.highConfScans),
            icon: '⭐',
            format: (val) => val.toString()
        }
    ];

    return (
        <motion.div
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Period Comparison
            </h3>
            <p className="text-gray-400 text-sm mb-6">Current vs Previous 30 days</p>

            <div className="grid md:grid-cols-2 gap-4">
                {metrics.map((metric, index) => {
                    const isPositive = metric.change > 0;
                    const isNeutral = Math.abs(metric.change) < 1;
                    const changeColor = isNeutral ? 'text-gray-400' : isPositive ? 'text-green-400' : 'text-red-400';
                    const changeBg = isNeutral ? 'bg-gray-900/30' : isPositive ? 'bg-green-900/30' : 'bg-red-900/30';

                    return (
                        <motion.div
                            key={metric.name}
                            className="p-4 bg-slate-700/30 rounded-lg border border-slate-600"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">{metric.icon}</span>
                                <p className="text-gray-300 text-sm font-semibold">{metric.name}</p>
                            </div>

                            <div className="flex items-end justify-between mb-2">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Current</p>
                                    <p className="text-2xl font-bold text-white">{metric.format(metric.current)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-1">Previous</p>
                                    <p className="text-lg font-semibold text-gray-400">{metric.format(metric.previous)}</p>
                                </div>
                            </div>

                            <div className={`flex items-center gap-1 px-2 py-1 rounded ${changeBg} w-fit`}>
                                {!isNeutral && (
                                    <span className={changeColor}>
                                        {isPositive ? '↑' : '↓'}
                                    </span>
                                )}
                                <span className={`text-xs font-semibold ${changeColor}`}>
                                    {isNeutral ? 'No change' : `${Math.abs(metric.change).toFixed(1)}%`}
                                </span>
                            </div>

                            {/* Mini sparkline */}
                            <div className="mt-3 h-8 flex items-end gap-1">
                                {[previousStats, currentStats].map((stat, i) => {
                                    const value = metric.name === 'Total Scans' ? stat.scans :
                                        metric.name === 'Avg Confidence' ? stat.avgConfidence * 100 :
                                            metric.name === 'Unique Conditions' ? stat.uniqueDiseases :
                                                stat.highConfScans;
                                    const maxValue = Math.max(
                                        metric.name === 'Total Scans' ? Math.max(previousStats.scans, currentStats.scans) :
                                            metric.name === 'Avg Confidence' ? 100 :
                                                metric.name === 'Unique Conditions' ? Math.max(previousStats.uniqueDiseases, currentStats.uniqueDiseases) :
                                                    Math.max(previousStats.highConfScans, currentStats.highConfScans),
                                        1
                                    );
                                    const height = (value / maxValue) * 100;

                                    return (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-t transition-all ${i === 1 ? 'bg-cyan-500' : 'bg-slate-600'}`}
                                            style={{ height: `${height}%`, minHeight: '4px' }}
                                        />
                                    );
                                })}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-4 p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                <p className="text-xs text-cyan-300">
                    💡 <strong>Insight:</strong> {
                        currentStats.scans > previousStats.scans
                            ? 'Great job staying consistent with your skin health monitoring!'
                            : currentStats.scans < previousStats.scans
                                ? 'Consider increasing scan frequency for better tracking.'
                                : 'Maintaining steady monitoring habits.'
                    }
                </p>
            </div>
        </motion.div>
    );
}
