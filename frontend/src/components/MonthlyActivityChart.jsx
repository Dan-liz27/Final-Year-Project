import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

export default function MonthlyActivityChart({ history }) {
    // Generate last 12 months data
    const generateMonthlyData = () => {
        const now = new Date();
        const months = eachMonthOfInterval({
            start: subMonths(now, 11),
            end: now
        });

        return months.map(month => {
            const monthStart = startOfMonth(month);
            const monthEnd = endOfMonth(month);

            const scansInMonth = history.filter(p => {
                const scanDate = new Date(p.timestamp);
                return scanDate >= monthStart && scanDate <= monthEnd;
            }).length;

            const isCurrentMonth = format(month, 'MMM yyyy') === format(now, 'MMM yyyy');

            return {
                month: format(month, 'MMM'),
                fullMonth: format(month, 'MMM yyyy'),
                scans: scansInMonth,
                isCurrentMonth
            };
        });
    };

    const monthlyData = generateMonthlyData();
    const totalScans = monthlyData.reduce((sum, m) => sum + m.scans, 0);
    const avgScansPerMonth = (totalScans / 12).toFixed(1);
    const maxScans = Math.max(...monthlyData.map(m => m.scans));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 border border-cyan-500/50 rounded-lg p-3 shadow-xl">
                    <p className="text-white font-semibold">{payload[0].payload.fullMonth}</p>
                    <p className="text-cyan-400 text-sm">{payload[0].value} scans</p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Monthly Activity
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">Scan frequency over the past 12 months</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-cyan-400">{avgScansPerMonth}</p>
                    <p className="text-gray-400 text-sm">avg/month</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                        dataKey="month"
                        stroke="#94a3b8"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(6, 182, 212, 0.1)' }} />
                    <Bar
                        dataKey="scans"
                        radius={[8, 8, 0, 0]}
                    >
                        {monthlyData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.isCurrentMonth ? '#06b6d4' : entry.scans === maxScans ? '#3b82f6' : '#64748b'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex gap-4 mt-4 text-xs text-gray-400 justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-cyan-500"></div>
                    <span>Current Month</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500"></div>
                    <span>Peak Month</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-slate-500"></div>
                    <span>Other Months</span>
                </div>
            </div>
        </motion.div>
    );
}
