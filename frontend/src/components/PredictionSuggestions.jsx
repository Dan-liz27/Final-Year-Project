import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function PredictionSuggestions({ prediction, confidence }) {
    const { user } = useApp();

    // Generate contextual suggestions based on prediction + user profile
    const getSuggestions = () => {
        const suggestions = [];
        const disease = prediction?.toLowerCase() || '';

        // Disease-specific suggestions
        if (disease.includes('acne')) {
            suggestions.push({
                title: 'Immediate Care',
                tip: 'Avoid touching or picking affected areas. Keep the area clean with gentle cleansers.',
                icon: '🧼',
                priority: 'high'
            });

            if (user.skinType === 'Oily') {
                suggestions.push({
                    title: 'For Oily Skin',
                    tip: 'Use non-comedogenic products and consider salicylic acid-based treatments.',
                    icon: '💧',
                    priority: 'high'
                });
            }

            if (user.ageRange === '18-25') {
                suggestions.push({
                    title: 'Hormonal Factors',
                    tip: 'Teen/young adult acne often responds well to consistent routine. Consider seeing a dermatologist if persistent.',
                    icon: '⏰',
                    priority: 'medium'
                });
            }
        }

        if (disease.includes('melanoma') || disease.includes('cancer')) {
            suggestions.push({
                title: 'URGENT: Professional Consultation',
                tip: 'Seek immediate dermatologist evaluation. Early detection is crucial for treatment success.',
                icon: '⚕️',
                priority: 'critical'
            });

            if (user.sunExposure === 'High') {
                suggestions.push({
                    title: 'Sun Protection Critical',
                    tip: 'Use SPF 50+ daily, wear protective clothing, avoid peak sun hours (10am-4pm).',
                    icon: '☀️',
                    priority: 'critical'
                });
            }
        }

        if (disease.includes('eczema') || disease.includes('dermatitis')) {
            suggestions.push({
                title: 'Moisturize Frequently',
                tip: 'Apply fragrance-free, thick moisturizers 2-3 times daily, especially after bathing.',
                icon: '🧴',
                priority: 'high'
            });

            if (user.hasAllergies) {
                suggestions.push({
                    title: 'Allergy Management',
                    tip: `Avoid known allergens (${user.allergyDetails || 'your listed allergies'}). Consider patch testing new products.`,
                    icon: '⚠️',
                    priority: 'high'
                });
            }
        }

        if (disease.includes('psoriasis')) {
            suggestions.push({
                title: 'Stress Management',
                tip: 'Stress can trigger flare-ups. Practice stress-reduction techniques and maintain good sleep.',
                icon: '🧘',
                priority: 'medium'
            });
        }

        if (disease.includes('rosacea')) {
            if (user.skinType === 'Sensitive') {
                suggestions.push({
                    title: 'Gentle Skincare',
                    tip: 'Avoid harsh ingredients, hot water, and spicy foods that may trigger flare-ups.',
                    icon: '🌸',
                    priority: 'high'
                });
            }
        }

        if (disease.includes('fungal') || disease.includes('tinea')) {
            suggestions.push({
                title: 'Antifungal Treatment',
                tip: 'Keep area dry and clean. Over-the-counter antifungal creams may help; consult doctor if persistent.',
                icon: '💊',
                priority: 'high'
            });

            suggestions.push({
                title: 'Prevention',
                tip: 'Wear breathable fabrics, change sweaty clothes promptly, avoid sharing towels.',
                icon: '👕',
                priority: 'medium'
            });
        }

        // Confidence-based suggestions
        if (confidence < 0.7) {
            suggestions.push({
                title: 'Low Confidence Alert',
                tip: 'This prediction has lower confidence. Please consult a healthcare professional for accurate diagnosis.',
                icon: '📋',
                priority: 'high'
            });
        }

        // Age-specific suggestions
        if (user.ageRange === '60+' && !disease.includes('age')) {
            suggestions.push({
                title: 'Senior Skin Care',
                tip: 'Mature skin requires extra hydration and sun protection. Regular skin checks are important.',
                icon: '👴',
                priority: 'medium'
            });
        }

        // Medication interaction warning
        if (user.onMedication) {
            suggestions.push({
                title: 'Medication Check',
                tip: 'Some skin medications interact with each other. Inform your doctor about all current medications.',
                icon: '💊',
                priority: 'medium'
            });
        }

        // Sun exposure based on skin tone
        if (user.skinTone === 'Fair' && !disease.includes('melanoma')) {
            suggestions.push({
                title: 'Extra Sun Protection',
                tip: 'Fair skin is more susceptible to sun damage. Use SPF 30+ daily, even indoors.',
                icon: '🌞',
                priority: 'medium'
            });
        }

        // General wellness
        suggestions.push({
            title: 'Holistic Care',
            tip: 'Stay hydrated, eat a balanced diet rich in vitamins A, C, E. Good sleep supports skin healing.',
            icon: '🥗',
            priority: 'low'
        });

        // Profile completion reminder
        if (!user.skinType || !user.ageRange || !user.skinTone) {
            suggestions.push({
                title: 'Complete Your Profile',
                tip: 'Fill out your complete profile for more personalized recommendations.',
                icon: '📝',
                priority: 'low'
            });
        }

        return suggestions.sort((a, b) => {
            const priority = { critical: 0, high: 1, medium: 2, low: 3 };
            return priority[a.priority] - priority[b.priority];
        });
    };

    const suggestions = getSuggestions();

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'critical':
                return 'border-red-500/50 bg-red-500/10';
            case 'high':
                return 'border-orange-500/50 bg-orange-500/10';
            case 'medium':
                return 'border-cyan-500/30 bg-cyan-500/5';
            case 'low':
                return 'border-slate-500/30 bg-slate-700/20';
            default:
                return 'border-cyan-500/30 bg-cyan-500/5';
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'critical':
                return <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">URGENT</span>;
            case 'high':
                return <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">Important</span>;
            default:
                return null;
        }
    };

    return (
        <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-500 rounded"></span>
                    PERSONALIZED SUGGESTIONS
                </h3>
                <span className="text-cyan-600 dark:text-cyan-400 text-sm font-bold">{suggestions.length} Tips</span>
            </div>

            <AnimatePresence>
                <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                        <motion.div
                            key={index}
                            className={`p-4 rounded-xl border ${getPriorityStyles(suggestion.priority)} backdrop-blur-sm`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 5, borderColor: 'rgba(6, 182, 212, 0.5)' }}
                        >
                            <div className="flex items-start gap-3">
                                <div className="text-3xl flex-shrink-0">{suggestion.icon}</div>
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white">{suggestion.title}</h4>
                                        {getPriorityBadge(suggestion.priority)}
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">{suggestion.tip}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>

            <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-xs text-gray-700 dark:text-gray-300 text-center">
                    💡 These suggestions are personalized based on the detected condition and your profile. Always consult a healthcare professional for medical advice.
                </p>
            </div>
        </motion.div>
    );
}
