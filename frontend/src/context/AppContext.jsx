import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userAPI, predictionsAPI } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const { user: authUser, isAuthenticated } = useAuth();
    const [history, setHistory] = useState([]);
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);

    // Load user profile and predictions from backend when authenticated
    useEffect(() => {
        if (isAuthenticated && authUser) {
            loadUserData();
        } else {
            // Clear data when not authenticated
            setHistory([]);
            setProfile(null);
            setStats(null);
            setRecommendations([]);
        }
    }, [isAuthenticated, authUser]);

    const loadUserData = async () => {
        try {
            setLoading(true);

            // Load profile, predictions, and stats in parallel
            const [profileData, predictionsData, statsData, recsData] = await Promise.all([
                userAPI.getProfile().catch(() => null),
                predictionsAPI.getAll({ limit: 100, sort_by: 'created_at', order: 'desc' }).catch(() => []),
                userAPI.getStats().catch(() => null),
                userAPI.getRecommendations().catch(() => ({ recommendations: [] }))
            ]);

            // Map profile data to expected format
            if (profileData) {
                const mappedProfile = {
                    name: authUser?.username || 'User',
                    role: 'Student',
                    ageRange: profileData.age_range || '',
                    gender: profileData.gender || '',
                    location: profileData.location || '',
                    skinType: profileData.skin_type || '',
                    skinTone: profileData.skin_tone || '',
                    mainConcerns: profileData.main_concerns || [],
                    hasAllergies: profileData.has_allergies || false,
                    allergyDetails: profileData.allergy_details || '',
                    onMedication: profileData.on_medication || false,
                    medicationDetails: profileData.medication_details || '',
                    previousConditions: profileData.previous_conditions || [],
                    familyHistory: profileData.family_history || [],
                    sunExposure: profileData.sun_exposure || '',
                    skincareLevel: profileData.skincare_level || '',
                    settings: {
                        confidenceThreshold: profileData.confidence_threshold || 70,
                        viewMode: profileData.view_mode || 'grid'
                    }
                };
                setProfile(mappedProfile);
            } else {
                // Set default profile if none exists
                setProfile({
                    name: authUser?.username || 'User',
                    role: 'Student',
                    ageRange: '',
                    gender: '',
                    location: '',
                    skinType: '',
                    skinTone: '',
                    mainConcerns: [],
                    hasAllergies: false,
                    allergyDetails: '',
                    onMedication: false,
                    medicationDetails: '',
                    previousConditions: [],
                    familyHistory: [],
                    sunExposure: '',
                    skincareLevel: '',
                    settings: {
                        confidenceThreshold: 70,
                        viewMode: 'grid'
                    }
                });
            }

            // Map predictions data to expected format
            if (predictionsData && Array.isArray(predictionsData)) {
                const mappedPredictions = predictionsData.map(p => ({
                    id: p.id,
                    prediction: p.prediction,
                    confidence: p.confidence,
                    topPredictions: p.top_predictions || [],
                    processingTime: p.processing_time,
                    imageUrl: `http://localhost:8000/${p.image_path}`,
                    timestamp: p.created_at,
                    userNotes: p.user_notes || '',
                    symptoms: p.symptoms || {},
                    locationOnBody: p.location_on_body || ''
                }));
                setHistory(mappedPredictions);
            }

            if (statsData) setStats(statsData);
            if (recsData) setRecommendations(recsData.recommendations || []);
        } catch (error) {
            console.error('Failed to load user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addPrediction = async (prediction) => {
        if (!isAuthenticated) {
            console.warn('Cannot save prediction: user not authenticated');
            return null;
        }

        try {
            // Upload image first if it's a blob
            let imagePath = prediction.imageUrl;

            if (prediction.imageFile) {
                const uploadResult = await predictionsAPI.uploadImage(prediction.imageFile);
                imagePath = uploadResult.path;
            }

            // Create prediction in backend
            const predictionData = {
                image_path: imagePath,
                prediction: prediction.prediction,
                confidence: prediction.confidence,
                top_predictions: prediction.topPredictions || [],
                processing_time: prediction.processingTime,
                image_metadata: {
                    original_filename: prediction.imageFile?.name,
                    size: prediction.imageFile?.size
                }
            };

            const savedPrediction = await predictionsAPI.create(predictionData);

            // Add to local state
            setHistory(prev => [savedPrediction, ...prev]);

            // Refresh stats
            const newStats = await userAPI.getStats();
            setStats(newStats);

            return savedPrediction;
        } catch (error) {
            console.error('Failed to save prediction:', error);
            throw error;
        }
    };

    const clearHistory = async () => {
        if (!isAuthenticated) return;

        try {
            // Delete all predictions
            await Promise.all(history.map(item => predictionsAPI.delete(item.id)));
            setHistory([]);

            // Refresh stats
            const newStats = await userAPI.getStats();
            setStats(newStats);
        } catch (error) {
            console.error('Failed to clear history:', error);
            throw error;
        }
    };

    const updateUserProfile = async (updates) => {
        if (!isAuthenticated) return;

        try {
            // Map frontend field names to backend snake_case
            const backendUpdates = {
                age_range: updates.ageRange,
                gender: updates.gender,
                location: updates.location,
                skin_type: updates.skinType,
                skin_tone: updates.skinTone,
                main_concerns: updates.mainConcerns,
                has_allergies: updates.hasAllergies,
                allergy_details: updates.allergyDetails,
                on_medication: updates.onMedication,
                medication_details: updates.medicationDetails,
                previous_conditions: updates.previousConditions,
                family_history: updates.familyHistory,
                sun_exposure: updates.sunExposure,
                skincare_level: updates.skincareLevel
            };

            // Remove undefined values
            Object.keys(backendUpdates).forEach(key => {
                if (backendUpdates[key] === undefined) {
                    delete backendUpdates[key];
                }
            });

            const updatedProfile = await userAPI.updateProfile(backendUpdates);

            // Map response back to frontend format
            const mappedProfile = {
                ...profile,
                ageRange: updatedProfile.age_range || profile.ageRange,
                gender: updatedProfile.gender || profile.gender,
                location: updatedProfile.location || profile.location,
                skinType: updatedProfile.skin_type || profile.skinType,
                skinTone: updatedProfile.skin_tone || profile.skinTone,
                mainConcerns: updatedProfile.main_concerns || profile.mainConcerns,
                hasAllergies: updatedProfile.has_allergies ?? profile.hasAllergies,
                allergyDetails: updatedProfile.allergy_details || profile.allergyDetails,
                onMedication: updatedProfile.on_medication ?? profile.onMedication,
                medicationDetails: updatedProfile.medication_details || profile.medicationDetails,
                previousConditions: updatedProfile.previous_conditions || profile.previousConditions,
                familyHistory: updatedProfile.family_history || profile.familyHistory,
                sunExposure: updatedProfile.sun_exposure || profile.sunExposure,
                skincareLevel: updatedProfile.skincare_level || profile.skincareLevel
            };

            setProfile(mappedProfile);

            // Refresh recommendations as they depend on profile
            const recsData = await userAPI.getRecommendations();
            setRecommendations(recsData.recommendations || []);

            return mappedProfile;
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    };

    const updateSettings = async (settings) => {
        if (!profile) return;

        try {
            const updatedProfile = await userAPI.updateProfile({
                confidence_threshold: settings.confidenceThreshold,
                view_mode: settings.viewMode
            });
            setProfile(updatedProfile);
            return updatedProfile;
        } catch (error) {
            console.error('Failed to update settings:', error);
            throw error;
        }
    };

    const deletePrediction = async (predictionId) => {
        if (!isAuthenticated) return;

        try {
            await predictionsAPI.delete(predictionId);
            setHistory(prev => prev.filter(p => p.id !== predictionId));

            // Refresh stats
            const newStats = await userAPI.getStats();
            setStats(newStats);
        } catch (error) {
            console.error('Failed to delete prediction:', error);
            throw error;
        }
    };

    const updatePredictionNotes = async (predictionId, notes) => {
        if (!isAuthenticated) return;

        try {
            const updated = await predictionsAPI.update(predictionId, { user_notes: notes });
            setHistory(prev => prev.map(p => p.id === predictionId ? updated : p));
            return updated;
        } catch (error) {
            console.error('Failed to update prediction notes:', error);
            throw error;
        }
    };

    // Calculate statistics from backend stats or local data
    const calculatedStats = stats || {
        total: history.length,
        highConfidence: history.filter(p => p.confidence >= 0.9).length,
        mediumConfidence: history.filter(p => p.confidence >= 0.7 && p.confidence < 0.9).length,
        lowConfidence: history.filter(p => p.confidence < 0.7).length,
        avgConfidence: history.length > 0
            ? (history.reduce((sum, p) => sum + p.confidence, 0) / history.length)
            : 0,
        mostCommonDisease: getMostCommon(history),
        predictions_this_month: 0,
        predictions_this_week: 0
    };

    function getMostCommon(predictions) {
        if (predictions.length === 0) return 'None';

        const counts = {};
        predictions.forEach(p => {
            counts[p.prediction] = (counts[p.prediction] || 0) + 1;
        });

        let max = 0;
        let common = 'None';
        Object.entries(counts).forEach(([disease, count]) => {
            if (count > max) {
                max = count;
                common = disease;
            }
        });

        return common;
    }

    const value = {
        history,
        profile,
        stats: calculatedStats,
        loading,
        recommendations,
        addPrediction,
        clearHistory,
        updateUserProfile,
        updateSettings,
        deletePrediction,
        updatePredictionNotes,
        refreshData: loadUserData,
        // Legacy compatibility
        user: profile || {},
        updateUser: updateUserProfile,
        getRecommendations: () => recommendations
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
