import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/axios'
import { isCached } from '@/lib/utils'
import { CACHE_DURATION_DEFAULT } from '@/constants/desktop'
import type { IAgent, IAgentHistory } from '@/types/agent'
import type { ITheme } from '@/types/setting'
import { AxiosError } from 'axios'

interface IAgentStore {
    agent: IAgent | null
    agentTheme: ITheme[] | null
    history: IAgentHistory[]
    isLoading: boolean
    error: string | null
    lastFetch: number | null
    fetchAgent: (forceReload?: boolean) => Promise<void>
    updateAgent: (data: Record<string, unknown>) => Promise<boolean>
    clearAgent: () => void
    redeemCode: (code: string) => Promise<{ success: boolean; error?: string }>
    fetchAgentTheme: () => Promise<void>
    fetchHistory: (forceReload?: boolean) => Promise<void>

    getRoles: () => string[]
    isFounder: () => boolean
    isEmissary: () => boolean
    isArchitect: () => boolean
    isOracle: () => boolean
    isEcho: () => boolean
    getAgentName: () => string
    getClearanceLevel: () => number
    getHistory: () => IAgentHistory[]
}

const initialState = {
    agent: null as IAgent | null,
    agentTheme: null as ITheme[] | null,
    history: [] as IAgentHistory[],
    isLoading: false,
    error: null as string | null,
    lastFetch: null as number | null,
}

export const useAgentStore = create<IAgentStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            fetchAgent: async (forceReload = false) => {
                const { lastFetch, isLoading } = get()
                if (isLoading) return
                if (!forceReload && isCached(lastFetch, CACHE_DURATION_DEFAULT)) return

                set({ isLoading: true, error: null })
                try {
                    const token = localStorage.getItem('protocol_token')
                    if (!token) {
                        set({ isLoading: false })
                        return
                    }
                    const res = await api.getAgentProfile({
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    if (res.data.success && res.data.data) {
                        set({ agent: res.data.data, isLoading: false, error: null, lastFetch: Date.now() })
                    } else {
                        set({ agent: null, isLoading: false, error: 'Profil introuvable' })
                    }
                } catch (err) {
                    set({
                        agent: null,
                        isLoading: false,
                        error: (err as AxiosError<{ message?: string }>).response?.data?.message || 'Erreur réseau',
                    })
                }
            },

            clearAgent: () => {
                localStorage.removeItem('protocol_token')
                set({ ...initialState })
            },

            updateAgent: async (data: Record<string, unknown>) => {
                try {
                    const res = await api.updateAgent(data)
                    if (res.data.success) {
                        await get().fetchAgent(true)
                        return true
                    }
                    return false
                } catch {
                    return false
                }
            },

            redeemCode: async (code: string) => {
                try {
                    const res = await api.postCodeReward({ code })
                    if (res.data.success) {
                        await get().fetchAgent(true)
                        return { success: true }
                    }
                    return { success: false, error: res.data.message }
                } catch (err) {
                    const axiosError = err as AxiosError<{ message?: string }>
                    const errorMessage = axiosError.response?.data?.message
                    return { success: false, error: errorMessage }
                }
            },

            fetchAgentTheme: async () => {
                try {
                    const res = await api.getAgentTheme({
                        headers: { Authorization: `Bearer ${localStorage.getItem('protocol_token')}` },
                    })
                    if (res.data.success) {
                        set({ agentTheme: res.data.data })
                    }
                } catch {
                    // Silent fail — theme is non-critical
                }
            },

            fetchHistory: async (forceReload = false) => {
                const { history } = get()
                if (history.length > 0 && !forceReload) return

                try {
                    const res = await api.getAgentHistory()
                    if (res.data.success) {
                        set({ history: res.data.data })
                    }
                } catch {
                    // Silent fail — history is non-critical
                }
            },

            getRoles: () => get().agent?.protocol?.roles?.map(r => r.roleId) || [],
            isFounder: () => get().agent?.protocol?.roles?.some(r => r.roleId === 'FOUNDER') || false,
            isEmissary: () => get().agent?.protocol?.roles?.some(r => r.roleId === 'EMISSARY') || false,
            isArchitect: () => get().agent?.protocol?.roles?.some(r => r.roleId === 'ARCHITECT') || false,
            isOracle: () => get().agent?.protocol?.roles?.some(r => r.roleId === 'ORACLE') || false,
            isEcho: () => get().agent?.protocol?.roles?.some(r => r.roleId === 'ECHO') || false,
            getAgentName: () => get().agent?.protocol?.agentName || 'Unknown',
            getClearanceLevel: () => get().agent?.protocol?.clearanceLevel || 0,
            getHistory: () => get().history,
            getAgentTheme: () => get().agentTheme,
        }),
        {
            name: 'agent-storage',
            partialize: (state) => ({
                agent: state.agent,
                lastFetch: state.lastFetch,
            }),
        }
    )
)

// Helper pour reset manuel
export const invalidateAgentCache = () => {
    useAgentStore.getState().clearAgent()
}
