import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ConfidenceTrendChart({ history }) {
    // Prepare data from history
    const chartData = history.slice(-10).map((item, index) => ({
        index: index + 1,
        confidence: (item.confidence * 100).toFixed(1),
        disease: item.prediction
    }));

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {payload[0].payload.disease}
                    </p>
                    <p className="text-sm text-cyan-600 dark:text-cyan-400">
                        Confidence: {payload[0].value}%
                    </p>
                </div>
            );
        }
        return null;
    };

    if (!history || history.length === 0) {
        return (
            <div className="bg-white/80 dark:bg-slate-800/50 rounded-lg shadow-md p-6 border border-gray-200 dark:border-cyan-500/20">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Confidence Trend</h3>
                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                    <p>No prediction history available yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/80 dark:bg-slate-800/50 rounded-lg shadow-md p-6 border border-gray-200 dark:border-cyan-500/20">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Confidence Trend
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                    (Last {Math.min(history.length, 10)} predictions)
                </span>
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
                    <XAxis
                        dataKey="index"
                        label={{ value: 'Prediction #', position: 'insideBottom', offset: -5 }}
                        className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis
                        label={{ value: 'Confidence (%)', angle: -90, position: 'insideLeft' }}
                        domain={[0, 100]}
                        className="text-gray-600 dark:text-gray-400"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="confidence"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        dot={{ fill: '#06b6d4', r: 5 }}
                        activeDot={{ r: 8 }}
                        name="Confidence %"
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {(history.reduce((sum, item) => sum + item.confidence, 0) / history.length * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Average</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {(Math.max(...history.map(h => h.confidence)) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Highest</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {(Math.min(...history.map(h => h.confidence)) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Lowest</div>
                </div>
            </div>
        </div>
    );
}
