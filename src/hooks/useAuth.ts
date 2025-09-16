import { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import { IAgent } from '@/types/agent'

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

interface UseAuthReturn {
  // État
  agent: IAgent | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  
  // Données dérivées
  isGuest: boolean
  agentName: string | null
  agentId: string | null
  
  // Actions
  login: () => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
  updateProfile: (updates: UpdateAgentProfileData) => Promise<void>
  clearError: () => void
  
  // Helpers
  hasPermission: (permission: string) => boolean
  isInitialized: boolean
}

/**
 * Hook personnalisé pour gérer l'authentification et les données utilisateur
 * 
 * @param autoInit - Si true, initialise automatiquement au montage du composant (défaut: true)
 * @returns Objet contenant l'état d'authentification et les actions disponibles
 * 
 * @example
 * ```tsx
 * // Utilisation basique
 * function MyComponent() {
 *   const { agent, isAuthenticated, isLoading, login, logout } = useAuth()
 *   
 *   if (isLoading) return <div>Chargement...</div>
 *   if (!isAuthenticated) return <button onClick={login}>Se connecter</button>
 *   
 *   return (
 *     <div>
 *       <p>Bienvenue {agent?.name}</p>
 *       <button onClick={logout}>Se déconnecter</button>
 *     </div>
 *   )
 * }
 * 
 * // Sans auto-initialisation
 * function LoginPage() {
 *   const { login, isLoading, error } = useAuth(false)
 *   
 *   return (
 *     <div>
 *       {error && <div className="error">{error}</div>}
 *       <button onClick={login} disabled={isLoading}>
 *         {isLoading ? 'Connexion...' : 'Se connecter'}
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
export const useAuth = (autoInit: boolean = true): UseAuthReturn => {
  const {
    agent,
    isLoading,
    isAuthenticated,
    error,
    fetchProfile,
    updateAgentProfile,
    logout: storeLogout,
    initialize,
    setError
  } = useUserStore()

  // Auto-initialisation au montage du composant
  useEffect(() => {
    if (autoInit && !isAuthenticated && !isLoading) {
      initialize()
    }
  }, [autoInit, isAuthenticated, isLoading, initialize])

  // Actions
  const login = async (): Promise<void> => {
    try {
      await fetchProfile()
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      throw error
    }
  }

  const logout = (): void => {
    storeLogout()
  }

  const refresh = async (): Promise<void> => {
    try {
      await fetchProfile()
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error)
      throw error
    }
  }

  const updateProfile = async (updates: UpdateAgentProfileData): Promise<void> => {
    try {
      await updateAgentProfile(updates)
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      throw error
    }
  }

  const clearError = (): void => {
    setError(null)
  }

  // Données dérivées
  const isGuest = !isAuthenticated
  const agentName = agent?.protocol?.customName || agent?.protocol?.agentName || null
  const agentId = agent?._id || agent?.bungieId || null
  const isInitialized = !isLoading && (isAuthenticated || error !== null)

  // Helper pour les permissions basé sur le rôle et le niveau d'autorisation
  const hasPermission = (permission: string): boolean => {
    if (!agent || !isAuthenticated) return false
    
    const { role, clearanceLevel } = agent.protocol
    
    // Logique de permissions basée sur le rôle et le niveau d'autorisation
    switch (permission.toLowerCase()) {
      case 'admin':
        return role === 'FOUNDER'
      case 'specialist':
        return role === 'SPECIALIST' || role === 'FOUNDER'
      case 'level_2':
        return clearanceLevel >= 2
      case 'level_3':
        return clearanceLevel >= 3
      default:
        return role === 'AGENT' || role === 'SPECIALIST' || role === 'FOUNDER'
    }
  }

  return {
    // État
    agent,
    isLoading,
    isAuthenticated,
    error,
    
    // Données dérivées
    isGuest,
    agentName,
    agentId,
    isInitialized,
    
    // Actions
    login,
    logout,
    refresh,
    updateProfile,
    clearError,
    
    // Helpers
    hasPermission
  }
}

// Hook spécialisé pour les composants qui nécessitent une authentification
export const useRequireAuth = (): UseAuthReturn => {
  const auth = useAuth()
  
  useEffect(() => {
    if (auth.isInitialized && !auth.isAuthenticated && !auth.error) {
      // Rediriger vers la page de connexion ou afficher un message
      console.warn('Authentification requise mais utilisateur non connecté')
    }
  }, [auth.isInitialized, auth.isAuthenticated, auth.error])
  
  return auth
}

// Hook pour les données agent uniquement (sans logique d'authentification)
export const useAgent = () => {
  const agent = useUserStore(state => state.agent)
  return agent
}

// Hook pour l'état d'authentification uniquement
export const useAuthStatus = () => {
  return useUserStore(state => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error
  }))
}