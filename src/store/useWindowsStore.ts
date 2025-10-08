import { AppInfo, WindowInfo } from '@/types/utils'
import { create } from 'zustand'

type WindowsStore = {
    openWindows: WindowInfo[]
    pinnedApps: AppInfo[]
    addWindow: (window: WindowInfo) => void
    removeWindow: (id: string) => void
    updateWindow: (id: string, updates: Partial<WindowInfo>) => void
    minimizeWindow: (id: string, minimized: boolean) => void
    updateWindowState: (id: string, position?: { x: number, y: number }, size?: { width: number, height: number }) => void
    addPinnedApp: (app: AppInfo) => void
    removePinnedApp: (id: string) => void
    updateIconPosition: (id: string, position: { x: number, y: number }) => void
    isPinned: (id: string) => boolean
}

export const useWindowsStore = create<WindowsStore>((set, get) => ({
    openWindows: [],
    pinnedApps: [],

    addWindow: (window) => {
        set((state) => {
            const windowExists = state.openWindows.some(w => w.id === window.id)

            if (windowExists) {
                return {
                    openWindows: state.openWindows.map(w =>
                        w.id === window.id ? { ...w, ...window } : w
                    )
                }
            }

            // Sinon, ajouter la nouvelle fenêtre
            return {
                openWindows: [...state.openWindows, window]
            }
        })
    },

    removeWindow: (id) => {
        set((state) => ({
            openWindows: state.openWindows.filter(w => w.id !== id)
        }))
    },

    updateWindow: (id, updates) => {
        set((state) => {
            const windowExists = state.openWindows.some(w => w.id === id)

            if (windowExists) {
                return {
                    openWindows: state.openWindows.map(w =>
                        w.id === id ? { ...w, ...updates } : w
                    )
                }
            } else {
                const newWindow: WindowInfo = {
                    id,
                    title: updates.title || id,
                    icon: updates.icon || '/file.svg',
                    isOpen: updates.isOpen !== undefined ? updates.isOpen : true,
                    isMinimized: updates.isMinimized !== undefined ? updates.isMinimized : false
                }
                return {
                    openWindows: [...state.openWindows, newWindow]
                }
            }
        })
    },

    minimizeWindow: (id, minimized) => {

        const currentState = get().openWindows.find(w => w.id === id);
        console.log(`État actuel de la fenêtre ${id}:`, currentState);

        set((state) => ({
            openWindows: state.openWindows.map(w =>
                w.id === id ? { ...w, isMinimized: minimized } : w
            )
        }))

    },
    addPinnedApp: (app) => set((state) => {
        if (state.pinnedApps.some(a => a.id === app.id)) {
            return state
        }
        return {
            pinnedApps: [...state.pinnedApps, app]
        }
    }),

    removePinnedApp: (id) => set((state) => ({
        pinnedApps: state.pinnedApps.filter(app => app.id !== id)
    })),

    updateWindowState: (id, position, size) => {
        set((state) => ({
            openWindows: state.openWindows.map(w => {
                if (w.id === id) {
                    const updates: Partial<WindowInfo> = {};
                    if (position) updates.position = position;
                    if (size) updates.size = size;
                    return { ...w, ...updates };
                }
                return w;
            })
        }));
    },

    updateIconPosition: (id, position) => {
        set((state) => ({
            pinnedApps: state.pinnedApps.map(app =>
                app.id === id ? { ...app, position } : app
            )
        }));
    },

    isPinned: (id) => get().pinnedApps.some(app => app.id === id)
}))