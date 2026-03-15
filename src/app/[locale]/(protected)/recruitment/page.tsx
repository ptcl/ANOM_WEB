'use client'

import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthentication } from '@/hooks/useAuthentication'
import GlitchText from '@/components/effect/GlitchText'
import TypingEffect, { PresetTypingEffect } from '@/components/effect/TypingEffect'
import { PresetProgressBar } from '@/components/effect/TerminalProgressBar'
import WindowContainerStatic from '@/components/desktop/windows/WindowContainerStatic'
import ComponentSvg from '@/components/svg/ComponentSvg'
import recruitmentStepsData from '@/app/content/recruitment/recruitmentSteps.json';
import { useTranslations } from 'next-intl'
import ImageLueur from '@/components/commun/ImageLueur'
import Container from '@/components/commun/container'
import { useAgent } from '@/hooks/use-agent'
import { useAgentStore } from '@/store/agentStore'
interface Step {
    id: string
    text: string
    typingPreset: 'terminal' | 'glitch' | 'human' | 'fast'
    useGlitch: boolean
    showProgress: boolean
    progressType?: 'scan' | 'access'
    progress?: number
    duration?: number
    isSpacing?: boolean
}

export default function RecruitmentPage() {
    const t = useTranslations();
    const router = useRouter()
    const { isLoading } = useAuthentication()
    const { agent, refetch } = useAgent()

    const updateAgent = useAgentStore(state => state.updateAgent)

    const scrollRef = useRef<HTMLDivElement>(null)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [progress, setProgress] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isTypingComplete, setIsTypingComplete] = useState(false)
    const [showSecurityWindow, setShowSecurityWindow] = useState(true)
    const [showAnomWindow, setShowAnomWindow] = useState(true)

    const SECURITY_START_INDEX = 18
    const SECURITY_END_INDEX = 55
    const ANOM_START_INDEX = 55
    const ANOM_END_INDEX = 59

    useEffect(() => {
        if (!isLoading && agent?.protocol?.hasSeenRecruitment === true) {
            router.push('/desktop')
        }
    }, [isLoading, agent?.protocol?.hasSeenRecruitment, router])

    const generateAgentName = useCallback((name: string) => {
        return Math.random() > 0.8
            ? `${name.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 9) + 1}`
            : name
    }, [])

    const agentName = useMemo(() => {
        return agent?.protocol.agentName ? generateAgentName(agent.protocol.agentName) : ''
    }, [agent?.protocol.agentName, generateAgentName])

    const recruitmentSteps = useMemo<Step[]>(
        () =>
            (recruitmentStepsData as Step[]).map(step => ({
                ...step,
                text: step.isSpacing ? "" : t(step.text)
            })),
        [t]
    );

    const nextStep = useCallback(() => {
        if (isProcessing || currentStepIndex >= recruitmentSteps.length) return

        setIsProcessing(true)

        setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1)
            setProgress(0)
            setIsTypingComplete(false)
            setIsProcessing(false)
        }, 100)
    }, [currentStepIndex, recruitmentSteps, isProcessing])

    const handleTypingComplete = useCallback(() => {
        const currentStep = recruitmentSteps[currentStepIndex]

        if (currentStep.showProgress) {
            setIsTypingComplete(true)
        } else {
            nextStep()
        }
    }, [currentStepIndex, recruitmentSteps, nextStep])

    useEffect(() => {
        if (currentStepIndex >= SECURITY_START_INDEX && currentStepIndex < SECURITY_END_INDEX) {
            setShowSecurityWindow(true)
        } else {
            setShowSecurityWindow(false)
        }
    }, [currentStepIndex])

    useEffect(() => {
        if (currentStepIndex >= ANOM_START_INDEX && currentStepIndex < ANOM_END_INDEX) {
            setShowAnomWindow(true)
        } else {
            setShowAnomWindow(false)
        }
    }, [currentStepIndex])

    useEffect(() => {
        if (currentStepIndex >= recruitmentSteps.length || isProcessing) return

        const currentStep = recruitmentSteps[currentStepIndex]

        if (currentStep.useGlitch || currentStep.duration) {
            const timer = setTimeout(() => {
                nextStep()
            }, currentStep.duration || 2000)

            return () => clearTimeout(timer)
        }
    }, [currentStepIndex, recruitmentSteps, nextStep, isProcessing])

    useEffect(() => {
        if (currentStepIndex >= recruitmentSteps.length || isProcessing) return

        const currentStep = recruitmentSteps[currentStepIndex]

        if (currentStep.showProgress && isTypingComplete) {
            setProgress(0)

            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        setTimeout(() => nextStep(), 500)
                        return 100
                    }
                    return prev + 2
                })
            }, 50)

            return () => clearInterval(interval)
        }
    }, [currentStepIndex, recruitmentSteps, nextStep, isProcessing, isTypingComplete])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [currentStepIndex])

    useEffect(() => {
        if (currentStepIndex < recruitmentSteps.length) return

        const updateUserProtocol = async () => {
            try {
                const protocolUpdates = {
                    protocol: {
                        hasSeenRecruitment: true,
                        customName: agentName,
                        species: agentName.includes('-') ? 'EXO' as const : 'HUMAN' as const,
                        settings: {
                            notifications: true,
                            publicProfile: false,
                            protocolOSTheme: 'DEFAULT' as const,
                            protocolSounds: true
                        }
                    }
                }

                await updateAgent(protocolUpdates)
                setTimeout(() => {
                    router.push('/desktop')
                }, 2000)
            } catch {
                // Redirect to desktop even on error
                setTimeout(() => {
                    router.push('/desktop')
                }, 2000)
            }
        }

        updateUserProtocol()
    }, [currentStepIndex, recruitmentSteps.length, agentName, updateAgent, router])

    const getTextColor = (text: string) => {
        if (text.includes('##-1')) return 'text-cyan-400'
        if (text.includes('##-7')) return 'text-yellow-400'
        return 'text-white'
    }
    const getTabText = (text: string) => {
        return text.includes('[tab]') ? 'ml-4' : ''
    }

    const cleanText = (text: string) => {
        return text.replace(/\[tab\]/g, '')
    }

    const renderCompletedStep = (step: Step, extraClassName = '') => (
        <div key={step.id} className={`flex items-start gap-0 transition-opacity duration-300 text-xs md:text-sm ${step.isSpacing ? 'mb-5' : ''}`}>
            {step.text ? (
                <div className="flex items-center gap-2 flex-wrap">
                    {step.useGlitch ? (
                        <GlitchText text={cleanText(step.text)} glitchProbability={0.003} glitchDuration={200} glitchMode='font' glitchFont='Vex' className={`${getTextColor(step.text)} ${getTabText(step.text)} leading-relaxed ${extraClassName}`} />
                    ) : (
                        <span className={`${getTextColor(step.text)} ${getTabText(step.text)} ${extraClassName}`}>
                            {cleanText(step.text)}
                        </span>
                    )}
                    {step.showProgress && (
                        <PresetProgressBar type={step.progressType!} progress={100} glitchEffect={false} />
                    )}
                </div>
            ) : null}
        </div>
    )

    const renderActiveStep = (extraClassName = '') => (
        <div className="flex items-start gap-2 rounded">
            <div className="flex items-center gap-2 flex-wrap">
                {recruitmentSteps[currentStepIndex].useGlitch ? (
                    <GlitchText
                        text={recruitmentSteps[currentStepIndex].text}
                        glitchProbability={0.015}
                        glitchDuration={200}
                        className={`${getTextColor(recruitmentSteps[currentStepIndex].text)} ${extraClassName}`}
                    />
                ) : (
                    <PresetTypingEffect
                        text={recruitmentSteps[currentStepIndex].text}
                        preset={recruitmentSteps[currentStepIndex].typingPreset}
                        className={`${getTextColor(recruitmentSteps[currentStepIndex].text)} ${extraClassName}`}
                        onComplete={handleTypingComplete}
                    />
                )}

                {recruitmentSteps[currentStepIndex].showProgress && isTypingComplete && (
                    <PresetProgressBar
                        type={recruitmentSteps[currentStepIndex].progressType!}
                        progress={progress}
                        glitchEffect={true}
                    />
                )}
            </div>
        </div>
    )

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-8">
                <div className="flex items-center space-x-2">
                    <TypingEffect text={(t('recruitment.processing'))} speed={30} showCursor={true} />
                </div>
            </div>
        )
    }

    return (
        <>
            <Container textAlign='left' className='relative' bgDefault>
                <ImageLueur />
                {showSecurityWindow && (
                    <WindowContainerStatic responsiveMode='fullscreen' mobile windowContainerId={2} absolute zIndex={2} top={120} left={500} height={400} width={600} title="PROTOCOLE SÉCURITÉ" icon={<ComponentSvg color='var(--windows-icon)' height={24} width={24} />}>
                        <div className="p-4 text-white space-y-1">
                            {recruitmentSteps.slice(SECURITY_START_INDEX, currentStepIndex).filter((_, idx) => SECURITY_START_INDEX + idx < SECURITY_END_INDEX).map((step) => renderCompletedStep(step))}

                            {currentStepIndex < SECURITY_END_INDEX && currentStepIndex >= SECURITY_START_INDEX && !isProcessing && currentStepIndex < recruitmentSteps.length && renderActiveStep()}
                        </div>
                    </WindowContainerStatic>
                )}

                {showAnomWindow && (
                    <WindowContainerStatic responsiveMode='fullscreen' mobile windowContainerId={3} absolute zIndex={5} top={350} left={750} height={250} width={400} title={<GlitchText text="AN0M" glitchProbability={2} glitchDuration={200} glitchMode='font' glitchFont='Vex' primaryFont='IBM' />} icon={<ComponentSvg variant='cat' color='var(--windows-icon)' height={24} width={24} />}>
                        <div className="text-[var(--danger)] space-y-1">
                            {recruitmentSteps.slice(ANOM_START_INDEX, currentStepIndex).filter((_, idx) => ANOM_START_INDEX + idx < ANOM_END_INDEX).map((step) => renderCompletedStep(step, 'text__danger'))}

                            {currentStepIndex < ANOM_END_INDEX && currentStepIndex >= ANOM_START_INDEX && !isProcessing && currentStepIndex < recruitmentSteps.length && renderActiveStep('text__danger')}
                        </div>
                    </WindowContainerStatic>
                )}

                <WindowContainerStatic responsiveMode='fixed' windowContainerId={1} height={500} width={740} title="ANOM" icon={<ComponentSvg variant='cat' color='var(--windows-icon)' height={24} width={24} />}>
                    <section ref={scrollRef} className='overflow-auto scroll-smooth max-h-full space-y-.5 p-2'>
                        {/* Toutes les étapes jusqu'à l'index actuel, sauf celles de sécurité */}
                        {recruitmentSteps.slice(0, currentStepIndex).map((step, idx) => (
                            (idx < SECURITY_START_INDEX || idx >= SECURITY_END_INDEX) && !(idx >= ANOM_START_INDEX && idx < ANOM_END_INDEX) && renderCompletedStep(step)
                        ))}

                        {/* Étape actuelle en cours de typing, hors sécurité */}
                        {currentStepIndex < recruitmentSteps.length && !isProcessing && (currentStepIndex < SECURITY_START_INDEX || currentStepIndex >= SECURITY_END_INDEX) && renderActiveStep()}

                        {/* Animation de finalisation */}
                        {currentStepIndex >= recruitmentSteps.length && (
                            <div className="flex items-center space-x-2 mt-4">
                                <GlitchText text={t('recruitment.steps.dialogue.end.1')} glitchProbability={2} glitchMode='font' glitchFont='Vex' />
                            </div>
                        )}
                    </section>
                </WindowContainerStatic>
            </Container>
        </>
    )
}