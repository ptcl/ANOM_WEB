import { AppInfo, WindowInfo } from '@/types/utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Z_INDEX_BASE, Z_INDEX_NORMALIZE_THRESHOLD, getGridConfig } from '@/constants/desktop'

interface IconPosition {
    x: number | 0
    y: number | 0
}

/** Calcule le z-index max parmi les fenêtres ouvertes */
function getMaxZ(windows: WindowInfo[]): number {
    return windows.reduce((max, w) => Math.max(max, w.zIndex ?? Z_INDEX_BASE), Z_INDEX_BASE)
}

type WindowsStore = {
    openWindows: WindowInfo[]
    pinnedApps: AppInfo[]
    iconPositions: Record<string, IconPosition>

    addWindow: (window: WindowInfo) => void
    removeWindow: (id: string) => void
    updateWindow: (id: string, updates: Partial<WindowInfo>) => void
    minimizeWindow: (id: string, minimized: boolean) => void
    updateWindowState: (
        id: string,
        position?: { x: number; y: number },
        size?: { width: number; height: number }
    ) => void
    bringToFront: (id: string) => void
    getNextZIndex: () => number

    addPinnedApp: (app: AppInfo) => void
    removePinnedApp: (id: string) => void
    isPinned: (id: string) => boolean
    initializePinnedApps: (apps: AppInfo[]) => void

    initializeIconPosition: (id: string, position: IconPosition) => void
    updateIconPosition: (id: string, position: IconPosition) => void
    resetIconPositions: () => void

    reorganizeIcons: (apps?: string[]) => void // 👈 nouvelle fonction
}

export const useWindowsStore = create<WindowsStore>()(
    persist(
        (set, get) => ({
            openWindows: [],
            pinnedApps: [],
            iconPositions: {},

            addWindow: (window) => {
                set((state) => {
                    const maxZ = getMaxZ(state.openWindows)
                    const exists = state.openWindows.some((w) => w.id === window.id)
                    if (exists) {
                        return {
                            openWindows: state.openWindows.map((w) =>
                                w.id === window.id ? { ...w, ...window, zIndex: maxZ + 1 } : w
                            ),
                        }
                    }
                    return { openWindows: [...state.openWindows, { ...window, zIndex: maxZ + 1 }] }
                })
            },

            removeWindow: (id) =>
                set((state) => ({
                    openWindows: state.openWindows.filter((w) => w.id !== id),
                })),

            updateWindow: (id, updates) => {
                set((state) => {
                    const exists = state.openWindows.some((w) => w.id === id)
                    if (exists) {
                        return {
                            openWindows: state.openWindows.map((w) =>
                                w.id === id ? { ...w, ...updates } : w
                            ),
                        }
                    } else {
                        const maxZ = getMaxZ(state.openWindows)
                        const newWindow: WindowInfo = {
                            id,
                            title: updates.title || id,
                            icon: updates.icon ?? '/svg/file_default.svg',
                            isOpen: updates.isOpen ?? true,
                            isMinimized: updates.isMinimized ?? false,
                            zIndex: maxZ + 1,
                        }
                        return { openWindows: [...state.openWindows, newWindow] }
                    }
                })
            },

            minimizeWindow: (id, minimized) =>
                set((state) => ({
                    openWindows: state.openWindows.map((w) =>
                        w.id === id ? { ...w, isMinimized: minimized } : w
                    ),
                })),

            updateWindowState: (id, position, size) =>
                set((state) => ({
                    openWindows: state.openWindows.map((w) => {
                        if (w.id === id) {
                            const updates: Partial<WindowInfo> = {}
                            if (position) updates.position = position
                            if (size) updates.size = size
                            return { ...w, ...updates }
                        }
                        return w
                    }),
                })),

            addPinnedApp: (app) =>
                set((state) => {
                    if (state.pinnedApps.some((a) => a.id === app.id)) return state
                    return { pinnedApps: [...state.pinnedApps, app] }
                }),

            removePinnedApp: (id) =>
                set((state) => ({
                    pinnedApps: state.pinnedApps.filter((app) => app.id !== id),
                })),

            isPinned: (id) => get().pinnedApps.some((app) => app.id === id),

            initializePinnedApps: (apps) => {
                const { pinnedApps } = get()
                if (pinnedApps.length === 0) {
                    set({ pinnedApps: apps })
                }
            },

            initializeIconPosition: (id, position) =>
                set((state) => ({
                    iconPositions: {
                        ...state.iconPositions,
                        [id]: state.iconPositions[id] || position,
                    },
                })),

            updateIconPosition: (id, position) =>
                set((state) => ({
                    iconPositions: { ...state.iconPositions, [id]: position },
                })),

            resetIconPositions: () => set({ iconPositions: {} }),

            getNextZIndex: () => {
                return getMaxZ(get().openWindows) + 1
            },

            bringToFront: (id) => {
                set((state) => {
                    const targetWindow = state.openWindows.find(w => w.id === id)
                    if (!targetWindow) return state

                    const maxZ = getMaxZ(state.openWindows)

                    if (targetWindow.zIndex === maxZ) return state

                    if (maxZ >= Z_INDEX_NORMALIZE_THRESHOLD) {
                        const sortedWindows = [...state.openWindows]
                            .sort((a, b) => (a.zIndex ?? Z_INDEX_BASE) - (b.zIndex ?? Z_INDEX_BASE))

                        return {
                            openWindows: sortedWindows.map((w, index) => ({
                                ...w,
                                zIndex: w.id === id ? Z_INDEX_BASE + sortedWindows.length : Z_INDEX_BASE + index
                            }))
                        }
                    }

                    return {
                        openWindows: state.openWindows.map(w =>
                            w.id === id ? { ...w, zIndex: maxZ + 1 } : w
                        )
                    }
                })
            },

            reorganizeIcons: (apps) => {
                const { resetIconPositions, initializeIconPosition } = get()
                resetIconPositions()

                const list = apps ?? Object.keys(get().iconPositions)
                const width = typeof window !== 'undefined' ? window.innerWidth : 1920
                const config = getGridConfig(width)

                list.forEach((id, i) => {
                    const col = i % config.columns
                    const row = Math.floor(i / config.columns)
                    const position = {
                        x: config.startX + col * (config.iconWidth + config.gapX),
                        y: config.startY + row * (config.iconHeight + config.gapY),
                    }
                    initializeIconPosition(id, position)
                })
            },
        }),
        {
            name: 'windows-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.iconPositions = state.iconPositions || {}
                    state.pinnedApps = state.pinnedApps || []
                }
            },
        }
    )
)
