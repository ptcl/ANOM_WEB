'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * 🎯 Hook de données Protocol simplifié
 * 
 * Remplace: useOptimizedData, useSelectiveData (trop complexes)
 * Fonctionnalités:
 * - ✅ Interface simple et directe
 * - ✅ Gestion d'erreurs centralisée
 * - ✅ Types TypeScript clairs
 * - ✅ Rechargement manuel
 */

// Types simplifiés basés sur les vraies API
interface AgentProfile {
    agentName?: string
    customName?: string
    species?: string
    role?: string
    clearanceLevel?: number
    group?: string
    hasSeenRecruitment?: boolean
}

interface Challenge {
    _id: string
    title: string
    description: string
    type: string
    difficulty: string
    rewards: {
        experience: number
        tokens: number
    }
    status: 'available' | 'active' | 'completed'
}

interface Announcement {
    _id: string
    title: string
    message: string
    type: string
    createdAt: string
}

interface ProtocolDataState {
    profile: AgentProfile | null
    challenges: Challenge[]
    announcements: Announcement[]
    isLoading: boolean
    error: string | null
}

export function useProtocolData() {
    const [state, setState] = useState<ProtocolDataState>({
        profile: null,
        challenges: [],
        announcements: [],
        isLoading: true,
        error: null
    })

    const getAuthHeaders = () => {
        const token = sessionStorage.getItem('temp_auth_token')
        if (!token) throw new Error('Pas de token d\'authentification')
        
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        }
    }

    // ✅ Charger le profil agent
    const loadProfile = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/protocol/agent/profile`, {
                headers: getAuthHeaders()
            })

            if (response.data.success && response.data.data) {
                return response.data.data.agent?.protocol || response.data.data.protocol
            }
            return null
        } catch (error) {
            console.error('❌ Erreur profil:', error)
            return null
        }
    }

    // ✅ Charger les challenges disponibles
    const loadChallenges = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/protocol/agent/challenges/available`, {
                headers: getAuthHeaders()
            })

            if (response.data.success && response.data.data) {
                return response.data.data.challenges || []
            }
            return []
        } catch (error) {
            console.error('❌ Erreur challenges:', error)
            return []
        }
    }

    // ✅ Charger les annonces
    const loadAnnouncements = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/protocol/agent/announcements`, {
                headers: getAuthHeaders()
            })

            if (response.data.success && response.data.data) {
                return response.data.data.announcements || []
            }
            return []
        } catch (error) {
            console.error('❌ Erreur annonces:', error)
            return []
        }
    }

    // ✅ Charger toutes les données
    const loadAllData = async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const [profile, challenges, announcements] = await Promise.all([
                loadProfile(),
                loadChallenges(),
                loadAnnouncements()
            ])

            setState({
                profile,
                challenges,
                announcements,
                isLoading: false,
                error: null
            })

            console.log('✅ Toutes les données Protocol chargées')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage
            }))
            console.error('❌ Erreur chargement données:', error)
        }
    }

    // ✅ Rechargement manuel
    const reload = loadAllData

    // ✅ Chargement initial
    useEffect(() => {
        const token = sessionStorage.getItem('temp_auth_token')
        if (token) {
            loadAllData()
        } else {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Pas de token d\'authentification'
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        ...state,
        reload
    }
}

// ✅ Hooks spécialisés pour des besoins spécifiques
export function useProfileOnly() {
    const { profile, isLoading, error } = useProtocolData()
    return { profile, isLoading, error }
}

export function useChallengesOnly() {
    const { challenges, isLoading, error } = useProtocolData()
    return { challenges, isLoading, error }
}