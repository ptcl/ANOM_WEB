import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import { IAgent } from '@/types/agent'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface UpdateAgentProfileData {
    protocol?: {
        hasSeenRecruitment?: boolean
        customName?: string
        species?: 'HUMAN' | 'EXO' | 'AWOKEN'
        settings?: {
            notifications?: boolean
            publicProfile?: boolean
            protocolOSTheme?: 'DEFAULT' | 'DARKNESS'
            protocolSounds?: boolean
        }
    }
}

interface SimpleAgentState {
    // État
    agent: IAgent | null
    isLoading: boolean
    isAuthenticated: boolean
    error: string | null
    isInitializing: boolean

    // Actions de base
    setAgent: (agent: IAgent | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setAuthenticated: (auth: boolean) => void

    // Actions API
    fetchProfile: () => Promise<void>
    updateAgentProfile: (updates: UpdateAgentProfileData) => Promise<void>
    logout: () => void

    // Méthode d'initialisation simple
    initialize: () => Promise<void>
}

const useUserStore = create<SimpleAgentState>()(
    persist(
        (set, get) => ({
            // État initial
            agent: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
            isInitializing: false,

            // Setters simples
            setAgent: (agent) => set({ agent }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

            // Récupération du profil
            fetchProfile: async () => {
                const currentState = get()
                
                // ✅ PROTECTION: Si déjà en cours, ne rien faire
                if (currentState.isLoading) {
                    console.log('⏭️ FetchProfile ignoré (déjà en cours)')
                    return
                }

                try {
                    set({ isLoading: true, error: null })

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

                    console.log('📡 Réponse API:', response.data)

                    if (response.data.success && response.data.data?.agent) {
                        const agent = response.data.data.agent
                        console.log('✅ Agent reçu de l\'API:', {
                            agentName: agent.protocol?.agentName,
                            customName: agent.protocol?.customName,
                            membershipId: agent.bungieUser?.membershipId
                        })
                        
                        set({
                            agent: agent,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null
                        })
                    } else {
                        throw new Error('Profil agent non trouvé')
                    }

                } catch (error) {
                    console.error('❌ Erreur fetchProfile:', error)
                    set({
                        agent: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Erreur inconnue'
                    })
                }
            },

            // Mise à jour du profil agent
            updateAgentProfile: async (updates: UpdateAgentProfileData) => {
                try {
                    set({ isLoading: true, error: null })

                    const token = sessionStorage.getItem('temp_auth_token')
                    if (!token) {
                        throw new Error('Pas de token d\'authentification')
                    }

                    const response = await axios.patch(`${API_BASE_URL}/api/protocol/agent/profile`, updates, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true'
                        }
                    })

                    console.log('📡 Réponse API updateProfile:', response.data)

                    if (response.data.success && response.data.data?.agent) {
                        // Mettre à jour l'agent dans le store avec les nouvelles données
                        set({
                            agent: response.data.data.agent,
                            isLoading: false,
                            error: null
                        })
                    } else {
                        throw new Error(response.data.error || 'Échec de la mise à jour du profil')
                    }

                } catch (error) {
                    console.error('❌ Erreur updateAgentProfile:', error)
                    let errorMessage = 'Erreur inconnue'
                    
                    if (axios.isAxiosError(error)) {
                        errorMessage = error.response?.data?.error || error.message
                    } else if (error instanceof Error) {
                        errorMessage = error.message
                    }
                    
                    set({
                        isLoading: false,
                        error: errorMessage
                    })
                    
                    // Re-throw pour permettre la gestion d'erreur dans le composant
                    throw error
                }
            },

            // Initialisation simple avec protection contre les doublons
            initialize: async () => {
                const currentState = get()
                
                // ✅ PROTECTION: Si déjà en cours ou déjà authentifié, ne rien faire
                if (currentState.isInitializing || currentState.isAuthenticated) {
                    console.log('⏭️ Initialisation ignorée (déjà en cours ou authentifié)')
                    return
                }

                const token = sessionStorage.getItem('temp_auth_token')

                if (!token) {
                    console.log('❌ Pas de token')
                    set({ isAuthenticated: false, isLoading: false, isInitializing: false })
                    return
                }

                console.log('🚀 Initialisation...')
                set({ isInitializing: true })
                
                try {
                    await get().fetchProfile()
                } finally {
                    set({ isInitializing: false })
                }
            },

            // Déconnexion
            logout: () => {
                console.log('🚪 Déconnexion en cours...')
                
                // ✅ NETTOYAGE COMPLET
                sessionStorage.removeItem('temp_auth_token')
                localStorage.removeItem('simple-user-data')
                
                // ✅ RESET DU STORE
                set({
                    agent: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                    isInitializing: false
                })
                
                console.log('✅ Déconnexion terminée')
            }
        }),
        {
            name: 'simple-user-data',
            partialize: (state) => ({
                // ✅ CORRECTION: Ne persister que si authentifié et agent présent
                agent: state.isAuthenticated && state.agent ? state.agent : null,
                isAuthenticated: state.isAuthenticated && !!state.agent
            }),
            // ✅ Ne pas persister si pas d'agent valide
            skipHydration: false,
        }
    )
)

export { useUserStore }