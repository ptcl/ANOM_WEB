'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useUserStore } from '@/store/userStore'
import { IChallenge } from '@/types/challenge'
import { IAgent } from '@/types/agent'
import { IContract } from '@/types/contract'

interface CacheEntry<T> {
    data: T
    timestamp: number
    expiry: number
}

class DataCache<T = unknown> {
    private cache = new Map<string, CacheEntry<T>>()

    set(key: string, data: T, ttl: number = 300000) { // 5 min par défaut
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expiry: Date.now() + ttl
        })
    }

    get(key: string): T | null {
        const entry = this.cache.get(key)
        if (!entry) return null

        if (Date.now() > entry.expiry) {
            this.cache.delete(key)
            return null
        }

        return entry.data
    }

    clear(pattern?: string) {
        if (pattern) {
            for (const [key] of this.cache) {
                if (key.includes(pattern)) {
                    this.cache.delete(key)
                }
            }
        } else {
            this.cache.clear()
        }
    }

    has(key: string): boolean {
        const entry = this.cache.get(key)
        return entry ? Date.now() <= entry.expiry : false
    }
}

// Cache global avec types spécifiques
const challengeCache = new DataCache<IChallenge[]>()
const agentCache = new DataCache<IAgent>()
const contractCache = new DataCache<IContract[]>()


export function useDashboardData() {
    const [challengeData, setChallengeData] = useState<IChallenge[] | null>(null)
    const [agentProgress, setAgentProgress] = useState<IChallenge[] | null>(null)
    const [agentData, setAgentData] = useState<IAgent | null>(null)
    const [contractData, setContractData] = useState<IContract[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const fetchPromiseRef = useRef<Promise<void> | null>(null)
    const isMountedRef = useRef(true)

    const fetchData = useCallback(async (forceRefresh = false) => {
        // Éviter les appels multiples simultanés
        if (fetchPromiseRef.current && !forceRefresh) {
            return fetchPromiseRef.current
        }

        const promise = (async () => {
            try {
                setIsLoading(true)
                setError(null)

                // Vérifier le cache d'abord
                const cachedChallenges = challengeCache.get('challenges')
                const cachedProgress = challengeCache.get('agentProgress')
                const cachedAgent = agentCache.get('agentProfile')
                const cachedContracts = contractCache.get('contracts')

                if (!forceRefresh && cachedChallenges && cachedProgress && cachedAgent && cachedContracts) {
                    if (isMountedRef.current) {
                        setChallengeData(cachedChallenges)
                        setAgentProgress(cachedProgress)
                        setAgentData(cachedAgent)
                        setContractData(cachedContracts)
                        setIsLoading(false)
                    }
                    return
                }

                // Appels API parallèles
                const [challengeResponse, progressResponse, agentResponse, contractResponse] = await Promise.all([
                    useUserStore.getState().getAvailableChallenges(),
                    useUserStore.getState().getAgentProgress(),
                    useUserStore.getState().getProfile(),
                    useUserStore.getState().getAgentAllContracts(),
                ])

                // Mettre en cache avec types appropriés
                challengeCache.set('challenges', challengeResponse as IChallenge[], 300000) // 5 min
                challengeCache.set('agentProgress', progressResponse as IChallenge[], 60000)  // 1 min
                agentCache.set('agentProfile', agentResponse as IAgent, 60000) // 1 min
                contractCache.set('contracts', contractResponse as IContract[], 300000) // 5 min

                if (isMountedRef.current) {
                    setChallengeData(challengeResponse as IChallenge[])
                    setAgentProgress(progressResponse as IChallenge[])
                    setAgentData(agentResponse as IAgent)
                    setContractData(contractResponse as IContract[])
                }
            } catch (err: unknown) {
                console.error('Erreur fetch dashboard:', err)
                if (isMountedRef.current) {
                    if (err instanceof Error) {
                        setError(err.message)
                    } else {
                        setError('Erreur de chargement')
                    }
                }
            } finally {
                if (isMountedRef.current) {
                    setIsLoading(false)
                }
                fetchPromiseRef.current = null
            }
        })()

        fetchPromiseRef.current = promise
        return promise
    }, [])

    const refetch = useCallback(() => {
        return fetchData(true)
    }, [fetchData])

    // Cleanup à la destruction du composant
    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
        }
    }, [])

    // Fetch initial
    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Auto-refresh avec visibilité de la page
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                if (!challengeCache.has('challenges') || !challengeCache.has('agentProgress') || !agentCache.has('agentProfile') || !contractCache.has('contracts')) {
                    fetchData()
                }
            }
        }

        // Refresh périodique moins agressif
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                fetchData()
            }
        }, 5 * 60 * 1000) // 5 minutes

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            clearInterval(interval)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [fetchData])

    const clearCache = useCallback(() => {
        challengeCache.clear()
        agentCache.clear()
        contractCache.clear()
    }, [])

    const hasCache = useCallback((key: string) => {
        switch (key) {
            case 'challenges':
            case 'agentProgress':
                return challengeCache.has(key)
            case 'agentProfile':
                return agentCache.has(key)
            case 'contracts':
                return contractCache.has(key)
            default:
                return false
        }
    }, [])

    return {
        challengeData,
        agentProgress,
        agentData,
        contractData,
        isLoading,
        error,
        refetch,
        clearCache,
        hasCache
    }
}