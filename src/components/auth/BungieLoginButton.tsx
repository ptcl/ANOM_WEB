'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export const BungieLoginButton = () => {
    const [isConnecting, setIsConnecting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const t = useTranslations()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3031'

    const handleLogin = async () => {
        try {
            setIsConnecting(true)
            setError(null)

            // ✅ Utilisation correcte de fetch avec template literal
            const res = await fetch(`${apiUrl}/api/identity/bungie/login`, {
                credentials: 'include'
            })

            const data = await res.json()

            if (!data.success) throw new Error(data.message)

            // ✅ Sauvegarde l'état OAuth
            localStorage.setItem('bungie_auth_state', data.data.state)

            // ✅ Redirige vers Bungie
            window.location.href = data.data.authUrl

        } catch (err) {
            console.error('❌ Erreur login Bungie:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
            setIsConnecting(false)
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <Button
                onClick={handleLogin}
                disabled={isConnecting}
                className='text-[var(--white-1)] text-2xl cursor-pointer button__style__anom rounded-none py-6 px-6 w-full'
            >
                {isConnecting ? (
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Connexion...</span>
                    </div>
                ) : (
                    <span>{t('commun.buttons.bungie')}</span>
                )}
            </Button>

            {error && (
                <div className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-md border border-red-200 max-w-md w-full">
                    <div className="flex items-start justify-between">
                        <span className="flex-1">{error}</span>
                        <button
                            onClick={() => setError(null)}
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