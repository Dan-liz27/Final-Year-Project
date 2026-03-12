import React from 'react';

export default function PredictionHistory({ history, onClear }) {
    if (!history || history.length === 0) {
        return null;
    }

    return (
        <div className="bg-white/80 dark:bg-slate-800/50 rounded-lg shadow-md p-6 border border-gray-200 dark:border-cyan-500/20">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Prediction History</h2>
                <button
                    onClick={onClear}
                    className="text-sm px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors border border-red-200 dark:border-red-700/50"
                >
                    Clear History
                </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.slice().reverse().map((item, index) => {
                    const confidencePercent = (item.confidence * 100).toFixed(1);
                    const conf = item.confidence * 100;
                    const confidenceColor =
                        conf >= 90 ? 'text-green-600' :
                            conf >= 70 ? 'text-yellow-600' :
                                'text-red-600';

                    return (
                        <div
                            key={item.timestamp}
                            className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-slate-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors border border-gray-200 dark:border-slate-600/30"
                        >
                            {/* Thumbnail */}
                            <div className="flex-shrink-0">
                                <img
                                    src={item.imageUrl}
                                    alt="Prediction thumbnail"
                                    className="w-16 h-16 object-cover rounded-lg border-2 border-gray-300 dark:border-slate-600"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-grow min-w-0">
                                <p className="font-semibold text-gray-800 dark:text-white truncate">
                                    {item.prediction}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-sm font-semibold ${confidenceColor}`}>
                                        {confidencePercent}%
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(item.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>

                            {/* Confidence indicator */}
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border-4"
                                    style={{ borderColor: conf >= 90 ? '#10b981' : conf >= 70 ? '#f59e0b' : '#ef4444' }}>
                                    <span className={`text-sm font-bold ${confidenceColor}`}>
                                        {Math.round(conf)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Total predictions: {history.length}
            </div>
        </div>
    );
}
