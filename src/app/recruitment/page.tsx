'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'
import { useAuth } from '@/hooks/useAuth'
import GlitchText from '@/components/effect/GlitchText'
import TypingEffect, { PresetTypingEffect } from '@/components/effect/TypingEffect'
import { PresetProgressBar } from '@/components/effect/ProgressBar'
import WindowContainerStatic from '@/components/desktop/WindowContainerStatic'
import ComponentSvg from '@/components/svg/ComponentSvg'

interface Step {
    id: string // Ajout d'un ID unique pour éviter les doublons
    text: string
    typingPreset: 'terminal' | 'glitch' | 'human' | 'fast'
    useGlitch: boolean
    showProgress: boolean
    progressType?: 'scan' | 'access'
    duration?: number
}

export default function RecruitmentPage() {
    const router = useRouter()
    const { isLoading } = useAuth()
    const { agent, updateAgentProfile } = useUserStore()

    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [completedSteps, setCompletedSteps] = useState<Step[]>([])
    const [progress, setProgress] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isTypingComplete, setIsTypingComplete] = useState(false) // Pour savoir si le typing est fini

    // Redirection si déjà vu le recrutement
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

    const recruitmentSteps = useMemo<Step[]>(() => [
        {
            id: 'step-1',
            text: "Protocol OS > Connexion non-identifiée détectée...",
            typingPreset: 'terminal',
            useGlitch: false,
            showProgress: false
        },
        {
            id: 'step-2',
            text: "Protocol OS > Scan en cours...",
            typingPreset: 'terminal',
            useGlitch: false,
            showProgress: true,
            progressType: 'scan'
        },
        {
            id: 'step-3',
            text: "Protocol OS > Profil utilisateur : INCONNU",
            typingPreset: 'glitch',
            useGlitch: true,
            showProgress: false,
            duration: 2000
        },
        {
            id: 'step-4',
            text: "Protocol OS > Autorisation temporaire accordée...",
            typingPreset: 'terminal',
            useGlitch: false,
            showProgress: false
        },
        {
            id: 'step-5',
            text: "",
            typingPreset: 'terminal',
            useGlitch: false,
            showProgress: false,
            duration: 300
        },
        {
            id: 'step-6',
            text: "Alex > Qui êtes-vous ?",
            typingPreset: 'human',
            useGlitch: false,
            showProgress: false
        },
        {
            id: 'step-7',
            text: "Alex > Comment avez-vous trouvé nos systèmes ?",
            typingPreset: 'human',
            useGlitch: false,
            showProgress: false
        },
        {
            id: 'step-8',
            text: "Lucca > Alex, ce pourrait être un candidat potentiel...",
            typingPreset: 'human',
            useGlitch: false,
            showProgress: false
        },
        {
            id: 'step-9',
            text: "Alex > Évaluons ses capacités d'abord.",
            typingPreset: 'human',
            useGlitch: false,
            showProgress: false
        },
        {
            id: 'step-10',
            text: "",
            typingPreset: 'terminal',
            useGlitch: false,
            showProgress: false,
            duration: 500
        },
        {
            id: 'step-11',
            text: "Protocol OS > Évaluation en cours...",
            typingPreset: 'terminal',
            useGlitch: false,
            showProgress: true,
            progressType: 'scan'
        },
        {
            id: 'step-12',
            text: "Protocol OS > Évaluation terminée",
            typingPreset: 'fast',
            useGlitch: false,
            showProgress: false
        },
        {
            id: 'step-13',
            text: "Protocol OS > Candidat approuvé pour recrutement niveau 1",
            typingPreset: 'terminal',
            useGlitch: false,
            showProgress: false
        },
        {
            id: 'step-14',
            text: `Protocol OS > Bienvenue dans Protocol, Agent ${agentName}`,
            typingPreset: 'terminal',
            useGlitch: true,
            showProgress: false,
            duration: 2000
        },
        {
            id: 'step-15',
            text: "Protocol OS > Accès en cours...",
            typingPreset: 'terminal',
            useGlitch: false,
            showProgress: true,
            progressType: 'access'
        }
    ], [agentName])

    const nextStep = useCallback(() => {
        if (isProcessing || currentStepIndex >= recruitmentSteps.length) return

        setIsProcessing(true)

        // Ajouter l'étape actuelle aux complétées
        const currentStep = recruitmentSteps[currentStepIndex]
        setCompletedSteps(prev => {
            // Vérifier si l'étape n'est pas déjà dans les complétées
            if (prev.find(step => step.id === currentStep.id)) {
                return prev
            }
            return [...prev, currentStep]
        })

        // Passer à l'étape suivante après un court délai
        setTimeout(() => {
            setCurrentStepIndex(prev => prev + 1)
            setProgress(0)
            setIsTypingComplete(false) // Reset pour la nouvelle étape
            setIsProcessing(false)
        }, 100)
    }, [currentStepIndex, recruitmentSteps, isProcessing])

    // Fonction pour gérer la fin du typing
    const handleTypingComplete = useCallback(() => {
        const currentStep = recruitmentSteps[currentStepIndex]

        if (currentStep.showProgress) {
            // Si l'étape a une progress bar, marquer le typing comme terminé
            setIsTypingComplete(true)
        } else {
            // Sinon, passer directement à l'étape suivante
            nextStep()
        }
    }, [currentStepIndex, recruitmentSteps, nextStep])

    // Gestion des étapes avec glitch ou durée fixe
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

    // Gestion des barres de progression - SEULEMENT après que le typing soit fini
    useEffect(() => {
        if (currentStepIndex >= recruitmentSteps.length || isProcessing) return

        const currentStep = recruitmentSteps[currentStepIndex]

        // Démarrer la progress bar SEULEMENT si le typing est terminé
        if (currentStep.showProgress && isTypingComplete) {
            setProgress(0)

            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        setTimeout(() => nextStep(), 500) // Délai après 100%
                        return 100
                    }
                    return prev + 2
                })
            }, 50)

            return () => clearInterval(interval)
        }
    }, [currentStepIndex, recruitmentSteps, nextStep, isProcessing, isTypingComplete]) // Ajout de isTypingComplete

    // Finalisation du protocole quand toutes les étapes sont terminées
    useEffect(() => {
        if (currentStepIndex < recruitmentSteps.length) return

        const updateUserProtocol = async () => {
            try {
                // ✅ CORRECTION: Utiliser la nouvelle méthode updateAgentProfile
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

                console.log('🔄 Mise à jour du profil agent avec:', protocolUpdates)
                await updateAgentProfile(protocolUpdates)
                console.log('✅ Recrutement terminé avec succès !')

                // Redirection vers le desktop après un délai
                setTimeout(() => {
                    router.push('/desktop')
                }, 2000)
            } catch (error) {
                console.error('❌ Erreur lors de la mise à jour du recrutement:', error)
                // En cas d'erreur, rediriger quand même vers le desktop
                setTimeout(() => {
                    router.push('/desktop')
                }, 2000)
            }
        }

        updateUserProtocol()
    }, [currentStepIndex, recruitmentSteps.length, agentName, updateAgentProfile, router])

    // Fonction pour obtenir la couleur du texte
    const getTextColor = (text: string) => {
        if (text.includes('Alex')) return 'text-cyan-400'
        if (text.includes('Lucca')) return 'text-yellow-400'
        return 'text-green-400'
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-8">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                    <TypingEffect
                        text="Initialisation du protocole..."
                        speed={30}
                        showCursor={true}
                        className="text-green-400"
                    />
                </div>
            </div>
        )
    }

    return (
        <>
            <section className='w-full h-screen flex items-center justify-center p-8'>
                <WindowContainerStatic
                    height={500}
                    width={740}
                    title="ANOM"
                    icon={<ComponentSvg variant='cat' color='var(--windows-icon)' height={24} width={24} />}
                >
                    <section className='overflow-auto scroll-smooth max-h-full space-y-1'>
                        {/* Étapes complétées */}
                        {completedSteps.map((step) => (
                            <div key={step.id} className="flex items-start gap-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <GlitchText
                                            text={step.text}
                                            glitchProbability={0.005}
                                            glitchDuration={1}

                                        />
                                        {step.showProgress && (
                                            <PresetProgressBar
                                                type={step.progressType!}
                                                progress={100}
                                                glitchEffect={true}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Étape actuelle */}
                        {currentStepIndex < recruitmentSteps.length && !isProcessing && (
                            <div className="flex items-start gap-2">
                                <span className="text-green-500 mt-1 flex-shrink-0">{'>'}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        {recruitmentSteps[currentStepIndex].useGlitch ? (
                                            <GlitchText
                                                text={recruitmentSteps[currentStepIndex].text}
                                                glitchProbability={0.015}
                                                glitchDuration={200}
                                                className={getTextColor(recruitmentSteps[currentStepIndex].text)}
                                            />
                                        ) : (
                                            <PresetTypingEffect
                                                text={recruitmentSteps[currentStepIndex].text}
                                                preset={recruitmentSteps[currentStepIndex].typingPreset}
                                                className={getTextColor(recruitmentSteps[currentStepIndex].text)}
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
                            </div>
                        )}

                        {/* Animation de finalisation */}
                        {currentStepIndex >= recruitmentSteps.length && (
                            <div className="flex items-center space-x-2 mt-4">
                                <span className="text-green-500">{'>'}</span>
                                <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                                <GlitchText
                                    text="Finalisation des protocoles de sécurité..."
                                    glitchProbability={0.025}
                                />
                            </div>
                        )}
                    </section>
                </WindowContainerStatic>
            </section>
        </>
    )
}