import { useAuth } from './useAuth'
import { IAgent } from '@/types/agent'

interface UpdateProtocolSettings {
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

interface UseProtocolReturn {
  // Données du protocole
  agentName: string | null
  customName: string | null
  displayName: string | null
  species: 'HUMAN' | 'EXO' | 'AWOKEN' | null
  role: 'AGENT' | 'SPECIALIST' | 'FOUNDER' | null
  clearanceLevel: 1 | 2 | 3 | null
  group: 'PROTOCOL' | 'AURORA' | 'ZENITH' | null
  
  // État du protocole
  hasSeenRecruitment: boolean
  protocolJoinedAt: Date | null
  
  // Paramètres
  settings: IAgent['protocol']['settings'] | null
  
  // Statistiques
  contractsCount: number
  activeChallengesCount: number
  completedChallengesCount: number
  
  // Helpers
  getDisplayName: () => string
  getRoleLabel: () => string
  getSpeciesLabel: () => string
  getClearanceLabel: () => string
  getGroupLabel: () => string
  
  // Actions
  updateSettings: (updates: UpdateProtocolSettings) => Promise<void>
  
  // Vérifications
  canAccessDashboard: boolean
  canManageUsers: boolean
  canViewRecruitment: boolean
}

/**
 * Hook pour gérer les données et fonctionnalités spécifiques au protocole
 * 
 * @example
 * ```tsx
 * function ProtocolDashboard() {
 *   const { 
 *     displayName, 
 *     role, 
 *     clearanceLevel,
 *     canAccessDashboard,
 *     getDisplayName,
 *     getRoleLabel,
 *     updateSettings 
 *   } = useProtocol()
 *   
 *   if (!canAccessDashboard) {
 *     return <div>Accès non autorisé</div>
 *   }
 *   
 *   const handleUpdateName = async (newName: string) => {
 *     await updateSettings({ customName: newName })
 *   }
 *   
 *   return (
 *     <div>
 *       <h1>Bienvenue, Agent {getDisplayName()}</h1>
 *       <p>Rôle: {getRoleLabel()}</p>
 *       <p>Niveau d'autorisation: {clearanceLevel}</p>
 *       <button onClick={() => handleUpdateName('Nouveau Nom')}>
 *         Changer le nom
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 */
export const useProtocol = (): UseProtocolReturn => {
  const { agent, isAuthenticated, updateProfile } = useAuth()

  // Données du protocole
  const protocolData = agent?.protocol
  const agentName = protocolData?.agentName || null
  const customName = protocolData?.customName || null
  const species = protocolData?.species || null
  const role = protocolData?.role || null
  const clearanceLevel = protocolData?.clearanceLevel || null
  const group = protocolData?.group || null
  const hasSeenRecruitment = protocolData?.hasSeenRecruitment || false
  const protocolJoinedAt = protocolData?.protocolJoinedAt || null
  const settings = protocolData?.settings || null

  // Statistiques
  const contractsCount = agent?.contracts?.length || 0
  const activeChallengesCount = agent?.challenges?.filter(c => !c.complete)?.length || 0
  const completedChallengesCount = agent?.challenges?.filter(c => c.complete)?.length || 0

  // Helpers
  const getDisplayName = (): string => {
    if (!isAuthenticated || !agent) return 'Invité'
    return customName || agentName || agent.bungieUser?.displayName || 'Agent Inconnu'
  }

  const getRoleLabel = (): string => {
    switch (role) {
      case 'FOUNDER': return 'Fondateur'
      case 'SPECIALIST': return 'Spécialiste'
      case 'AGENT': return 'Agent'
      default: return 'Non défini'
    }
  }

  const getSpeciesLabel = (): string => {
    switch (species) {
      case 'HUMAN': return 'Humain'
      case 'EXO': return 'Exo'
      case 'AWOKEN': return 'Éveillé'
      default: return 'Non défini'
    }
  }

  const getClearanceLabel = (): string => {
    switch (clearanceLevel) {
      case 1: return 'Niveau 1 - Basique'
      case 2: return 'Niveau 2 - Élevé'
      case 3: return 'Niveau 3 - Maximum'
      default: return 'Non défini'
    }
  }

  const getGroupLabel = (): string => {
    switch (group) {
      case 'PROTOCOL': return 'Protocole'
      case 'AURORA': return 'Aurora'
      case 'ZENITH': return 'Zenith'
      default: return 'Aucun groupe'
    }
  }

  // Actions
  const updateSettings = async (updates: UpdateProtocolSettings): Promise<void> => {
    try {
      await updateProfile({
        protocol: updates
      })
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres:', error)
      throw error
    }
  }

  // Vérifications d'accès
  const canAccessDashboard = isAuthenticated && role !== null
  const canManageUsers = role === 'FOUNDER' || role === 'SPECIALIST'
  const canViewRecruitment = clearanceLevel !== null && clearanceLevel >= 2

  return {
    // Données du protocole
    agentName,
    customName,
    displayName: getDisplayName(),
    species,
    role,
    clearanceLevel,
    group,
    
    // État du protocole
    hasSeenRecruitment,
    protocolJoinedAt,
    
    // Paramètres
    settings,
    
    // Statistiques
    contractsCount,
    activeChallengesCount,
    completedChallengesCount,
    
    // Helpers
    getDisplayName,
    getRoleLabel,
    getSpeciesLabel,
    getClearanceLabel,
    getGroupLabel,
    
    // Actions
    updateSettings,
    
    // Vérifications
    canAccessDashboard,
    canManageUsers,
    canViewRecruitment
  }
}

/**
 * Hook simple pour obtenir uniquement le nom d'affichage de l'agent
 */
export const useAgentDisplayName = (): string => {
  const { getDisplayName } = useProtocol()
  return getDisplayName()
}

/**
 * Hook pour obtenir les informations Bungie de l'utilisateur
 */
export const useBungieProfile = () => {
  const { agent } = useAuth()
  
  return {
    bungieUser: agent?.bungieUser || null,
    bungieId: agent?.bungieId || null,
    destinyMemberships: agent?.destinyMemberships || [],
    hasBungieAccount: !!agent?.bungieUser

  }
}