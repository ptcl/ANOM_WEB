/**
 * 🎯 Hooks principaux - Interface simple et claire
 * 
 * Organisation logique:
 * - useAuthentication: Gestion auth complète
 * - useDashboard: Données dashboard agent
 * - useProtocolData: Données protocol générales
 */

// 🔐 Authentification
export { useAuthentication } from './useAuthentication'

// 📊 Données Dashboard
export { useDashboard } from './useDashboard'

// 🎯 Données Protocol
export { 
    useProtocolData,
    useProfileOnly,
    useChallengesOnly 
} from './useProtocolData'

// 📝 Types
export type { IAgent } from '@/types/agent'