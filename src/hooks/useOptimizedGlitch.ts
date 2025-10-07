import { useMemo } from 'react';

interface GlitchPerformanceSettings {
    glitchProbability: number;
    glitchInterval: number;
    glitchDuration: number;
    shouldAnimate: boolean;
}

export const useOptimizedGlitchSettings = (originalProbability: number = 0.02, originalInterval: number = 50, originalDuration: number = 150): GlitchPerformanceSettings => {
    return useMemo(() => {
        if (typeof window === 'undefined') {
            return {
                glitchProbability: originalProbability,
                glitchInterval: originalInterval,
                glitchDuration: originalDuration,
                shouldAnimate: true
            };
        }

        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        const isLowEndDevice = hardwareConcurrency <= 2;
        const isMobile = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            return {
                glitchProbability: 0,
                glitchInterval: originalInterval,
                glitchDuration: originalDuration,
                shouldAnimate: false
            };
        }

        if (isLowEndDevice || isMobile) {
            return {
                glitchProbability: originalProbability * 0.5,
                glitchInterval: originalInterval * 2,
                glitchDuration: originalDuration * 0.8,
                shouldAnimate: true
            };
        }

        return {
            glitchProbability: originalProbability,
            glitchInterval: originalInterval,
            glitchDuration: originalDuration,
            shouldAnimate: true
        };
    }, [originalProbability, originalInterval, originalDuration]);
};

export const useGlitchTextManager = () => {
    return useMemo(() => {
        const activeGlitchTexts = new Set();

        return {
            registerGlitchText: (id: string) => {
                activeGlitchTexts.add(id);
            },
            unregisterGlitchText: (id: string) => {
                activeGlitchTexts.delete(id);
            },
            getActiveCount: () => activeGlitchTexts.size,
            shouldReducePerformance: () => activeGlitchTexts.size > 5
        };
    }, []);
};