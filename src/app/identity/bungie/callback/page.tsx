'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/userStore'

// États possibles de l'authentification
type AuthStatus = 'loading' | 'success' | 'error'

export default function BungieCallbackPage() {
    const [status, setStatus] = useState<AuthStatus>('loading')
    const [message, setMessage] = useState('Authentification en cours...')
    const [username, setUsername] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [processed, setProcessed] = useState(false) // ✅ Garde-fou contre les exécutions multiples
    const router = useRouter()

    // ✅ Utiliser les méthodes du store simplifié
    const { initialize } = useUserStore()

    useEffect(() => {
        // ✅ Protection contre les exécutions multiples
        if (processed) return

        let redirectTimer: NodeJS.Timeout | null = null
        let aborted = false

        const processAuth = async () => {
            if (aborted) return
            setProcessed(true) // ✅ Marquer comme traité immédiatement
            try {
                // Récupérer les paramètres de l'URL
                const urlParams = new URLSearchParams(window.location.search)
                const token = urlParams.get('token')
                const error = urlParams.get('error')

                if (error) {
                    setStatus('error')
                    setErrorMessage(`Erreur d'authentification: ${error}`)
                    redirectTimer = setTimeout(() => {
                        if (!aborted) router.push('/')
                    }, 3000)
                    return
                }

                if (!token) {
                    setStatus('error')
                    setErrorMessage('Token manquant dans la réponse')
                    redirectTimer = setTimeout(() => {
                        if (!aborted) router.push('/')
                    }, 3000)
                    return
                }

                // ✅ Vérification basique du format du token
                if (token.length < 10 || !token.includes('.')) {
                    setStatus('error')
                    setErrorMessage('Token invalide reçu')
                    redirectTimer = setTimeout(() => {
                        if (!aborted) router.push('/')
                    }, 3000)
                    return
                }

                console.log('🔑 Token valide reçu dans callback')

                // Stocker le token TEMPORAIREMENT dans sessionStorage
                sessionStorage.setItem('temp_auth_token', token)

                setMessage('Récupération du profil agent...')

                // ✅ Initialiser le store avec le nouveau token
                await initialize()

                // ✅ Petite attente pour s'assurer que le store est bien mis à jour
                await new Promise(resolve => setTimeout(resolve, 200))

                // Vérifier que l'authentification a réussi
                const userState = useUserStore.getState()

                if (!userState.isAuthenticated || !userState.agent) {
                    console.error('❌ État après initialisation:', {
                        isAuthenticated: userState.isAuthenticated,
                        hasAgent: !!userState.agent,
                        error: userState.error
                    })

                    setStatus('error')
                    setErrorMessage(userState.error || 'Échec de récupération du profil agent')
                    redirectTimer = setTimeout(() => {
                        if (!aborted) router.push('/')
                    }, 3000)
                    return
                }

                // ✅ Authentification réussie
                console.log('✅ Authentification réussie:', {
                    agentName: userState.agent.protocol?.agentName,
                    displayName: userState.agent.bungieUser?.displayName,
                    hasSeenRecruitment: userState.agent.protocol?.hasSeenRecruitment,
                    membershipId: userState.agent.bungieUser?.membershipId
                })

                setStatus('success')
                setMessage('Authentification réussie ! Redirection...')

                // Récupérer l'utilisateur pour afficher son nom
                setUsername(userState.agent?.protocol?.agentName || userState.agent?.bungieUser?.displayName || 'Agent')

                // Nettoyer l'URL (pour ne pas exposer le token)
                window.history.replaceState({}, document.title, window.location.pathname)

                // Décider de la redirection en fonction du statut de recrutement
                let redirectUrl = '/desktop'

                // Si l'utilisateur n'a pas encore vu la page de recrutement, le rediriger vers celle-ci
                if (userState.agent?.protocol?.hasSeenRecruitment !== true) {
                    redirectUrl = '/recruitment'
                    console.log('🎯 Redirection vers recruitment (premier accès)')
                } else {
                    // Sinon, utiliser la redirection par défaut ou celle stockée
                    redirectUrl = sessionStorage.getItem('bungie_auth_redirect') || '/desktop'
                    console.log('🎯 Redirection vers:', redirectUrl)
                }

                sessionStorage.removeItem('bungie_auth_redirect')

                // ✅ Redirection immédiate et sécurisée
                redirectTimer = setTimeout(() => {
                    if (!aborted) router.push(redirectUrl)
                }, 1500)

            } catch (error) {
                console.error('❌ Erreur lors du traitement du callback:', error)
                setStatus('error')
                setErrorMessage(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
                redirectTimer = setTimeout(() => {
                    if (!aborted) router.push('/')
                }, 3000)
            }
        }

        processAuth()

        // ✅ Cleanup function pour annuler les timers et prévenir les fuites mémoire
        return () => {
            aborted = true
            if (redirectTimer) {
                clearTimeout(redirectTimer)
            }
        }
    }, [router, initialize, processed]) // ✅ Ajouter processed dans les dépendances

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">

                {/* Loading State */}
                {status === 'loading' && (
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold mb-2">Authentification en cours...</h2>
                        <p className="text-gray-600">{message}</p>
                    </div>
                )}

                {/* Success State */}
                {status === 'success' && (
                    <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-green-800">Connexion réussie !</h2>
                        <p className="text-gray-600 mb-2">Bienvenue, <strong>{username}</strong></p>
                        <p className="text-sm text-gray-500">{message}</p>
                    </div>
                )}

                {/* Error State */}
                {status === 'error' && (
                    <div className="text-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-red-800">Erreur d&apos;authentification</h2>
                        <p className="text-gray-600 mb-4">{errorMessage}</p>
                        <p className="text-sm text-gray-500">Redirection vers l&apos;accueil...</p>
                    </div>
                )}

            </div>
        </div>
    )
}