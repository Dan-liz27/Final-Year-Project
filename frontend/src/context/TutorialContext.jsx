import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const TutorialContext = createContext();

export const useTutorial = () => useContext(TutorialContext);

export function TutorialProvider({ children }) {
    const { user } = useAuth();
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Check onboarding status when user logs in
        const checkOnboarding = async () => {
            if (user) {
                try {
                    const token = localStorage.getItem('access_token');
                    const response = await axios.get(
                        'http://localhost:8000/users/profile',
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    );

                    console.log('Profile data:', response.data);
                    console.log('Onboarding completed:', response.data?.onboarding_completed);

                    // Show tutorial if onboarding not completed (false, null, or undefined)
                    if (response.data && response.data.onboarding_completed !== true) {
                        // Small delay to let the UI load
                        setTimeout(() => {
                            console.log('Showing tutorial...');
                            setShowTutorial(true);
                        }, 1500);
                    }
                } catch (error) {
                    console.error('Error checking onboarding status:', error);
                }
            }
        };

        checkOnboarding();
    }, [user]);

    const startTutorial = () => {
        setCurrentStep(0);
        setShowTutorial(true);
    };

    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    const previousStep = () => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    };

    const skipTutorial = async () => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(
                'http://localhost:8000/users/complete-onboarding',
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setShowTutorial(false);
            setCurrentStep(0);
        } catch (error) {
            console.error('Error skipping tutorial:', error);
            // Still hide tutorial even if API call fails
            setShowTutorial(false);
            setCurrentStep(0);
        }
    };

    const completeTutorial = async () => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(
                'http://localhost:8000/users/complete-onboarding',
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setShowTutorial(false);
            setCurrentStep(0);
        } catch (error) {
            console.error('Error completing tutorial:', error);
            // Still hide tutorial even if API call fails
            setShowTutorial(false);
            setCurrentStep(0);
        }
    };

    return (
        <TutorialContext.Provider
            value={{
                showTutorial,
                currentStep,
                startTutorial,
                nextStep,
                previousStep,
                skipTutorial,
                completeTutorial
            }}
        >
            {children}
        </TutorialContext.Provider>
    );
}
