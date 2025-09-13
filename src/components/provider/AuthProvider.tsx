'use client'

import { ReactNode, createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUserStore } from '@/store/userStore'

const PUBLIC_ROUTES = ['/', '/identity/login', '/identity/bungie/callback']

type AuthContextType = {
    isLoading: boolean
    isAuthenticated: boolean
    checkAuth: () => Promise<boolean>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
    }
    return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)
    const [hasRedirected, setHasRedirected] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    const {
        isAuthenticated,
        verifyAuthentication,
        logout: logoutFromStore,
    } = useUserStore()

    const checkAuth = useCallback(async () => {
        try {
            setIsLoading(true)
            const result = await verifyAuthentication()
            setIsLoading(false)
            return result
        } catch (error) {
            console.error('❌ Erreur lors de la vérification d\'authentification:', error)
            setIsLoading(false)
            return false
        }
    }, [verifyAuthentication])

    const logout = () => {
        logoutFromStore()
        router.push('/')
    }

    useEffect(() => {
        if (PUBLIC_ROUTES.includes(pathname)) {
            setIsLoading(false)
            return
        }

        const verify = async () => {
            const isAuth = await checkAuth()

            if (!isAuth) {
                router.push(`/`)
                return
            }

            const protocol = useUserStore.getState().agent?.protocol

            // console.log('🔍 Vérification protocol:', {
            //     hasProtocol: !!protocol,
            //     hasSeenRecruitment: protocol?.hasSeenRecruitment,
            //     pathname
            // })

            if (
                !hasRedirected &&
                protocol &&
                protocol.hasSeenRecruitment === false &&
                pathname !== '/recruitment'
            ) {
                setHasRedirected(true)
                // console.log('🚀 Redirection vers la page de recrutement')
                router.push('/recruitment')
            }
        }

        verify()

        let isCheckingAuth = false
        const interval = setInterval(async () => {
            if (!isCheckingAuth) {
                isCheckingAuth = true
                try {
                    await checkAuth()
                } catch (error) {
                    console.error("❌ Erreur lors de la vérification périodique:", error)
                } finally {
                    isCheckingAuth = false
                }
            }
        }, 10 * 60 * 1000)

        return () => clearInterval(interval)
    }, [pathname, router, checkAuth, hasRedirected])

    return (
        <AuthContext.Provider value={{ isLoading, isAuthenticated, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    )
}