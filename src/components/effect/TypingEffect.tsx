'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

interface TypingEffectProps {
    text: string
    speed?: number
    startDelay?: number
    cursor?: string
    showCursor?: boolean
    cursorBlinkSpeed?: number
    onComplete?: () => void
    className?: string
    pauseOnSpaces?: boolean
    randomSpeed?: boolean
    naturalPauses?: boolean
}

export default function TypingEffect({
    text,
    speed = 50,
    startDelay = 0,
    cursor = '_',
    showCursor = true,
    cursorBlinkSpeed = 500,
    onComplete,
    className = '',
    pauseOnSpaces = false,
    randomSpeed = false,
    naturalPauses = true
}: TypingEffectProps) {
    const [displayedText, setDisplayedText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTyping, setIsTyping] = useState(false)
    const [showCursorChar, setShowCursorChar] = useState(true)
    const [isComplete, setIsComplete] = useState(false)

    useEffect(() => {
        if (!showCursor) return

        const interval = setInterval(() => {
            setShowCursorChar(prev => !prev)
        }, cursorBlinkSpeed)

        return () => clearInterval(interval)
    }, [showCursor, cursorBlinkSpeed])

    const getCharacterDelay = useCallback((char: string, index: number) => {
        let delay = speed

        if (randomSpeed) {
            const variation = (Math.random() - 0.5) * 0.6
            delay *= (1 + variation)
        }

        if (naturalPauses) {
            if (['.', '!', '?'].includes(char)) {
                delay *= 3
            } else if ([',', ';', ':'].includes(char)) {
                delay *= 2
            } else if (char === ' ' && pauseOnSpaces) {
                delay *= 1.5
            }
        }

        return Math.max(delay, 10)
    }, [speed, randomSpeed, naturalPauses, pauseOnSpaces])

    useEffect(() => {
        if (currentIndex >= text.length) {
            setIsTyping(false)
            setIsComplete(true)
            onComplete?.()
            return
        }

        const startTyping = () => {
            setIsTyping(true)

            const typeNextCharacter = () => {
                const char = text[currentIndex]
                setDisplayedText(text.substring(0, currentIndex + 1))

                const delay = getCharacterDelay(char, currentIndex)

                setTimeout(() => {
                    setCurrentIndex(prev => prev + 1)
                }, delay)
            }

            typeNextCharacter()
        }

        if (currentIndex === 0 && startDelay > 0) {
            setTimeout(startTyping, startDelay)
        } else {
            startTyping()
        }
    }, [currentIndex, text, getCharacterDelay, onComplete, startDelay])

    const restart = useCallback(() => {
        setDisplayedText('')
        setCurrentIndex(0)
        setIsTyping(false)
        setIsComplete(false)
    }, [])

    const skip = useCallback(() => {
        setDisplayedText(text)
        setCurrentIndex(text.length)
        setIsTyping(false)
        setIsComplete(true)
        onComplete?.()
    }, [text, onComplete])

    const renderedText = useMemo(() => {
        const textToShow = displayedText
        const cursorToShow = showCursor && showCursorChar && (!isComplete || isTyping) ? cursor : ''
        return textToShow + cursorToShow
    }, [displayedText, showCursor, showCursorChar, cursor, isComplete, isTyping])

    return (
        <span
            className={`${className} ${isTyping ? 'typing' : ''}`}
            data-typing={isTyping}
            data-complete={isComplete}
        >
            {renderedText}
        </span>
    )
}

interface PresetTypingEffectProps {
    text: string
    preset?: 'fast' | 'normal' | 'slow' | 'glitch' | 'terminal' | 'human'
    className?: string
    onComplete?: () => void
}

export function PresetTypingEffect({
    text,
    preset = 'normal',
    className = '',
    onComplete
}: PresetTypingEffectProps) {
    const presets = {
        fast: {
            speed: 20,
            cursor: '|',
            randomSpeed: false,
            naturalPauses: false,
            cursorBlinkSpeed: 300
        },
        normal: {
            speed: 50,
            cursor: '_',
            randomSpeed: true,
            naturalPauses: true,
            cursorBlinkSpeed: 500
        },
        slow: {
            speed: 100,
            cursor: '█',
            randomSpeed: true,
            naturalPauses: true,
            pauseOnSpaces: true,
            cursorBlinkSpeed: 600
        },
        glitch: {
            speed: 30,
            cursor: '▌',
            randomSpeed: true,
            naturalPauses: false,
            cursorBlinkSpeed: 200
        },
        terminal: {
            speed: 25,
            cursor: '▋',
            randomSpeed: false,
            naturalPauses: false,
            cursorBlinkSpeed: 800
        },
        human: {
            speed: 80,
            cursor: '|',
            randomSpeed: true,
            naturalPauses: true,
            pauseOnSpaces: true,
            cursorBlinkSpeed: 500
        }
    }

    const config = presets[preset]

    return (
        <TypingEffect text={text} onComplete={onComplete} className={className}{...config} />
    )
}