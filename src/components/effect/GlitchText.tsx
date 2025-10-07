'use client'
import { DEFAULT_GLITCH_CHARS, IGlitchChar, IGlitchTextProps } from '@/types/effect'
import { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react'
import { useOptimizedGlitchSettings } from '@/hooks/useOptimizedGlitch'

interface IExtendedGlitchTextProps extends IGlitchTextProps {
    glitchMode?: 'chars' | 'font';
    primaryFont?: string;
    glitchFont?: string;
}

interface IExtendedGlitchChar extends IGlitchChar {
    useGlitchFont?: boolean;
}

const GlitchChar = memo(({ glitchChar, useGlitchFont, baseStyle, glitchFont, glitchMode }: { glitchChar: string; useGlitchFont: boolean; baseStyle: React.CSSProperties; glitchFont?: string; glitchMode: 'chars' | 'font'; }) => {
    const shouldUseGlitchFont = glitchMode === 'font' && useGlitchFont && glitchFont;
    const charStyle = shouldUseGlitchFont
        ? { ...baseStyle, fontFamily: glitchFont }
        : baseStyle;

    return (
        <span style={charStyle} className={shouldUseGlitchFont ? 'text_color_vex' : ''}>
            {glitchChar}
        </span>
    );
});
GlitchChar.displayName = 'GlitchChar';

const GlitchText = memo(function GlitchText({ text, glitchChars = DEFAULT_GLITCH_CHARS, glitchProbability = 0.02, glitchDuration = 150, glitchInterval = 50, className = '', langage = '', size, glitchMode = 'chars', primaryFont, glitchFont }: IExtendedGlitchTextProps) {
    const [glitchState, setGlitchState] = useState<IExtendedGlitchChar[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isVisibleRef = useRef(true);

    const optimizedSettings = useOptimizedGlitchSettings(glitchProbability, glitchInterval, glitchDuration);

    const memoizedGlitchChars = useMemo(() => glitchChars, [glitchChars]);

    const initializeGlitchState = useCallback(() => {
        return String(text).split('').map((char: string, index: number) => ({
            index,
            originalChar: char,
            isGlitching: false,
            glitchChar: char,
            useGlitchFont: false,
            nextGlitchTime: Date.now() + Math.random() * 2000
        }))
    }, [text]);

    const getRandomGlitchChar = useCallback(() => {
        return memoizedGlitchChars[Math.floor(Math.random() * memoizedGlitchChars.length)];
    }, [memoizedGlitchChars]);

    useEffect(() => {
        setGlitchState(initializeGlitchState());
    }, [initializeGlitchState]);

    useEffect(() => {
        if (optimizedSettings.glitchProbability <= 0) return;

        const updateGlitchState = () => {
            if (!isVisibleRef.current) return;

            const now = Date.now();

            setGlitchState(prevState => {
                let hasChanges = false;
                const newState = prevState.map(charState => {
                    if (charState.isGlitching) {
                        if (now >= charState.nextGlitchTime) {
                            hasChanges = true;
                            return {
                                ...charState,
                                isGlitching: false,
                                glitchChar: charState.originalChar,
                                useGlitchFont: false,
                                nextGlitchTime: now + Math.random() * 3000 + 1000
                            };
                        }

                        if (glitchMode === 'font') {
                            return {
                                ...charState,
                                glitchChar: charState.originalChar,
                                useGlitchFont: true
                            };
                        } else {
                            hasChanges = true;
                            return {
                                ...charState,
                                glitchChar: getRandomGlitchChar(),
                                useGlitchFont: false
                            };
                        }
                    }

                    if (now >= charState.nextGlitchTime && Math.random() < optimizedSettings.glitchProbability) {
                        if (charState.originalChar !== ' ' && charState.originalChar !== '\t') {
                            hasChanges = true;
                            return {
                                ...charState,
                                isGlitching: true,
                                glitchChar: glitchMode === 'font' ? charState.originalChar : getRandomGlitchChar(),
                                useGlitchFont: glitchMode === 'font',
                                nextGlitchTime: now + optimizedSettings.glitchDuration
                            };
                        }
                    }
                    return charState;
                });

                return hasChanges ? newState : prevState;
            });
        };

        intervalRef.current = setInterval(updateGlitchState, optimizedSettings.glitchInterval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [optimizedSettings, getRandomGlitchChar, glitchMode]);

    const baseStyle = useMemo(() => ({
        ...(langage === 'vex' ? { fontFamily: 'Vex' } : primaryFont ? { fontFamily: primaryFont } : {}),
        ...(size ? { fontSize: typeof size === 'number' ? `${size}px` : size } : {}),
        willChange: 'contents',
        transform: 'translate3d(0,0,0)'
    }), [langage, primaryFont, size]);

    const hasGlitching = useMemo(() =>
        glitchState.some(c => c.isGlitching),
        [glitchState]
    );

    const renderedContent = useMemo(() => {
        return glitchState.map((charState, index) => (
            <GlitchChar key={index} glitchChar={charState.glitchChar} useGlitchFont={charState.useGlitchFont || false} baseStyle={baseStyle} glitchFont={glitchFont} glitchMode={glitchMode} />
        ));
    }, [glitchState, baseStyle, glitchFont, glitchMode]);

    return (
        <span className={`${className} ${hasGlitching ? 'animate-pulse' : ''}`} style={{ willChange: hasGlitching ? 'contents' : 'auto', transform: 'translate3d(0,0,0)' }}>
            {renderedContent}
        </span>
    );
});

export default GlitchText;

export function useGlitchRecruitmentSteps(originalSteps: Array<{ text: string; duration: number }>) {
    return useMemo(() =>
        originalSteps.map(step => ({
            ...step,
            glitchText: (
                <GlitchText text={step.text} glitchProbability={0.015} glitchDuration={200} glitchInterval={20} />
            )
        })),
        [originalSteps]
    )
}