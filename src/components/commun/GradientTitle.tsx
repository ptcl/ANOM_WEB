'use client';
import { useTranslations } from 'next-intl';
import React from 'react'

interface GradientTitleProps {
    title?: string;
    subtitle?: string;
    titleKey?: string;
    subtitleKey?: string;
    gradientType?: 'auto' | 'vex' | 'anom' | 'classic' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

// Fonction utilitaire pour obtenir les traductions de manière sûre
function useSafeTranslations() {
    try {
        return useTranslations();
    } catch {
        // Retourner une fonction qui retourne la clé si pas de contexte
        return (key: string) => key.split('.').pop() || key;
    }
}

export default function GradientTitle({ title, subtitle, titleKey = 'commun.title', subtitleKey = '', gradientType = 'auto', size = 'lg', className = '' }: GradientTitleProps) {
    const [mounted, setMounted] = React.useState(false);
    const t = useSafeTranslations();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const getGradientClass = () => {
        if (gradientType !== 'auto') {
            switch (gradientType) {
                case 'vex':
                    return 'gradient__title__vex';
                case 'anom':
                    return 'gradient__title__anom';
                case 'classic':
                    return 'gradient__text__classic';
                case 'danger':
                    return 'gradient__title__danger';
                default:
                    return 'gradient__title__anom';
            }
        }

        if (!mounted) {
            return 'gradient__title__vex';
        }

        // Utiliser window.location.pathname pour éviter les problèmes de contexte
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

        if (currentPath === '/') {
            return 'gradient__title__anom';
        }
        
        if (currentPath.includes('/cipher') || currentPath.includes('/vex')) {
            return 'gradient__title__vex';
        }
        
        if (currentPath.includes('/protocol')) {
            return 'gradient__title__anom';
        }
        
        if (currentPath.includes('/resources') || currentPath.includes('/news') || currentPath.includes('/faq')) {
            return 'gradient__title__vex';
        }

        if (currentPath.includes('/identity') || currentPath.includes('/auth')) {
            return 'gradient__title__anom';
        }

        return 'gradient__title__anom';
    };

    // Classes de taille
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'text-2xl md:text-4xl lg:text-6xl';
            case 'md':
                return 'text-3xl md:text-5xl lg:text-7xl';
            case 'lg':
                return 'text-4xl md:text-7xl lg:text-9xl';
            case 'xl':
                return 'text-5xl md:text-8xl lg:text-[10rem]';
            default:
                return 'text-4xl md:text-7xl lg:text-9xl';
        }
    };

    const displayTitle = title || t(titleKey);
    const displaySubtitle = subtitle || (subtitleKey ? t(subtitleKey) : '');
    const gradientClass = getGradientClass();
    const sizeClasses = getSizeClasses();

    return (
        <section className={`flex flex-col justify-center items-center text-center w-full ${className} mb-12`}>
            <h1 className={`leading-8 md:leading-26 ${gradientClass} font-semibold ${sizeClasses} uppercase text-transparent z-10 mx-auto transition-all duration-500`} data-text={displayTitle}>
                {displayTitle}
            </h1>
            {displaySubtitle && (
                <p className='Grotesk text-[var(--light-dark-3)] text-sm md:text-lg max-w-xl z-10 mx-auto mt-2 md:mt-4'>
                    {displaySubtitle}
                </p>
            )}
        </section>
    )
}
