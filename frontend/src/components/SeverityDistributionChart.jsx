import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import diseaseData from '../data/diseaseInfo.json';

export default function SeverityDistributionChart({ history }) {
    // Calculate severity distribution
    const calculateSeverityDistribution = () => {
        const severityCounts = {
            high: 0,
            medium: 0,
            low: 0,
            none: 0,
            unknown: 0
        };

        history.forEach(prediction => {
            const diseaseInfo = diseaseData[prediction.prediction];
            const severity = diseaseInfo?.severity || 'unknown';
            severityCounts[severity]++;
        });

        return [
            { name: 'High Risk', value: severityCounts.high, color: '#ef4444', severity: 'high' },
            { name: 'Medium Risk', value: severityCounts.medium, color: '#f59e0b', severity: 'medium' },
            { name: 'Low Risk', value: severityCounts.low, color: '#22c55e', severity: 'low' },
            { name: 'No Risk', value: severityCounts.none, color: '#3b82f6', severity: 'none' },
            { name: 'Unknown', value: severityCounts.unknown, color: '#6b7280', severity: 'unknown' }
        ].filter(item => item.value > 0);
    };

    const severityData = calculateSeverityDistribution();
    const total = severityData.reduce((sum, item) => sum + item.value, 0);

    // Calculate trend (comparing recent vs older scans)
    const calculateTrend = () => {
        if (history.length < 4) return null;

        const midpoint = Math.floor(history.length / 2);
        const olderScans = history.slice(0, midpoint);
        const recentScans = history.slice(midpoint);

        const severityScore = { high: 0, medium: 1, low: 2, none: 3, unknown: 1.5 };

        const olderAvg = olderScans.reduce((sum, p) => {
            const diseaseInfo = diseaseData[p.prediction];
            return sum + (severityScore[diseaseInfo?.severity] || 1.5);
        }, 0) / olderScans.length;

        const recentAvg = recentScans.reduce((sum, p) => {
            const diseaseInfo = diseaseData[p.prediction];
            return sum + (severityScore[diseaseInfo?.severity] || 1.5);
        }, 0) / recentScans.length;

        if (recentAvg > olderAvg + 0.3) return 'improving';
        if (recentAvg < olderAvg - 0.3) return 'worsening';
        return 'stable';
    };

    const trend = calculateTrend();
    const trendConfig = {
        improving: { icon: '📈', text: 'Improving', color: 'text-green-400' },
        stable: { icon: '➡️', text: 'Stable', color: 'text-blue-400' },
        worsening: { icon: '📉', text: 'Needs Attention', color: 'text-red-400' }
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = ((data.value / total) * 100).toFixed(1);
            return (
                <div className="bg-slate-800 border border-cyan-500/50 rounded-lg p-3 shadow-xl">
                    <p className="text-white font-semibold">{data.name}</p>
                    <p className="text-cyan-400 text-sm">{data.value} scans ({percentage}%)</p>
                </div>
            );
        }
        return null;
    };

    const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (percent < 0.05) return null; // Don't show label for small slices

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-xs font-semibold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <motion.div
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                        Severity Distribution
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">Risk levels across all scans</p>
                </div>
                {trend && (
                    <div className={`px-3 py-1 rounded-lg bg-slate-700/50 border border-slate-600 ${trendConfig[trend].color}`}>
                        <span className="text-sm font-semibold">{trendConfig[trend].icon} {trendConfig[trend].text}</span>
                    </div>
                )}
            </div>

            {severityData.length > 0 ? (
                <>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={severityData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={CustomLabel}
                                outerRadius={90}
                                innerRadius={50}
                                fill="#8884d8"
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={800}
                            >
                                {severityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Legend with counts */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {severityData.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                                <span className="text-gray-300">{item.name}</span>
                                <span className="text-gray-500 ml-auto">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                    <p>No data available</p>
                </div>
            )}
        </motion.div>
    );
}
