/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState, useCallback } from 'react'
import { 
    useAgentProfile,
    useProtocolStatus,
    useAvailableChallenges,
    useAnnouncements,
    useEmblems,
    useAuthCheck,
    useTokenVerification,
    useAuthServiceStatus
} from './useSelectiveData'

// ✅ Types pour la configuration des données basées sur les vraies routes
interface DataConfig {
    profile?: boolean
    protocolStatus?: boolean
    challenges?: boolean  // Simplifié : seulement challenges disponibles
    announcements?: boolean
    emblems?: boolean
    auth?: boolean
}

// ✅ Hook principal optimisé pour les vraies routes API
export function useOptimizedData(config: DataConfig = {}) {
    const [isInitialized, setIsInitialized] = useState(false)

    // ✅ Hooks conditionnels basés sur les vraies routes (sans contracts et progress)
    const agentProfile = useAgentProfile()
    const protocolStatus = useProtocolStatus()
    const availableChallenges = useAvailableChallenges()
    const announcements = useAnnouncements()
    const emblems = useEmblems()
    const authCheck = useAuthCheck()

    // ✅ État combiné optimisé avec les nouvelles données (sans contracts/progress)
    const [optimizedData, setOptimizedData] = useState<{
        profile?: any
        protocolStatus?: any
        availableChallenges?: any
        announcements?: any
        emblems?: any
        authData?: any
        isLoading: boolean
        error: string | null
    }>({
        isLoading: true,
        error: null
    })

    // ✅ Fonction pour récupérer seulement les données nécessaires
    const fetchOptimizedData = useCallback(async () => {
        setOptimizedData(prev => ({ ...prev, isLoading: true, error: null }))

        try {
            const promises: Promise<void>[] = []

            // Récupérer le profil de l'agent si demandé
            if (config.profile) {
                promises.push(agentProfile.refetch())
            }

            // Récupérer le statut du protocole si demandé
            if (config.protocolStatus) {
                promises.push(protocolStatus.refetch())
            }

            // Récupérer les challenges disponibles si demandé
            if (config.challenges) {
                promises.push(availableChallenges.refetch())
            }

            // Récupérer les annonces si demandé
            if (config.announcements) {
                promises.push(announcements.refetch())
            }

            // Récupérer les emblèmes si demandé
            if (config.emblems) {
                promises.push(emblems.refetch())
            }

            // Attendre toutes les requêtes en parallèle
            await Promise.all(promises)

        } catch (error) {
            console.error('❌ Erreur fetchOptimizedData:', error)
            setOptimizedData(prev => ({ 
                ...prev, 
                isLoading: false, 
                error: error instanceof Error ? error.message : 'Erreur inconnue' 
            }))
            return
        }

        // ✅ Construire les données optimisées selon la config
        const newData: any = {
            isLoading: false,
            error: null
        }

        if (config.profile) {
            newData.profile = agentProfile.profile
        }

        if (config.protocolStatus) {
            newData.protocolStatus = protocolStatus.status
        }

        if (config.challenges) {
            newData.availableChallenges = availableChallenges.challenges
        }

        if (config.announcements) {
            newData.announcements = announcements.announcements
        }

        if (config.emblems) {
            newData.emblems = emblems.emblems
        }

        if (config.auth) {
            newData.authData = {
                isAuthenticated: authCheck.isAuthenticated,
                hasToken: authCheck.hasToken
            }
        }

        // ✅ Combinaison des erreurs
        const errors = [
            config.profile && agentProfile.error,
            config.protocolStatus && protocolStatus.error,
            config.challenges && availableChallenges.error,
            config.announcements && announcements.error,
            config.emblems && emblems.error
        ].filter(Boolean)

        if (errors.length > 0) {
            newData.error = errors[0] // Première erreur rencontrée
        }

        setOptimizedData(newData)
    }, [config, agentProfile, protocolStatus, availableChallenges, announcements, emblems, authCheck])

    // ✅ Auto-fetch initial
    useEffect(() => {
        if (!isInitialized) {
            fetchOptimizedData()
            setIsInitialized(true)
        }
    }, [isInitialized, fetchOptimizedData])

    // ✅ Calculer l'état de loading global
    const isLoading = 
        (config.profile && agentProfile.isLoading) ||
        (config.protocolStatus && protocolStatus.isLoading) ||
        (config.challenges && availableChallenges.isLoading) ||
        (config.announcements && announcements.isLoading) ||
        (config.emblems && emblems.isLoading) ||
        optimizedData.isLoading

    return {
        ...optimizedData,
        isLoading: !!isLoading,
        refetch: fetchOptimizedData,
        
        // ✅ Accès direct aux hooks individuels si nécessaire
        hooks: {
            agentProfile,
            protocolStatus,
            availableChallenges,
            announcements,
            emblems,
            authCheck
        }
    }
}

// ✅ Hooks pré-configurés pour les cas d'usage courants

export function useMinimalAuth() {
    return useOptimizedData({
        auth: true
    })
}

export function useBasicDashboard() {
    return useOptimizedData({
        profile: true,
        protocolStatus: true,
        auth: true
    })
}

export function useCompleteDashboard() {
    return useOptimizedData({
        profile: true,
        protocolStatus: true,
        challenges: true,
        announcements: true,
        auth: true
    })
}

export function useExtendedDashboard() {
    return useOptimizedData({
        profile: true,
        protocolStatus: true,
        challenges: true,
        announcements: true,
        emblems: true,
        auth: true
    })
}

export function useChallengesOnly() {
    return useOptimizedData({
        challenges: true,
        auth: true
    })
}

export function useProtocolDataOnly() {
    return useOptimizedData({
        protocolStatus: true,
        announcements: true
    })
}

// ✅ Hook pour l'authentification complète avec vérification de token
export function useCompleteAuth() {
    const authCheck = useAuthCheck()
    const tokenVerification = useTokenVerification()
    const authServiceStatus = useAuthServiceStatus()

    return {
        // État local du token
        ...authCheck,
        
        // Vérification serveur
        tokenVerification,
        
        // Statut du service
        serviceStatus: authServiceStatus.serviceStatus,
        
        // Actions
        verifyToken: tokenVerification.verifyToken,
        
        // État global
        isFullyAuthenticated: authCheck.isAuthenticated && tokenVerification.verificationData?.isValid === true
    }
}