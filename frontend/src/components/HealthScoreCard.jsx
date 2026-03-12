import React from 'react';
import { motion } from 'framer-motion';

export default function HealthScoreCard({ history }) {
    // Calculate health score based on multiple factors
    const calculateHealthScore = () => {
        if (history.length === 0) return { score: 0, grade: 'N/A', factors: [] };

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Factor 1: Scan Consistency (0-25 points)
        const recentScans = history.filter(p => new Date(p.timestamp) > thirtyDaysAgo).length;
        const consistencyScore = Math.min(25, recentScans * 5); // 5 points per scan, max 25

        // Factor 2: Average Confidence (0-30 points)
        const avgConfidence = history.reduce((sum, p) => sum + p.confidence, 0) / history.length;
        const confidenceScore = avgConfidence * 30;

        // Factor 3: Severity Trend (0-25 points)
        const severityMap = { high: 0, medium: 15, low: 20, none: 25, unknown: 10 };
        const recentSeverities = history.slice(-5).map(p => {
            const diseaseInfo = p.severity || 'unknown';
            return severityMap[diseaseInfo] || 10;
        });
        const severityScore = recentSeverities.length > 0
            ? recentSeverities.reduce((a, b) => a + b, 0) / recentSeverities.length
            : 0;

        // Factor 4: Recency (0-20 points)
        const lastScan = new Date(history[history.length - 1]?.timestamp || 0);
        const daysSinceLastScan = Math.floor((now - lastScan) / (1000 * 60 * 60 * 24));
        const recencyScore = Math.max(0, 20 - daysSinceLastScan * 2); // Lose 2 points per day

        const totalScore = Math.round(consistencyScore + confidenceScore + severityScore + recencyScore);

        let grade, color;
        if (totalScore >= 85) { grade = 'Excellent'; color = 'green'; }
        else if (totalScore >= 70) { grade = 'Good'; color = 'blue'; }
        else if (totalScore >= 50) { grade = 'Fair'; color = 'yellow'; }
        else { grade = 'Needs Attention'; color = 'red'; }

        return {
            score: totalScore,
            grade,
            color,
            factors: [
                { name: 'Scan Consistency', score: consistencyScore, max: 25, detail: `${recentScans} scans in last 30 days` },
                { name: 'Avg Confidence', score: Math.round(confidenceScore), max: 30, detail: `${(avgConfidence * 100).toFixed(1)}% average` },
                { name: 'Severity Trend', score: Math.round(severityScore), max: 25, detail: 'Based on recent scans' },
                { name: 'Scan Recency', score: Math.round(recencyScore), max: 20, detail: `${daysSinceLastScan} days ago` }
            ]
        };
    };

    const healthData = calculateHealthScore();
    const { score, grade, color, factors } = healthData;

    const circumference = 2 * Math.PI * 70;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const colorClasses = {
        green: { bg: 'from-green-500 to-emerald-600', text: 'text-green-400', ring: 'stroke-green-400' },
        blue: { bg: 'from-blue-500 to-cyan-600', text: 'text-blue-400', ring: 'stroke-blue-400' },
        yellow: { bg: 'from-yellow-500 to-orange-600', text: 'text-yellow-400', ring: 'stroke-yellow-400' },
        red: { bg: 'from-red-500 to-rose-600', text: 'text-red-400', ring: 'stroke-red-400' }
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <motion.div
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30 shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Skin Health Score
            </h3>

            <div className="flex items-center justify-between mb-6">
                {/* Circular Progress */}
                <div className="relative">
                    <svg className="transform -rotate-90 w-40 h-40">
                        {/* Background circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            className="text-slate-700"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            className={colors.ring}
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                            className={`text-4xl font-bold ${colors.text}`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        >
                            {score}
                        </motion.span>
                        <span className="text-gray-400 text-sm">/ 100</span>
                    </div>
                </div>

                {/* Grade Badge */}
                <div className="text-right">
                    <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${colors.bg} mb-2`}>
                        <span className="text-white font-bold text-lg">{grade}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Overall Status</p>
                </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-300 mb-2">Score Breakdown:</p>
                {factors.map((factor, index) => (
                    <motion.div
                        key={factor.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-300">{factor.name}</span>
                            <span className="text-sm text-gray-400">{factor.score}/{factor.max}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                            <motion.div
                                className={`h-full bg-gradient-to-r ${colors.bg}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(factor.score / factor.max) * 100}%` }}
                                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{factor.detail}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recommendations */}
            <div className="mt-6 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                <p className="text-sm text-cyan-300 font-semibold mb-2">💡 Tips to Improve:</p>
                <ul className="text-xs text-gray-300 space-y-1">
                    {score < 85 && factors[0].score < 20 && <li>• Scan more regularly for better tracking</li>}
                    {score < 85 && factors[3].score < 15 && <li>• Schedule your next skin check soon</li>}
                    {score < 85 && factors[1].score < 25 && <li>• Ensure good lighting for clearer images</li>}
                    {score >= 85 && <li>• Keep up the great work! 🎉</li>}
                </ul>
            </div>
        </motion.div>
    );
}
