// src/app/[locale]/identity/bungie/callback/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAgentStore } from '@/store/agentStore'
import Container from '@/components/commun/container'
import ImageLueur from '@/components/commun/ImageLueur'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import ProgressBar from '@/components/commun/ProgressBar'
import ComponentSvg from '@/components/svg/ComponentSvg'
import GlitchText from '@/components/effect/GlitchText'

type AuthStatus = 'loading' | 'success' | 'error'

export default function BungieCallbackPage() {
    const [status, setStatus] = useState<AuthStatus>('loading')
    const [message, setMessage] = useState('')
    const [username, setUsername] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [successProgress, setSuccessProgress] = useState(0)

    const router = useRouter()
    const t = useTranslations()
    const { fetchAgent } = useAgentStore()

    useEffect(() => {
        const timer = setInterval(() => {
            setLoadingProgress((p) => (p < 90 ? p + Math.random() * 10 : p))
        }, 150)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const params = new URLSearchParams(window.location.search)
                const token = params.get('token')
                const success = params.get('success')

                if (!success || !token) {
                    throw new Error('Token manquant ou invalide')
                }

                // ✅ Stocke le token en localStorage
                localStorage.setItem('protocol_token', token)

                // ✅ Met à jour ton message et récupère le profil
                setMessage(t('auth.verifying'))
                await fetchAgent()

                const currentAgent = useAgentStore.getState().agent
                if (!currentAgent) throw new Error('Profil agent introuvable')

                if (currentAgent.protocol?.hasSeenRecruitment === false) {
                    const redirectUrl = '/recruitment'
                    setTimeout(() => router.push(redirectUrl), 1500)
                }

                setUsername(currentAgent.protocol?.agentName || 'ANOM')
                setStatus('success')
                setMessage(t('auth.success'))
                setLoadingProgress(100)

                // ✅ Redirection après succès
                const redirectUrl = sessionStorage.getItem('bungie_auth_redirect') || '/desktop'
                sessionStorage.removeItem('bungie_auth_redirect')

                setTimeout(() => router.push(redirectUrl), 1500)

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error('❌ Callback error:', err)
                setStatus('error')
                setErrorMessage(err.message || 'Erreur inconnue')

                setTimeout(() => router.push('/'), 3000)
            }
        }

        verifyAuth()
    }, [router, fetchAgent, t])
    return (
        <Container bgDefault>
            <ImageLueur showGlow={false} />

            {(status === 'loading' || status === 'success') && (
                <div className="text-center flex flex-col items-center justify-center">
                    <div className="w-64 h-64 mb-6 mx-auto relative">
                        <Image
                            src="/svg/anom_icon.svg"
                            alt="Anom Icon"
                            fill
                            className={`object-contain ${status === 'loading' ? 'opacity-50' : ''}`}
                        />
                    </div>

                    {status === 'loading' ? (
                        <GlitchText
                            text={t('auth.processing')}
                            glitchMode="chars"
                            className="inline-block"
                        />
                    ) : (
                        <p className="text-xl max-w-50 md:text-4xl md:max-w-xl mb-5 uppercase">
                            {t('auth.welcomeback')}{' '}
                            <GlitchText
                                text={username}
                                glitchMode="font"
                                glitchFont="Vex"
                                className="inline-block"
                            />
                        </p>
                    )}

                    <div className="w-full max-w-md mb-4 flex justify-center">
                        <ProgressBar
                            progress={status === 'loading' ? loadingProgress : successProgress}
                            fillColor="bg-[var(--anom)]"
                            backgroundColor="bg-gray-200"
                            showPercentage={false}
                            animated
                            label={status === 'loading' ? 'Authentification en cours...' : 'Connexion établie'}
                            className="mb-2 max-w-[300px]"
                        />
                    </div>

                    <p className="text-sm text-gray-600">{message}</p>
                </div>
            )}

            {status === 'error' && (
                <div className="text-center flex flex-col items-center justify-center">
                    <ComponentSvg
                        color="var(--danger)"
                        width={128}
                        height={128}
                        variant="anomOff"
                        className="mb-4"
                    />
                    <h2 className="text-xl md:text-3xl max-w-xs mb-2 text-[var(--danger)]">
                        {t('auth.error')}
                    </h2>
                    <p className="text-xs text-gray-600">{errorMessage}</p>
                    <p className="text-xs text-gray-700">{t('auth.redirecting')}</p>
                </div>
            )}
        </Container>
    )
}