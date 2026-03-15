'use client';
import React, { useEffect, useState } from 'react';

/**
 * Composant ProgressBar personnalisable
 * 
 * @param progress - Pourcentage de progression (0-100)
 * @param backgroundColor - Couleur de fond de la barre - par défaut: 'bg-gray-200'
 * @param fillColor - Couleur de remplissage de la barre - par défaut: 'bg-blue-500'
 * @param height - Hauteur de la barre en pixels - par défaut: 8
 * @param showPercentage - Afficher le pourcentage - par défaut: true
 * @param textColor - Couleur du texte du pourcentage - par défaut: 'text-gray-700'
 * @param animated - Animation de la barre - par défaut: true
 * @param animationDuration - Durée de l'animation en ms - par défaut: 500
 * @param rounded - Barre arrondie - par défaut: true
 * @param className - Classes CSS supplémentaires
 * @param label - Texte à afficher au lieu du pourcentage
 * @param size - Taille prédéfinie ('sm', 'md', 'lg') - par défaut: 'md'
 * 
 * Exemples d'utilisation:
 * <ProgressBar progress={75} />
 * <ProgressBar progress={50} backgroundColor="bg-red-100" fillColor="bg-red-500" />
 * <ProgressBar progress={90} showPercentage={false} height={12} />
 * <ProgressBar progress={25} label="Chargement..." animated={true} />
 * <ProgressBarVariant variant="success" progress={80} />
 * 
 * Hook d'animation:
 * const progress = useProgressAnimation(75, 2000); // Anime vers 75% en 2 secondes
 * <ProgressBar progress={progress} />
 */

interface ProgressBarProps {
    progress: number;
    backgroundColor?: string;
    fillColor?: string;
    height?: number;
    showPercentage?: boolean;
    textColor?: string;
    animated?: boolean;
    animationDuration?: number;
    rounded?: boolean;
    className?: string;
    label?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizePresets = {
    sm: { height: 4, textSize: 'text-xs' },
    md: { height: 8, textSize: 'text-sm' },
    lg: { height: 12, textSize: 'text-base' }
};

// Variantes de couleurs prédéfinies
export const progressBarVariants = {
    primary: { bg: 'bg-gray-200', fill: 'bg-blue-500' },
    success: { bg: 'bg-green-100', fill: 'bg-green-500' },
    warning: { bg: 'bg-yellow-100', fill: 'bg-yellow-500' },
    danger: { bg: 'bg-red-100', fill: 'bg-red-500' },
    info: { bg: 'bg-cyan-100', fill: 'bg-cyan-500' },
    dark: { bg: 'bg-gray-700', fill: 'bg-gray-300' },
    gradient: { bg: 'bg-gray-200', fill: 'bg-gradient-to-r from-blue-500 to-purple-500' },
    neon: { bg: 'bg-gray-900', fill: 'bg-gradient-to-r from-cyan-400 to-blue-500' }
};

export default function ProgressBar({
    progress,
    backgroundColor = 'bg-white/10',
    fillColor = 'bg-blue-500',
    height = 4,
    showPercentage = true,
    textColor = 'text-gray-700',
    animated = true,
    animationDuration = 500,
    className = '',
    label,
    size = 'md'
}: ProgressBarProps) {
    const [currentProgress, setCurrentProgress] = useState(animated ? 0 : progress);

    // Configuration de taille


    // Limiter le progress entre 0 et 100
    const clampedProgress = Math.max(0, Math.min(100, progress));

    // Animation du pourcentage
    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => {
                setCurrentProgress(clampedProgress);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setCurrentProgress(clampedProgress);
        }
    }, [clampedProgress, animated]);

    return (
        <div className={`w-full ${className} z-10`}>
            {/* Texte de pourcentage ou label */}
            {showPercentage && (
                <div className={`flex justify-between items-center mb-2 ${textColor} `}>
                    {label && <span>{label}</span>}
                    <span className="font-medium">
                        {label ? `${Math.round(currentProgress)}%` : `${Math.round(currentProgress)}%`}
                    </span>
                </div>
            )}

            {/* Barre de progression */}
            <div className={`w-full ${backgroundColor} rounded-full overflow-hidden relative`} style={{ height: `${height}px` }}>
                <div className={`h-full ${fillColor} ${animated ? 'transition-all ease-out' : ''}relative overflow-hidden`} style={{ width: `${currentProgress}%`, transitionDuration: animated ? `${animationDuration}ms` : '0ms' }}>
                
                </div>
            </div>
        </div>
    );
}

// Composant avec variante prédéfinie
export function ProgressBarVariant({
    variant = 'primary',
    ...props
}: Omit<ProgressBarProps, 'backgroundColor' | 'fillColor'> & {
    variant?: keyof typeof progressBarVariants
}) {
    const colors = progressBarVariants[variant];
    return (
        <ProgressBar
            backgroundColor={colors.bg}
            fillColor={colors.fill}
            {...props}
        />
    );
}

// Hook pour animer automatiquement une progress bar
export function useProgressAnimation(
    targetProgress: number,
    duration: number = 2000,
    startDelay: number = 0
) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const startTimer = setTimeout(() => {
            const increment = targetProgress / (duration / 50);
            let currentProgress = 0;

            const timer = setInterval(() => {
                currentProgress += increment;
                if (currentProgress >= targetProgress) {
                    setProgress(targetProgress);
                    clearInterval(timer);
                } else {
                    setProgress(currentProgress);
                }
            }, 50);

            return () => clearInterval(timer);
        }, startDelay);

        return () => clearTimeout(startTimer);
    }, [targetProgress, duration, startDelay]);

    return progress;
}