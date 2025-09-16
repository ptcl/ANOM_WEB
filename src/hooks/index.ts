// Export de tous les hooks d'authentification et de protocole
export { 
  useAuth, 
  useRequireAuth, 
  useAgent, 
  useAuthStatus 
} from './useAuth'

export { 
  useProtocol, 
  useAgentDisplayName, 
  useBungieProfile 
} from './useProtocol'

// Types pour faciliter l'utilisation
export type { IAgent } from '@/types/agent'