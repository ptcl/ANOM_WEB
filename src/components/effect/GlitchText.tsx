'use client'
import { DEFAULT_GLITCH_CHARS, IGlitchChar, IGlitchTextProps } from '@/types/effect'
import { useState, useEffect, useMemo, useCallback } from 'react'

interface IExtendedGlitchTextProps extends IGlitchTextProps {
    glitchMode?: 'chars' | 'font';
    primaryFont?: string;
    glitchFont?: string;
}

interface IExtendedGlitchChar extends IGlitchChar {
    useGlitchFont?: boolean;
}

export default function GlitchText({ text, glitchChars = DEFAULT_GLITCH_CHARS, glitchProbability = 0.02, glitchDuration = 150, glitchInterval = 50, className = '', langage = '', size, glitchMode = 'chars', primaryFont, glitchFont }: IExtendedGlitchTextProps) {
    const [glitchState, setGlitchState] = useState<IExtendedGlitchChar[]>([])

    const initializeGlitchState = useCallback(() => {
        return String(text).split('').map((char: string, index: number) => ({
            index,
            originalChar: char,
            isGlitching: false,
            glitchChar: char,
            useGlitchFont: false,
            nextGlitchTime: Date.now() + Math.random() * 2000
        }))
    }, [text])

    useEffect(() => {
        setGlitchState(initializeGlitchState())
    }, [initializeGlitchState])

    const getRandomGlitchChar = useCallback(() => {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)]
    }, [glitchChars])

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now()

            setGlitchState(prevState =>
                prevState.map(charState => {
                    if (charState.isGlitching) {
                        if (now >= charState.nextGlitchTime) {
                            return {
                                ...charState,
                                isGlitching: false,
                                glitchChar: charState.originalChar,
                                useGlitchFont: false,
                                nextGlitchTime: now + Math.random() * 3000 + 1000
                            }
                        }

                        if (glitchMode === 'font') {
                            return {
                                ...charState,
                                glitchChar: charState.originalChar,
                                useGlitchFont: true
                            }
                        } else {
                            return {
                                ...charState,
                                glitchChar: getRandomGlitchChar(),
                                useGlitchFont: false
                            }
                        }
                    }

                    if (now >= charState.nextGlitchTime && Math.random() < glitchProbability) {
                        if (charState.originalChar !== ' ' && charState.originalChar !== '\t') {
                            return {
                                ...charState,
                                isGlitching: true,
                                glitchChar: glitchMode === 'font' ? charState.originalChar : getRandomGlitchChar(),
                                useGlitchFont: glitchMode === 'font',
                                nextGlitchTime: now + glitchDuration
                            }
                        }
                    }
                    return charState
                })
            )
        }, glitchInterval)

        return () => clearInterval(interval)
    }, [glitchProbability, glitchDuration, glitchInterval, getRandomGlitchChar, glitchMode])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const baseStyle = {
        ...(langage === 'vex' ? { fontFamily: 'Vex' } : primaryFont ? { fontFamily: primaryFont } : {}),
        ...(size ? { fontSize: typeof size === 'number' ? `${size}px` : size } : {})
    }

    const renderedContent = useMemo(() => {
        return glitchState.map((charState, index) => {
            const shouldUseGlitchFont = glitchMode === 'font' && charState.useGlitchFont && glitchFont

            const charStyle = shouldUseGlitchFont
                ? { ...baseStyle, fontFamily: glitchFont }
                : baseStyle

            return (
                <span key={index} style={charStyle} className={shouldUseGlitchFont ? 'text_color_vex' : ''}>
                    {charState.glitchChar}
                </span>
            )
        })
    }, [glitchState, baseStyle, glitchFont, glitchMode])

    return (
        <span className={`${className} ${glitchState.some(c => c.isGlitching) ? 'animate-pulse' : ''}`}>
            {renderedContent}
        </span>
    )
}

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