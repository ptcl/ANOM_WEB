'use client'

import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface SimpleProfile {
    _id: string
    bungieId: string
    destinyMemberships: unknown[]
    bungieUser: {
        membershipId: number
        uniqueName: string
        displayName: string
        profilePicture: number
        about: string
    }
    protocol: {
        agentName?: string
        customName?: string
        species?: string
        role?: string
        clearanceLevel?: number
        group?: string
        hasSeenRecruitment?: boolean
    }
    lastActivity: string
    createdAt: string
    updatedAt: string
}

export function useDashboard() {
    const [profile, setProfile] = useState<SimpleProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // ✅ DEBUG : Tracer seulement les changements importants d'état
    useEffect(() => {
        if (!isLoading && profile) {
            console.log('📊 useDashboard: Profil chargé avec succès')
        } else if (!isLoading && error) {
            console.log('📊 useDashboard: Erreur de chargement -', error)
        }
    }, [profile, isLoading, error])

    const loadProfile = useCallback(async () => {
        try {
            // ✅ AuthProvider garantit qu'on a un token, récupération directe
            const token = sessionStorage.getItem('temp_auth_token')!
            
            console.log('🚀 Chargement simple du profil...')
            const response = await axios.get(`${API_BASE_URL}/api/protocol/agent/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            if (response.data.success && response.data.data) {
                const agentData = response.data.data.agent || response.data.data
                console.log('✅ Profil chargé:', agentData.protocol?.agentName || 'Agent sans nom')
                setProfile(agentData)
                setError(null)
            } else {
                throw new Error('Profil non trouvé')
            }
        } catch (err) {
            console.error('❌ Erreur chargement profil:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
            setProfile(null)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        // ✅ AuthProvider garantit déjà qu'on a un token, pas besoin de re-vérifier
        loadProfile()
    }, [loadProfile])

    return {
        profile,
        isLoading,
        error,
        reload: loadProfile
    }
}