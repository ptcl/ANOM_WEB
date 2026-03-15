'use client'

import { ReactNode, createContext, useContext, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthentication } from '@/hooks/useAuthentication'

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
    if (!context) throw new Error("useAuthContext doit être utilisé à l'intérieur d'un AuthProvider")
    return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { isAuthenticated, isLoading, logout: authLogout } = useAuthentication()

    const checkAuth = useCallback(async (): Promise<boolean> => {
        const token = localStorage.getItem('protocol_token')
        return !!token
    }, [])

    const logout = useCallback(() => {
        authLogout()
        localStorage.removeItem('protocol_token')
        router.push('/')
    }, [authLogout, router])

    useEffect(() => {
        // Routes publiques : pas de vérif
        if (PUBLIC_ROUTES.includes(pathname)) return

        const token = localStorage.getItem('protocol_token')
        if (!token) {
            window.location.replace('/')
            return
        }

        // Vérification périodique (5 min)
        const interval = setInterval(() => {
            const currentToken = localStorage.getItem('protocol_token')
            if (!currentToken) {
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
