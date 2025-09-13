'use client'

import { useState, useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import axios from 'axios'
import { IAgent } from '@/types/agent'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const useBungieData = () => {
    const [bungieId, setBungieId] = useState<string | null>(null)
    const [playerData, setPlayerData] = useState<IAgent | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    const { isAuthenticated } = useUserStore()

    useEffect(() => {
        const fetchBungieData = async () => {
            if (!isAuthenticated) {
                setError('Non authentifié')
                return
            }
            
            try {
                setIsLoading(true)
                setError(null)

                const tempToken = sessionStorage.getItem('temp_auth_token')

                if (!tempToken) {
                    setError('Pas de token d\'authentification')
                    setIsLoading(false)
                    return
                }

                const response = await axios.post(`${API_BASE_URL}/api/identity/verify`,
                    { token: tempToken },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true'
                        }
                    }
                )

                const { success, data } = response.data

                if (success && data.valid && data.player) {
                    // Récupérer le Bungie ID directement depuis la réponse
                    setBungieId(data.player.bungieId)
                    setPlayerData(data.player)
                } else {
                    setError('Données Bungie non disponibles')
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données Bungie:', error)
                setError('Erreur lors de la récupération des données')
            } finally {
                setIsLoading(false)
            }
        }

        if (isAuthenticated) {
            fetchBungieData()
        }
    }, [isAuthenticated])

    return { bungieId, playerData, isLoading, error }
}
