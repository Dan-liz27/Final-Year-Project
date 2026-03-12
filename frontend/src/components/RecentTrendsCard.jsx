import React from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import diseaseData from '../data/diseaseInfo.json';

export default function RecentTrendsCard({ history }) {
    const calculateTrends = () => {
        if (history.length === 0) return null;

        const now = new Date();
        const last30Days = history.filter(p =>
            new Date(p.timestamp) > subDays(now, 30)
        );
        const previous30Days = history.filter(p => {
            const date = new Date(p.timestamp);
            return date <= subDays(now, 30) && date > subDays(now, 60);
        });

        // Most common disease this month
        const diseaseCount = {};
        last30Days.forEach(p => {
            diseaseCount[p.prediction] = (diseaseCount[p.prediction] || 0) + 1;
        });
        const mostCommon = Object.entries(diseaseCount).sort((a, b) => b[1] - a[1])[0];

        // Confidence trend
        const recentAvgConf = last30Days.length > 0
            ? last30Days.reduce((sum, p) => sum + p.confidence, 0) / last30Days.length
            : 0;
        const previousAvgConf = previous30Days.length > 0
            ? previous30Days.reduce((sum, p) => sum + p.confidence, 0) / previous30Days.length
            : 0;

        const confChange = recentAvgConf - previousAvgConf;
        const confTrend = confChange > 0.05 ? 'improving' : confChange < -0.05 ? 'declining' : 'stable';

        // Scan frequency
        const scanChange = last30Days.length - previous30Days.length;
        const scanTrend = scanChange > 0 ? 'increased' : scanChange < 0 ? 'decreased' : 'stable';

        // Alerts
        const alerts = [];
        const highRiskScans = last30Days.filter(p => {
            const info = diseaseData[p.prediction];
            return info?.severity === 'high';
        });
        if (highRiskScans.length > 0) {
            alerts.push({
                type: 'warning',
                message: `${highRiskScans.length} high-risk condition${highRiskScans.length > 1 ? 's' : ''} detected`,
                icon: '⚠️'
            });
        }

        const lowConfScans = last30Days.filter(p => p.confidence < 0.7);
        if (lowConfScans.length >= 3) {
            alerts.push({
                type: 'info',
                message: 'Multiple low-confidence scans - ensure good lighting',
                icon: '💡'
            });
        }

        if (last30Days.length === 0 && history.length > 0) {
            const daysSinceLastScan = Math.floor((now - new Date(history[history.length - 1].timestamp)) / (1000 * 60 * 60 * 24));
            alerts.push({
                type: 'reminder',
                message: `No scans in ${daysSinceLastScan} days - time for a check-up?`,
                icon: '📅'
            });
        }

        return {
            mostCommon: mostCommon ? { name: mostCommon[0], count: mostCommon[1] } : null,
            confTrend,
            confChange: (confChange * 100).toFixed(1),
            scanTrend,
            scanChange,
            scanCount: last30Days.length,
            alerts
        };
    };

    const trends = calculateTrends();

    if (!trends) {
        return (
            <motion.div
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 shadow-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <h3 className="text-xl font-bold text-white mb-4">Recent Trends</h3>
                <p className="text-gray-400 text-center py-8">No data available yet</p>
            </motion.div>
        );
    }

    const trendIcons = {
        improving: { icon: '📈', color: 'text-green-400', bg: 'bg-green-900/30' },
        declining: { icon: '📉', color: 'text-red-400', bg: 'bg-red-900/30' },
        stable: { icon: '➡️', color: 'text-blue-400', bg: 'bg-blue-900/30' },
        increased: { icon: '⬆️', color: 'text-green-400', bg: 'bg-green-900/30' },
        decreased: { icon: '⬇️', color: 'text-yellow-400', bg: 'bg-yellow-900/30' }
    };

    return (
        <motion.div
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Recent Trends
            </h3>
            <p className="text-gray-400 text-sm mb-4">Last 30 days insights</p>

            <div className="space-y-4">
                {/* Most Common Disease */}
                {trends.mostCommon && (
                    <motion.div
                        className="p-4 bg-slate-700/30 rounded-lg border border-slate-600"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <p className="text-gray-400 text-sm mb-1">Most Common This Month</p>
                        <p className="text-white font-semibold text-lg">{trends.mostCommon.name}</p>
                        <p className="text-cyan-400 text-sm">{trends.mostCommon.count} occurrence{trends.mostCommon.count > 1 ? 's' : ''}</p>
                    </motion.div>
                )}

                {/* Confidence Trend */}
                <motion.div
                    className={`p-4 rounded-lg border ${trendIcons[trends.confTrend].bg} border-slate-600`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Confidence Trend</p>
                            <p className={`font-semibold ${trendIcons[trends.confTrend].color}`}>
                                {trendIcons[trends.confTrend].icon} {trends.confTrend.charAt(0).toUpperCase() + trends.confTrend.slice(1)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={`text-2xl font-bold ${trendIcons[trends.confTrend].color}`}>
                                {trends.confChange > 0 ? '+' : ''}{trends.confChange}%
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Scan Frequency */}
                <motion.div
                    className={`p-4 rounded-lg border ${trendIcons[trends.scanTrend].bg} border-slate-600`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Scan Activity</p>
                            <p className={`font-semibold ${trendIcons[trends.scanTrend].color}`}>
                                {trendIcons[trends.scanTrend].icon} {trends.scanTrend.charAt(0).toUpperCase() + trends.scanTrend.slice(1)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-white">{trends.scanCount}</p>
                            <p className="text-gray-400 text-sm">scans</p>
                        </div>
                    </div>
                </motion.div>

                {/* Alerts */}
                {trends.alerts.length > 0 && (
                    <motion.div
                        className="space-y-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <p className="text-gray-400 text-sm font-semibold">Alerts & Reminders:</p>
                        {trends.alerts.map((alert, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${alert.type === 'warning' ? 'bg-red-900/20 border-red-500/50' :
                                        alert.type === 'info' ? 'bg-blue-900/20 border-blue-500/50' :
                                            'bg-yellow-900/20 border-yellow-500/50'
                                    }`}
                            >
                                <p className="text-sm text-gray-200">
                                    {alert.icon} {alert.message}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
