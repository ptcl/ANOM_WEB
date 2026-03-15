// hooks/useAuthentication.ts
'use client'

import { useState, useEffect } from 'react'
import { useAgentStore, invalidateAgentCache } from '@/store/agentStore'

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

    const clearAgent = useAgentStore(state => state.clearAgent)

    const checkAuthStatus = () => {
        if (typeof window === 'undefined') {
            setState(prev => ({ ...prev, isLoading: false }))
            return
        }

        const token = localStorage.getItem('protocol_token')
        setState({
            isAuthenticated: !!token,
            isLoading: false,
            token
        })
    }

    const logout = (redirectTo: string = '/') => {
        localStorage.removeItem('protocol_token')
        localStorage.removeItem('bungie_auth_state')

        clearAgent()
        invalidateAgentCache()

        setState({
            isAuthenticated: false,
            isLoading: false,
            token: null
        })

        window.location.href = redirectTo
    }

    const refreshAuthStatus = checkAuthStatus

    useEffect(() => {
        checkAuthStatus()
    }, [])

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