/**
 * 🚀 Hook ultra-léger pour les pages de login/authentification
 * 
 * Optimisations:
 * - Pas de requête API (vérification token local uniquement)
 * - Écoute des changements de sessionStorage en temps réel
 * - Performance maximale pour les pages d'auth
 */
'use client'

import { useState, useEffect } from 'react'

export function useLoginAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        // ✅ Protection SSR: Vérifier que nous sommes côté client
        if (typeof window === 'undefined') {
            setIsChecking(false)
            return
        }

        const checkAuthStatus = () => {
            const token = sessionStorage.getItem('temp_auth_token')
            const newAuthStatus = !!token
            
            setIsAuthenticated(newAuthStatus)
            setIsChecking(false)
            
            // Log pour debug (optionnel)
            console.log('🔐 LoginAuth check:', { hasToken: newAuthStatus })
        }

        // Vérification initiale
        checkAuthStatus()

        // Écouter les changements de sessionStorage
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'temp_auth_token') {
                checkAuthStatus()
            }
        }

        // Écouter les changements cross-window/tab
        window.addEventListener('storage', handleStorageChange)

        // Écouter les changements dans la même fenêtre (sessionStorage)
        const originalSetItem = sessionStorage.setItem
        const originalRemoveItem = sessionStorage.removeItem
        
        sessionStorage.setItem = function(key: string, value: string) {
            originalSetItem.apply(this, [key, value])
            if (key === 'temp_auth_token') {
                setTimeout(checkAuthStatus, 0) // Async pour éviter les race conditions
            }
        }

        sessionStorage.removeItem = function(key: string) {
            originalRemoveItem.apply(this, [key])
            if (key === 'temp_auth_token') {
                setTimeout(checkAuthStatus, 0)
            }
        }

        // Cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            sessionStorage.setItem = originalSetItem
            sessionStorage.removeItem = originalRemoveItem
        }
    }, [])

    return {
        isAuthenticated,
        isChecking,
        hasToken: typeof window !== 'undefined' ? !!sessionStorage.getItem('temp_auth_token') : false
    }
}