import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorial } from '../../context/TutorialContext';
import { tutorialSteps } from './TutorialSteps';
import './TutorialOverlay.css';

export default function TutorialOverlay() {
    const { currentStep, nextStep, previousStep, skipTutorial, completeTutorial } = useTutorial();
    const [targetRect, setTargetRect] = useState(null);
    const step = tutorialSteps[currentStep];

    useEffect(() => {
        if (step.target) {
            const element = document.querySelector(step.target);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                });
            }
        } else {
            setTargetRect(null);
        }
    }, [currentStep, step.target]);

    const handleNext = () => {
        if (currentStep === tutorialSteps.length - 1) {
            completeTutorial();
        } else {
            nextStep();
        }
    };

    const getTooltipPosition = () => {
        // Always center the tooltip on screen
        return {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90vw'
        };
    };

    return (
        <AnimatePresence>
            <div className="tutorial-overlay">
                {/* Backdrop */}
                <motion.div
                    className="tutorial-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />

                {/* Spotlight */}
                {targetRect && (
                    <motion.div
                        className="tutorial-spotlight"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            top: `${targetRect.top - 8}px`,
                            left: `${targetRect.left - 8}px`,
                            width: `${targetRect.width + 16}px`,
                            height: `${targetRect.height + 16}px`
                        }}
                    />
                )}

                {/* Tooltip */}
                <motion.div
                    className="tutorial-tooltip"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                >
                    <div className="tutorial-header">
                        <h3 className="tutorial-title">{step.title}</h3>
                        <span className="tutorial-step-counter">
                            {currentStep + 1} / {tutorialSteps.length}
                        </span>
                    </div>

                    <p className="tutorial-content">{step.content}</p>

                    <div className="tutorial-actions">
                        <button
                            onClick={skipTutorial}
                            className="tutorial-btn tutorial-btn-skip"
                        >
                            Skip Tour
                        </button>

                        <div className="tutorial-nav">
                            {currentStep > 0 && (
                                <button
                                    onClick={previousStep}
                                    className="tutorial-btn tutorial-btn-secondary"
                                >
                                    ← Previous
                                </button>
                            )}

                            <button
                                onClick={handleNext}
                                className="tutorial-btn tutorial-btn-primary"
                            >
                                {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next →'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
