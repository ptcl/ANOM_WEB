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
        // console.log(`Store: Ajout/mise à jour de la fenêtre ${window.id}`, window)
        set((state) => {
            // Si la fenêtre existe déjà, mettre à jour son état
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
        // console.log(`Store: Suppression de la fenêtre ${id}`)
        set((state) => ({
            openWindows: state.openWindows.filter(w => w.id !== id)
        }))
    },

    updateWindow: (id, updates) => {
        // console.log(`Store: Mise à jour de la fenêtre ${id}`, updates)
        set((state) => {
            const windowExists = state.openWindows.some(w => w.id === id)

            if (windowExists) {
                return {
                    openWindows: state.openWindows.map(w =>
                        w.id === id ? { ...w, ...updates } : w
                    )
                }
            } else {
                // Si la fenêtre n'existe pas encore, on la crée avec les valeurs par défaut
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
        
        // Pour déboguer, affichons le nouvel état
        setTimeout(() => {
            const newState = get().openWindows.find(w => w.id === id);
            // console.log(`Nouvel état de la fenêtre ${id} après minimisation:`, newState);
        }, 0);
    },
    addPinnedApp: (app) => set((state) => {
        // Éviter les doublons
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
                    // On ne met à jour que les propriétés fournies
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