'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const useBungieId = () => {
    const [bungieId, setBungieId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBungieId = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const tempToken = sessionStorage.getItem('temp_auth_token')

                if (!tempToken) {
                    setError('Pas de token d\'authentification')
                    setIsLoading(false)
                    return
                }

                const response = await axios.get(`${API_BASE_URL}/api/identity/user-info`, {
                    headers: {
                        'Authorization': `Bearer ${tempToken}`,
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    }
                })

                const { success, data } = response.data

                if (success && data.bungieId) {
                    setBungieId(data.bungieId)
                } else {
                    setError('Bungie ID non disponible')
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du Bungie ID:', error)
                setError('Erreur lors de la récupération du Bungie ID')
            } finally {
                setIsLoading(false)
            }
        }

        fetchBungieId()
    }, [])

    return { bungieId, isLoading, error }
}
