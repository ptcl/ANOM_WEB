import { useState, useEffect } from 'react';

export const usePerformantAnimations = () => {
    const [useReducedMotion, setUseReducedMotion] = useState(false);
    const [isLowEndDevice, setIsLowEndDevice] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setUseReducedMotion(mediaQuery.matches);

        const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;
        const isLowEnd = navigator.hardwareConcurrency <= 2 ||
            (deviceMemory && deviceMemory <= 2) ||
            /Mobile|Android/i.test(navigator.userAgent);
        setIsLowEndDevice(isLowEnd);

        const handleChange = () => setUseReducedMotion(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return {
        shouldUseMotion: !useReducedMotion && !isLowEndDevice,
        useReducedMotion,
        isLowEndDevice
    };
};