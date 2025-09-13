'use client'

import { useState, useEffect } from 'react'
import { useJWTMonitor } from './jwt'
import { IAgent } from '@/types/agent'
import { AuthState } from '@/types/utils'

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        agent: null,
        isLoading: true,
        token: null
    })

    const { isExpired, isExpiringSoon, isRefreshing } = useJWTMonitor(
        authState.token,
        () => {
            logout()
        },
        () => {
            console.log('⚠️ Token expiring soon...')
        },
        (newToken: string, IAgent: unknown) => {
            login(newToken, IAgent as IAgent)
        }
    )

    useEffect(() => {
        initializeAuth()
    }, [])

    const initializeAuth = () => {
        try {
            const token = localStorage.getItem('anom_jwt')
            const agentData = localStorage.getItem('anom_player')

            if (token && agentData) {
                const agent = JSON.parse(agentData)
                setAuthState({
                    isAuthenticated: true,
                    agent,
                    isLoading: false,
                    token
                })
            } else {
                setAuthState({
                    isAuthenticated: false,
                    agent: null,
                    isLoading: false,
                    token: null
                })
            }
        } catch (error) {
            console.error('Failed to initialize auth:', error)
            logout()
        }
    }

    const login = (token: string, agent: IAgent) => {
        localStorage.setItem('anom_jwt', token)
        localStorage.setItem('anom_player', JSON.stringify(agent))

        setAuthState({
            isAuthenticated: true,
            agent,
            isLoading: false,
            token
        })
    }

    const logout = () => {
        localStorage.removeItem('anom_jwt')
        localStorage.removeItem('anom_player')

        setAuthState({
            isAuthenticated: false,
            agent: null,
            isLoading: false,
            token: null
        })
    }

    const updatePlayer = (agent: IAgent) => {
        localStorage.setItem('anom_player', JSON.stringify(agent))
        setAuthState(prev => ({
            ...prev,
            agent
        }))
    }

    return {
        ...authState,
        login,
        logout,
        updatePlayer,
        refreshAuth: initializeAuth,
        isTokenExpired: isExpired,
        isTokenExpiringSoon: isExpiringSoon,
        isRefreshingToken: isRefreshing
    }
}