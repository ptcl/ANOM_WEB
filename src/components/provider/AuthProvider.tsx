'use client'

import { ReactNode, createContext, useContext, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth as useAuthHook } from '@/hooks/useAuth'

const PUBLIC_ROUTES = ['/', '/identity/login', '/identity/bungie/callback']

type AuthContextType = {
    isLoading: boolean
    isAuthenticated: boolean
    checkAuth: () => Promise<boolean>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuthContext = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuthContext doit être utilisé à l'intérieur d'un AuthProvider")
    }
    return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    // Utiliser notre hook useAuth centralisé
    const auth = useAuthHook()
    const { isAuthenticated, isLoading, logout: authLogout } = auth

    const checkAuth = useCallback(async (): Promise<boolean> => {
        const token = sessionStorage.getItem('temp_auth_token')
        return !!token
    }, [])

    const logout = useCallback(() => {
        console.log('👋 Déconnexion depuis AuthProvider')
        authLogout()
        router.push('/')
    }, [authLogout, router])

    // ✅ SIMPLIFIÉ: Protection simple des routes
    useEffect(() => {
        // Routes publiques : pas de vérification
        if (PUBLIC_ROUTES.includes(pathname)) {
            return
        }

        // ✅ SIMPLE: Vérification basique du token
        const token = sessionStorage.getItem('temp_auth_token')
        
        if (!token) {
            console.log('❌ Pas de token, redirection IMMÉDIATE vers /')
            // ✅ Redirection immédiate + forcée
            window.location.replace('/')
            return
        }

        console.log('✅ Token présent, accès autorisé à:', pathname)

        // ✅ Vérification périodique simple du token (toutes les 5 minutes)
        const interval = setInterval(() => {
            const currentToken = sessionStorage.getItem('temp_auth_token')
            if (!currentToken) {
                console.log('⚠️ Token expiré, déconnexion')
                logout()
            }
        }, 5 * 60 * 1000)

        return () => clearInterval(interval)
    }, [pathname, router, logout])

    return (
        <AuthContext.Provider value={{
            isLoading,
            isAuthenticated,
            checkAuth,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}