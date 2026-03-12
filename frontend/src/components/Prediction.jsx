import React from 'react';
import DiseaseInfo from './DiseaseInfo';
import PredictionSuggestions from './PredictionSuggestions';
import PredictionExport from './PredictionExport';
import { useTranslation } from 'react-i18next';

export default function Prediction({ result, loading, imageUrl }) {
    const { t } = useTranslation();
    if (!result && !loading) {
        return null;
    }

    if (loading) {
        return (
            <div className="bg-white/80 dark:bg-slate-800/50 rounded-lg shadow-md p-6 border border-gray-200 dark:border-cyan-500/20">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
                        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">{t('prediction.analyzing')}</p>
                    </div>
                </div>
            </div>
        );
    }

    const { prediction, confidence, top_predictions, processing_time } = result;
    const confidencePercent = (confidence * 100).toFixed(2);
    const conf = confidence * 100;

    // Color-coded confidence levels
    const getConfidenceColor = (conf) => {
        if (conf >= 90) return { bg: 'bg-green-500', text: 'text-green-700', label: t('prediction.highConfidence'), ring: 'ring-green-200' };
        if (conf >= 70) return { bg: 'bg-yellow-500', text: 'text-yellow-700', label: t('prediction.mediumConfidence'), ring: 'ring-yellow-200' };
        return { bg: 'bg-red-500', text: 'text-red-700', label: t('prediction.lowConfidence'), ring: 'ring-red-200' };
    };

    const confidenceStyle = getConfidenceColor(conf);

    return (
        <div className="space-y-6">
            {/* Main Prediction Card */}
            <div className="bg-white/80 dark:bg-slate-800/50 rounded-lg shadow-md p-6 border border-gray-200 dark:border-cyan-500/20">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{t('prediction.results')}</h2>

                {/* Main Prediction with Enhanced Visual */}
                <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700/50 dark:to-slate-800/50 rounded-lg p-6 mb-6 ring-4 ${confidenceStyle.ring}`}>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('prediction.predictedDisease')}</p>
                        <h3 className="text-2xl font-bold text-blue-700 dark:text-cyan-400 mb-4">
                            {prediction}
                        </h3>

                        {/* Confidence with Color Coding */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className={`font-semibold ${confidenceStyle.text} dark:text-white`}>
                                    {confidenceStyle.label}
                                </span>
                                <span className={`font-bold ${confidenceStyle.text} dark:text-cyan-400 text-lg`}>
                                    {confidencePercent}%
                                </span>
                            </div>

                            {/* Animated Progress Bar with Color */}
                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-6 overflow-hidden shadow-inner">
                                <div
                                    className={`h-6 rounded-full transition-all duration-700 ease-out ${confidenceStyle.bg} flex items-center justify-center`}
                                    style={{ width: `${confidencePercent}%` }}
                                >
                                    {conf >= 30 && (
                                        <span className="text-white text-xs font-semibold">
                                            {Math.round(conf)}%
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Confidence Message */}
                        <p className={`text-sm ${confidenceStyle.text} dark:text-gray-300 italic`}>
                            {conf >= 90 && t('prediction.highConfidenceMsg')}
                            {conf >= 70 && conf < 90 && t('prediction.mediumConfidenceMsg')}
                            {conf < 70 && t('prediction.lowConfidenceMsg')}
                        </p>
                    </div>

                    {/* Export and Share Buttons */}
                    <div className="mt-6 flex justify-center">
                        <PredictionExport
                            prediction={prediction}
                            imageUrl={imageUrl}
                            confidence={confidence}
                        />
                    </div>
                </div>

                {/* Top 3 Predictions */}
                <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">{t('prediction.top3')}</h4>
                    <div className="space-y-3">
                        {top_predictions && top_predictions.map((pred, index) => {
                            const predConf = pred.confidence * 100;
                            const predStyle = getConfidenceColor(predConf);

                            return (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                    <div className="flex items-center flex-grow">
                                        <span className={`flex items-center justify-center w-8 h-8 rounded-full ${predStyle.bg} text-white font-semibold mr-3 flex-shrink-0`}>
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-700 dark:text-gray-200">{pred.class}</span>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <div className="w-24 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${predStyle.bg}`}
                                                style={{ width: `${(pred.confidence * 100).toFixed(0)}%` }}
                                            ></div>
                                        </div>
                                        <span className={`font-semibold ${predStyle.text} dark:text-gray-200 min-w-[60px] text-right`}>
                                            {(pred.confidence * 100).toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Processing Time */}
                {processing_time && (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        {t('prediction.processedIn', { time: processing_time.toFixed(3) })}
                    </div>
                )}

                {/* Disclaimer */}
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        {t('prediction.disclaimer')}
                    </p>
                </div>
            </div>

            {/* Real-time Personalized Suggestions */}
            <PredictionSuggestions prediction={prediction} confidence={confidence} />

            {/* Disease Information Card */}
            <DiseaseInfo diseaseName={prediction} />
        </div>
    );
}
