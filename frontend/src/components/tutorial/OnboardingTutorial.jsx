import React from 'react';
import { useTutorial } from '../../context/TutorialContext';
import TutorialOverlay from './TutorialOverlay';

export default function OnboardingTutorial() {
    const { showTutorial } = useTutorial();

    if (!showTutorial) return null;

    return <TutorialOverlay />;
}
