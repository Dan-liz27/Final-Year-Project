import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';
import Prediction from '../components/Prediction';
import { useApp } from '../context/AppContext';
import { mlAPI } from '../services/api';

export default function UploadPage() {
    const navigate = useNavigate();
    const { addPrediction } = useApp();
    const { t } = useTranslation();
    const [predictionResult, setPredictionResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handlePredict = async (file) => {
        setIsAnalyzing(true);
        setPredictionResult(null);
        try {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            setImageFile(file);
            const data = await mlAPI.predict(file);
            const result = {
                prediction: data.prediction,
                confidence: data.confidence,
                topPredictions: data.top_predictions || [],
                processingTime: data.processing_time,
                timestamp: new Date().toISOString(),
                imageUrl: url,
                imageFile: file
            };
            setPredictionResult(result);
            try {
                await addPrediction(result);
                toast.success(t('upload.predictionSaved'));
            } catch (saveError) {
                toast.error(t('upload.saveFailed'));
            }
        } catch (error) {
            toast.error(t('upload.analyzeFailed'));
            setPredictionResult({ error: t('upload.analyzeError'), timestamp: new Date().toISOString() });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <motion.div className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">
                        {t('upload.pageTitle')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
                        {t('upload.pageSubtitle')}
                    </p>
                </motion.div>

                <div className="space-y-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <ImageUpload onPredict={handlePredict} loading={isAnalyzing} />
                    </motion.div>
                    {(predictionResult || isAnalyzing) && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <Prediction result={predictionResult} loading={isAnalyzing} imageUrl={imageUrl} />
                        </motion.div>
                    )}
                </div>

                <motion.div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="text-3xl">💡</span>
                        {t('upload.tipsTitle')}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-xl flex-shrink-0">💡</div>
                            <div>
                                <h3 className="text-gray-900 dark:text-white font-semibold mb-1">{t('upload.tip1Title')}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{t('upload.tip1Desc')}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-xl flex-shrink-0">📏</div>
                            <div>
                                <h3 className="text-gray-900 dark:text-white font-semibold mb-1">{t('upload.tip2Title')}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{t('upload.tip2Desc')}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🎯</div>
                            <div>
                                <h3 className="text-gray-900 dark:text-white font-semibold mb-1">{t('upload.tip3Title')}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">{t('upload.tip3Desc')}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div className="mt-8 p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">⚠️</span>
                        <div>
                            <h3 className="text-yellow-600 dark:text-yellow-400 font-semibold mb-2">{t('upload.disclaimerTitle')}</h3>
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{t('upload.disclaimerBody')}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
