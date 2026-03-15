// src/store/timelineStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { api } from '@/lib/axios'
import { isCached } from '@/lib/utils'
import { CACHE_DURATION_SHORT } from '@/constants/desktop'

// Types pour la réponse API
export interface ITimelineEntry {
    entryId: string
    accessCode: string
    name: string
    status: 'COMPLETE' | 'PENDING' | 'LOCKED'
}

export interface ITimelineProgress {
    timelineId: string
    accessCode: string
    name: string
    emblemName: string
    globalStatus: 'DRAFT' | 'DELETED' | 'OPEN' | 'PROGRESS' | 'ARCHIVED' | 'CLOSED' | 'STABILIZED'
    fragments: {
        found: number
        total: number
    }
    status: 'COMPLETE' | 'PENDING' | 'LOCKED'
    entries: ITimelineEntry[]
    code?: {
        targetCode: string[]
    }
}

export interface ITimelineStats {
    total: number
    completed: number
    pending: number
}

interface ITimelineState {
    // Données
    timelines: ITimelineProgress[]
    stats: ITimelineStats | null

    // États
    isLoading: boolean
    isLoadingGlobal: boolean
    error: string | null
    lastFetch: number | null

    // Actions
    loadTimelines: () => Promise<void>
    reset: () => void
}

const initialState = {
    timelines: [] as ITimelineProgress[],
    stats: null as ITimelineStats | null,
    isLoading: false,
    isLoadingGlobal: false,
    error: null as string | null,
    lastFetch: null as number | null,
}

export const useTimelineStore = create<ITimelineState>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                loadTimelines: async () => {
                    const { lastFetch, isLoading, isLoadingGlobal } = get()

                    if (isLoading || isLoadingGlobal) return
                    if (isCached(lastFetch, CACHE_DURATION_SHORT)) return

                    set({ isLoading: true, isLoadingGlobal: true, error: null })

                    try {
                        const response = await api.getAgentTimelines()

                        set({
                            timelines: response.data.data?.timelines || [],
                            stats: response.data.data?.stats || null,
                            isLoading: false,
                            lastFetch: Date.now()
                        })

                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : 'Erreur',
                            isLoading: false
                        })
                    } finally {
                        set({ isLoadingGlobal: false })
                    }
                },

                reset: () => set({ ...initialState }),
            }),
            {
                name: 'timeline-storage',
                partialize: (state) => ({
                    timelines: state.timelines,
                    stats: state.stats,
                    lastFetch: state.lastFetch
                })
            }
        ),
        { name: 'TimelineStore' }
    )
)

// Selectors optimisés
export const selectTimelines = (state: ITimelineState) => ({
    timelines: state.timelines,
    stats: state.stats,
    isLoading: state.isLoading
})

export const selectTimelineStats = (state: ITimelineState) =>
    state.stats || { total: 0, completed: 0, pending: 0 }
