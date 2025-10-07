/**
 * 🚀 OPTIMISÉ: BungieLoginButton ultra-léger
 * 
 * Optimisations appliquées:
 * - ❌ Pas de requête API au chargement (juste vérification token local)
 * - ❌ Pas de hook useAuth/useMinimalAuth (économie de ressources)
 * - ✅ Détection automatique de la connexion via sessionStorage
 * - ✅ Écoute des changements de token en temps réel
 * - ✅ Gestion d'erreur locale seulement
 * 
 * Résultat: Chargement instantané, 0 requête réseau pour l'affichage
 */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuthentication } from '@/hooks/useAuthentication'
import axios from 'axios'

interface AuthResponse {
    success: boolean
    data: {
        authUrl: string
        state: string
    }
    message: string
}

interface ErrorResponse {
    success: false
    error: string
}

export const BungieLoginButton = () => {
    const [isConnecting, setIsConnecting] = useState(false)
    const [loginError, setLoginError] = useState<string | null>(null)

    // ✅ ULTRA-LÉGER: Hook optimisé pour les pages de login (0 requête API)
    const { isAuthenticated, isLoading: isCheckingAuth } = useAuthentication()

    // État de chargement initial
    if (isCheckingAuth) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            </div>
        )
    }

    // Si déjà connecté, on peut rediriger ou masquer le bouton
    if (isAuthenticated) {
        return (
            <div className="text-center p-4">
                <p className="text-green-600 mb-4">✅ Vous êtes déjà connecté !</p>
                <Button
                    onClick={() => window.location.href = '/desktop'}
                    className="bg-green-600 hover:bg-green-700"
                >
                    Aller au Desktop
                </Button>
            </div>
        )
    }

    const handleLogin = async () => {
        try {
            setIsConnecting(true)
            setLoginError(null)

            // console.log('🎮 Initiating Bungie login...')

            // 🔧 URL ngrok de ton backend
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
            const loginUrl = `${API_BASE_URL}/api/identity/bungie/login`

            // console.log('🔍 Calling URL:', loginUrl)

            // Appel à ton endpoint /api/identity/bungie/login avec axios
            const response = await axios.get(loginUrl, {
                headers: {
                },
            })

            // console.log('🔍 Response status:', response.status)
            // console.log('🔍 Response headers:', response.headers)

            // Avec axios, les données sont déjà parsées en JSON
            const data = response.data as AuthResponse | ErrorResponse

            if (!data.success) {
                const errorMsg = 'error' in data ? data.error : 'Failed to initiate login'
                throw new Error(errorMsg)
            }

            // console.log('✅ Auth URL generated:', data.data.authUrl)

            // Stockage du state pour validation côté callback (optionnel)
            if (data.data.state) {
                localStorage.setItem('bungie_auth_state', data.data.state)
            }

            // Redirection vers Bungie
            window.location.href = data.data.authUrl

        } catch (error: unknown) {
            console.error('❌ Login failed:', error)
            if (axios.isAxiosError(error)) {
                // Gestion spécifique des erreurs axios
                const errorMessage = error.response?.data?.error || error.message
                setLoginError(errorMessage)
                console.error('❌ Axios Error:', error.response?.status, error.response?.data)
            } else if (error instanceof Error) {
                setLoginError(error.message)
            } else if (typeof error === 'string') {
                setLoginError(error)
            } else {
                setLoginError('Une erreur est survenue')
            }
        } finally {
            setIsConnecting(false)
        }
    }

    // Afficher seulement les erreurs de login locales
    const displayError = loginError

    const handleClearError = () => {
        setLoginError(null)
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <Button
                onClick={handleLogin}
                disabled={isConnecting}
                size={'lg'}
                className='text-[var(--white_accent1)] bg-[var(--ThemeColorAccent)] hover:bg-[var(--ThemeColorAccent2)] transition-colors cursor-pointer disabled:opacity-50'
            >
                {isConnecting ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Connexion...</span>
                    </div>
                ) : (
                    <div>
                        <span>Connect to System</span>
                    </div>
                )}
            </Button>

            {displayError && (
                <div className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-md border border-red-200 max-w-md">
                    <div className="flex items-start justify-between">
                        <span className="flex-1">{displayError}</span>
                        <button
                            onClick={handleClearError}
                            className="ml-2 text-red-600 hover:text-red-800 font-bold"
                            aria-label="Fermer l'erreur"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}