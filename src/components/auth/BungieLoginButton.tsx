'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async () => {
        try {
            setIsLoading(true)
            setError(null)

            // console.log('🎮 Initiating Bungie login...')

            // 🔧 URL ngrok de ton backend
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
            const loginUrl = `${API_BASE_URL}/api/identity/bungie/login`

            // console.log('🔍 Calling URL:', loginUrl)

            // Appel à ton endpoint /api/identity/bungie/login avec axios
            const response = await axios.get(loginUrl, {
                headers: {
                    // Header requis pour ngrok
                    'ngrok-skip-browser-warning': 'true'
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
                setError(errorMessage)
                console.error('❌ Axios Error:', error.response?.status, error.response?.data)
            } else if (error instanceof Error) {
                setError(error.message)
            } else if (typeof error === 'string') {
                setError(error)
            } else {
                setError('Une erreur est survenue')
            }
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="flex flex-col items-center space-y-4">
            <Button onClick={handleLogin} disabled={isLoading} size={'lg'} className='text-[var(--white_accent1)] bg-[var(--ThemeColorAccent)] hover:bg-[var(--ThemeColorAccent2)] transition-colors cursor-pointer'>
                {isLoading ? (
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
            {error && (
                <div className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-md border border-red-200">
                    {error}
                </div>
            )}

        </div>
    )
}