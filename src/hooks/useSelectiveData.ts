'use client'

import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// ✅ Types basés sur les vraies routes API
interface AgentProfile {
    agentName?: string
    customName?: string
    species?: string
    role?: string
    clearanceLevel?: string
    group?: string
    settings?: {
        notifications?: boolean
        publicProfile?: boolean
        protocolOSTheme?: 'DEFAULT' | 'DARKNESS'
        protocolSounds?: boolean
    }
    protocolJoinedAt?: string
    hasSeenRecruitment?: boolean
}

interface ProtocolStatus {
    isOnline: boolean
    version?: string
    message?: string
    maintenance?: boolean
}

interface AgentContract {
    contractMongoId?: string
    contractId?: string
    title?: string
    description?: string
    accessedAt?: string
    completedAt?: string
    status?: string
}

interface Challenge {
    challengeMongoId?: string
    challengeId?: string
    title?: string
    description?: string
    difficulty?: string
    complete?: boolean
    accessedAt?: string
    completedAt?: string
    partialCode?: string
    unlockedFragments?: string[]
}

interface Announcement {
    _id?: string
    title?: string
    content?: string
    type?: string
    createdAt?: string
    readBy?: string[]
}

interface Emblem {
    _id?: string
    emblemId?: string
    name?: string
    description?: string
    imageUrl?: string
}

// ✅ Hook pour récupérer le profil de l'agent (route existante)
export function useAgentProfile() {
    const [profile, setProfile] = useState<AgentProfile | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAgentProfile = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const token = sessionStorage.getItem('temp_auth_token')
            if (!token) {
                throw new Error('Pas de token d\'authentification')
            }

            const response = await axios.get(`${API_BASE_URL}/api/protocol/agent/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            if (response.data.success && response.data.data) {
                // Adapter la réponse selon la structure de ton API
                setProfile(response.data.data)
            } else {
                throw new Error('Profil de l\'agent non trouvé')
            }
        } catch (err) {
            console.error('❌ Erreur fetchAgentProfile:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        profile,
        isLoading,
        error,
        refetch: fetchAgentProfile
    }
}

// ✅ Hook pour récupérer le statut du protocole (route existante)
export function useProtocolStatus() {
    const [status, setStatus] = useState<ProtocolStatus | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchProtocolStatus = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Note: Cette route ne nécessite pas de token d'authentification
            const response = await axios.get(`${API_BASE_URL}/api/protocol/status`, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            if (response.data) {
                setStatus(response.data)
            } else {
                throw new Error('Statut du protocole non trouvé')
            }
        } catch (err) {
            console.error('❌ Erreur fetchProtocolStatus:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        status,
        isLoading,
        error,
        refetch: fetchProtocolStatus
    }
}

// ✅ Hook pour récupérer les contrats de l'agent (route existante)
export function useAgentContracts() {
    const [contracts, setContracts] = useState<AgentContract[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAgentContracts = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const token = sessionStorage.getItem('temp_auth_token')
            if (!token) {
                throw new Error('Pas de token d\'authentification')
            }

            const response = await axios.get(`${API_BASE_URL}/api/protocol/agent/contracts`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            if (response.data.success && response.data.data) {
                setContracts(response.data.data)
            } else {
                throw new Error('Contrats de l\'agent non trouvés')
            }
        } catch (err) {
            console.error('❌ Erreur fetchAgentContracts:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        contracts,
        isLoading,
        error,
        refetch: fetchAgentContracts
    }
}

// ✅ Hook pour récupérer les challenges disponibles (route existante)
export function useAvailableChallenges() {
    const [challenges, setChallenges] = useState<Challenge[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAvailableChallenges = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Note: Cette route ne semble pas nécessiter de token selon le middleware
            const response = await axios.get(`${API_BASE_URL}/api/protocol/challenges/available`, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            if (response.data.success && response.data.data) {
                setChallenges(response.data.data)
            } else {
                throw new Error('Challenges disponibles non trouvés')
            }
        } catch (err) {
            console.error('❌ Erreur fetchAvailableChallenges:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        challenges,
        isLoading,
        error,
        refetch: fetchAvailableChallenges
    }
}

// ✅ Hook pour récupérer les annonces (route existante)
export function useAnnouncements() {
    const [announcements, setAnnouncements] = useState<Announcement[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAnnouncements = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // Note: Cette route ne semble pas nécessiter de token selon le middleware
            const response = await axios.get(`${API_BASE_URL}/api/protocol/announcements`, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            if (response.data.success && response.data.data) {
                setAnnouncements(response.data.data)
            } else {
                throw new Error('Annonces non trouvées')
            }
        } catch (err) {
            console.error('❌ Erreur fetchAnnouncements:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        announcements,
        isLoading,
        error,
        refetch: fetchAnnouncements
    }
}

// ✅ Hook pour récupérer la progression des challenges de l'agent
export function useAgentChallengeProgress() {
    const [progress, setProgress] = useState<Challenge[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAgentProgress = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const token = sessionStorage.getItem('temp_auth_token')
            if (!token) {
                throw new Error('Pas de token d\'authentification')
            }

            const response = await axios.get(`${API_BASE_URL}/api/protocol/agent/challenge/progress`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            if (response.data.success && response.data.data) {
                setProgress(response.data.data)
            } else {
                throw new Error('Progression des challenges non trouvée')
            }
        } catch (err) {
            console.error('❌ Erreur fetchAgentProgress:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        progress,
        isLoading,
        error,
        refetch: fetchAgentProgress
    }
}

// ✅ Hook pour récupérer les emblèmes disponibles (route existante)
export function useEmblems() {
    const [emblems, setEmblems] = useState<Emblem[] | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchEmblems = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const token = sessionStorage.getItem('temp_auth_token')
            if (!token) {
                throw new Error('Pas de token d\'authentification')
            }

            const response = await axios.get(`${API_BASE_URL}/api/protocol/emblems`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            if (response.data.success && response.data.data) {
                setEmblems(response.data.data)
            } else {
                throw new Error('Emblèmes non trouvés')
            }
        } catch (err) {
            console.error('❌ Erreur fetchEmblems:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        emblems,
        isLoading,
        error,
        refetch: fetchEmblems
    }
}

// ✅ Hook simple pour vérifier l'authentification (basé sur token local)
export function useAuthCheck() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        // ✅ Protection SSR
        if (typeof window === 'undefined') {
            setIsChecking(false)
            return
        }

        const checkAuth = () => {
            const token = sessionStorage.getItem('temp_auth_token')
            setIsAuthenticated(!!token)
            setIsChecking(false)
        }

        checkAuth()

        // Écouter les changements de sessionStorage
        const handleStorageChange = () => checkAuth()
        window.addEventListener('storage', handleStorageChange)

        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    return {
        isAuthenticated,
        isChecking,
        hasToken: typeof window !== 'undefined' ? !!sessionStorage.getItem('temp_auth_token') : false
    }
}

// ✅ Hook pour vérifier le token avec l'API (route existante)
export function useTokenVerification() {
    const [verificationData, setVerificationData] = useState<{
        isValid: boolean
        tokenData?: {
            userId?: string
            bungieId?: string
            expiresAt?: string
        }
    } | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const verifyToken = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const token = sessionStorage.getItem('temp_auth_token')
            if (!token) {
                setVerificationData({ isValid: false })
                return
            }

            // ✅ Envoyer le token dans le body comme attendu par l'API
            const response = await axios.post(`${API_BASE_URL}/api/identity/verify`, {
                token: token
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            // ✅ Gérer les différents types de réponse de ton API
            if (response.data.success) {
                setVerificationData({
                    isValid: true,
                    tokenData: response.data.data
                })
            } else {
                // Ton API peut retourner success:false avec data.valid:false
                const isValid = response.data.data?.valid === true
                setVerificationData({ 
                    isValid,
                    tokenData: isValid ? response.data.data : null
                })
            }
        } catch (err) {
            console.error('❌ Erreur verifyToken:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
            setVerificationData({ isValid: false })
        } finally {
            setIsLoading(false)
        }
    }, []) // Pas de dépendances car utilise sessionStorage directement

    return {
        verificationData,
        isLoading,
        error,
        verifyToken
    }
}

// ✅ Hook pour rafraîchir le token (route existante)
export function useTokenRefresh() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const refreshToken = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const token = sessionStorage.getItem('temp_auth_token')
            if (!token) {
                throw new Error('Pas de token à rafraîchir')
            }

            const response = await axios.post(`${API_BASE_URL}/api/identity/refresh`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            if (response.data.success && response.data.data?.token) {
                // Mettre à jour le token dans sessionStorage
                sessionStorage.setItem('temp_auth_token', response.data.data.token)
                console.log('✅ Token rafraîchi avec succès')
                return response.data.data.token
            } else {
                throw new Error('Impossible de rafraîchir le token')
            }
        } catch (err) {
            console.error('❌ Erreur refreshToken:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        error,
        refreshToken
    }
}

// ✅ Hook pour obtenir le statut du service d'authentification
export function useAuthServiceStatus() {
    const [serviceStatus, setServiceStatus] = useState<{
        status: string
        service: string
        version: string
        timestamp: string
    } | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchAuthServiceStatus = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const response = await axios.get(`${API_BASE_URL}/api/identity/status`, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                }
            })

            if (response.data.success && response.data.data) {
                setServiceStatus(response.data.data)
            } else {
                throw new Error('Statut du service d\'authentification non trouvé')
            }
        } catch (err) {
            console.error('❌ Erreur fetchAuthServiceStatus:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // Auto-fetch au montage
        fetchAuthServiceStatus()
    }, [])

    return {
        serviceStatus,
        isLoading,
        error,
        refetch: fetchAuthServiceStatus
    }
}

// ✅ Hook pour gérer la connexion Bungie (routes existantes)
export function useBungieAuth() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const initiateBungieLogin = () => {
        try {
            setIsLoading(true)
            setError(null)
            
            // Rediriger vers la route de login Bungie
            window.location.href = `${API_BASE_URL}/api/identity/bungie/login`
        } catch (err) {
            console.error('❌ Erreur initiateBungieLogin:', err)
            setError(err instanceof Error ? err.message : 'Erreur inconnue')
            setIsLoading(false)
        }
    }

    const handleAuthCallback = (callbackUrl: string) => {
        try {
            setIsLoading(true)
            setError(null)
            
            // Extraire les paramètres de l'URL de callback si nécessaire
            const url = new URL(callbackUrl)
            const code = url.searchParams.get('code')
            // const state = url.searchParams.get('state') // Pour validation future
            
            if (!code) {
                throw new Error('Code d\'autorisation manquant dans le callback')
            }
            
            // Le callback sera géré par la route /api/identity/bungie/callback
            console.log('✅ Callback Bungie reçu avec succès')
            
        } catch (err) {
            console.error('❌ Erreur handleAuthCallback:', err)
            setError(err instanceof Error ? err.message : 'Erreur de callback')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        error,
        initiateBungieLogin,
        handleAuthCallback,
        clearError: () => setError(null)
    }
}