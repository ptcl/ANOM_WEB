'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

interface GlitchTextProps {
    text: string
    glitchChars?: string[]
    glitchProbability?: number
    glitchDuration?: number
    glitchInterval?: number
    className?: string
}

interface GlitchChar {
    index: number
    originalChar: string
    isGlitching: boolean
    glitchChar: string
    nextGlitchTime: number
}

const DEFAULT_GLITCH_CHARS = [
    '█', '▓', '▒', '░', '▄', '▌', '▐', '▀', '■', '□', '▪', '▫',
    '◆', '◇', '◈', '◉', '◎', '●', '○', '◦', '⬛', '⬜', '◾', '◽',
    '▲', '▼', '◀', '▶', '◤', '◥', '◣', '◢', '╱', '╲', '╳', '╬',
    '@', '#', '$', '%', '&', '*', '+', '=', '~', '^', '<', '>',
    '0', '1', 'X', 'Y', 'Z', 'Ø', 'Ξ', 'Δ', 'Λ', 'Ω', 'Φ', 'Ψ'
]

export default function GlitchText({
    text,
    glitchChars = DEFAULT_GLITCH_CHARS,
    glitchProbability = 0.02, // 2% de chance par caractère
    glitchDuration = 150, // Durée du glitch en ms
    glitchInterval = 50, // Intervalle de vérification en ms
    className = ''
}: GlitchTextProps) {
    const [glitchState, setGlitchState] = useState<GlitchChar[]>([])

    // Initialise l'état des caractères
    const initializeGlitchState = useCallback(() => {
        return text.split('').map((char, index) => ({
            index,
            originalChar: char,
            isGlitching: false,
            glitchChar: char,
            nextGlitchTime: Date.now() + Math.random() * 2000 // Délai initial aléatoire
        }))
    }, [text])

    // Initialise l'état au montage et quand le texte change
    useEffect(() => {
        setGlitchState(initializeGlitchState())
    }, [initializeGlitchState])

    // Choisit un caractère de glitch aléatoire
    const getRandomGlitchChar = useCallback(() => {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)]
    }, [glitchChars])

    // Effet principal de glitch
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now()

            setGlitchState(prevState =>
                prevState.map(charState => {
                    // Si le caractère est en train de glitch, vérifie s'il faut l'arrêter
                    if (charState.isGlitching) {
                        if (now >= charState.nextGlitchTime) {
                            return {
                                ...charState,
                                isGlitching: false,
                                glitchChar: charState.originalChar,
                                nextGlitchTime: now + Math.random() * 3000 + 1000 // Prochain glitch dans 1-4s
                            }
                        }
                        // Continue le glitch avec un nouveau caractère aléatoire
                        return {
                            ...charState,
                            glitchChar: getRandomGlitchChar()
                        }
                    }

                    // Si le caractère n'est pas en glitch, vérifie s'il faut commencer
                    if (now >= charState.nextGlitchTime && Math.random() < glitchProbability) {
                        // Ne glitch que les caractères visibles (pas les espaces)
                        if (charState.originalChar !== ' ' && charState.originalChar !== '\t') {
                            return {
                                ...charState,
                                isGlitching: true,
                                glitchChar: getRandomGlitchChar(),
                                nextGlitchTime: now + glitchDuration
                            }
                        }
                    }

                    return charState
                })
            )
        }, glitchInterval)

        return () => clearInterval(interval)
    }, [glitchProbability, glitchDuration, glitchInterval, getRandomGlitchChar])

    // Rendu du texte avec glitch
    const renderedText = useMemo(() => {
        return glitchState.map(charState => charState.glitchChar).join('')
    }, [glitchState])

    return (
        <span className={`${className} ${glitchState.some(c => c.isGlitching) ? 'animate-pulse' : ''}`}>
            {renderedText}
        </span>
    )
}

// Hook personnalisé pour utiliser GlitchText avec les recruitmentSteps
export function useGlitchRecruitmentSteps(originalSteps: Array<{ text: string; duration: number }>) {
    return useMemo(() =>
        originalSteps.map(step => ({
            ...step,
            glitchText: (
                <GlitchText
                    text={step.text}
                    glitchProbability={0.015}
                    glitchDuration={200}
                    glitchInterval={20}
                />
            )
        })),
        [originalSteps]
    )
}