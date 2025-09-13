'use client'
import { useState, useEffect, useMemo } from 'react'

interface ProgressBarProps {
    progress?: number
    duration?: number
    width?: number
    filledChar?: string
    emptyChar?: string
    showPercentage?: boolean
    autoStart?: boolean
    onComplete?: () => void
    className?: string
    glitchEffect?: boolean
}

export default function ProgressBar({ progress, duration = 3000, width = 10, filledChar = '█', emptyChar = '░', showPercentage = true, autoStart = true, onComplete, className = '', glitchEffect = false }: ProgressBarProps) {
    const [currentProgress, setCurrentProgress] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [glitchFrames, setGlitchFrames] = useState<number[]>([])

    useEffect(() => {
        if (progress !== undefined) {
            // Mode progression fixe
            setCurrentProgress(progress)
            return
        }

        if (!autoStart) return

        setIsAnimating(true)
        const startTime = Date.now()
        const targetProgress = 100

        const animate = () => {
            const elapsed = Date.now() - startTime
            const progressRatio = Math.min(elapsed / duration, 1)

            // Courbe d'animation non-linéaire pour plus de réalisme
            const easeProgress = progressRatio < 0.5
                ? 2 * progressRatio * progressRatio
                : 1 - Math.pow(-2 * progressRatio + 2, 3) / 2

            const newProgress = Math.round(easeProgress * targetProgress)
            setCurrentProgress(newProgress)

            if (progressRatio < 1) {
                requestAnimationFrame(animate)
            } else {
                setIsAnimating(false)
                onComplete?.()
            }
        }

        requestAnimationFrame(animate)
    }, [progress, duration, autoStart, onComplete])

    // Effet de glitch sur certaines positions
    useEffect(() => {
        if (!glitchEffect) return

        const interval = setInterval(() => {
            const numGlitches = Math.floor(Math.random() * 3)
            const positions = Array.from({ length: numGlitches }, () =>
                Math.floor(Math.random() * width)
            )
            setGlitchFrames(positions)

            setTimeout(() => setGlitchFrames([]), 150)
        }, 400 + Math.random() * 600)

        return () => clearInterval(interval)
    }, [glitchEffect, width])

    // Génération de la barre visuelle
    const progressBar = useMemo(() => {
        const glitchChars = ['▓', '▒', '░', '▄', '▌', '▐', '▀', '■', '□']
        const filledCount = Math.round((currentProgress / 100) * width)
        return Array.from({ length: width }, (_, index) => {
            const isGlitching = glitchFrames.includes(index)

            if (isGlitching) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)]
            }

            return index < filledCount ? filledChar : emptyChar
        }).join('')
    }, [currentProgress, width, filledChar, emptyChar, glitchFrames])

    const getProgressBarClass = () => {
        let baseClass = className
        if (isAnimating && glitchEffect) {
            baseClass += ' animate-pulse'
        }
        return baseClass
    }

    return (
        <span className={getProgressBarClass()}>
            [{progressBar}]
            {showPercentage && (
                <span className="ml-2">
                    {Math.round(currentProgress)}%
                </span>
            )}
        </span>
    )
}

interface PresetProgressBarProps {
    type?: 'scan' | 'loading' | 'access' | 'download' | 'custom'
    progress?: number
    className?: string
    glitchEffect?: boolean
}

export function PresetProgressBar({
    type = 'loading',
    progress,
    className = '',
    glitchEffect = true
}: PresetProgressBarProps) {
    const presets = {
        scan: { width: 8, progress: 67, chars: { filled: '█', empty: '░' } },
        loading: { width: 10, progress: 45, chars: { filled: '▓', empty: '▒' } },
        access: { width: 8, progress: 25, chars: { filled: '█', empty: '░' } },
        download: { width: 12, progress: 78, chars: { filled: '■', empty: '□' } },
        custom: { width: 10, progress: progress || 50, chars: { filled: '█', empty: '░' } }
    }

    const config = presets[type]

    return (
        <ProgressBar progress={progress || config.progress} width={config.width} filledChar={config.chars.filled} emptyChar={config.chars.empty} showPercentage={true} glitchEffect={glitchEffect} className={className} autoStart={false} />
    )
}