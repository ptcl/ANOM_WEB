'use client'

import { useState, useEffect } from 'react'

/**
 * 🔐 Hook d'authentification unifié et simplifié
 * 
 * Remplace: useAuth, useLoginAuth, useLogout
 * Fonctionnalités:
 * - ✅ Vérification token simple et rapide
 * - ✅ Déconnexion complète 
 * - ✅ Gestion SSR/hydratation
 * - ✅ Interface claire et cohérente
 */

interface AuthState {
    isAuthenticated: boolean
    isLoading: boolean
    token: string | null
}

interface AuthActions {
    logout: (redirectTo?: string) => void
    refreshAuthStatus: () => void
}

export function useAuthentication(): AuthState & AuthActions {
    const [state, setState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        token: null
    })

    // ✅ Vérifier le statut d'authentification
    const checkAuthStatus = () => {
        if (typeof window === 'undefined') {
            setState(prev => ({ ...prev, isLoading: false }))
            return
        }

        const token = sessionStorage.getItem('temp_auth_token')
        setState({
            isAuthenticated: !!token,
            isLoading: false,
            token
        })
    }

    // ✅ Déconnexion complète
    const logout = (redirectTo: string = '/') => {
        console.log('🚪 Déconnexion en cours...')
        
        // Nettoyer tous les tokens et données
        sessionStorage.removeItem('temp_auth_token')
        localStorage.removeItem('simple-user-data')
        localStorage.removeItem('bungie_auth_state')
        
        // Mettre à jour l'état
        setState({
            isAuthenticated: false,
            isLoading: false,
            token: null
        })
        
        // Redirection
        window.location.href = redirectTo
        console.log('✅ Déconnexion terminée, redirection vers:', redirectTo)
    }

    // ✅ Actualiser le statut (pour les changements externes)
    const refreshAuthStatus = checkAuthStatus

    // ✅ Initialisation côté client seulement
    useEffect(() => {
        checkAuthStatus()
    }, [])

    // ✅ Écouter les changements de sessionStorage (multi-onglets)
    useEffect(() => {
        if (typeof window === 'undefined') return

        const handleStorageChange = () => {
            checkAuthStatus()
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    return {
        ...state,
        logout,
        refreshAuthStatus
    }
}