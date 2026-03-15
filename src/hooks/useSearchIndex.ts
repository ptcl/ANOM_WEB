import { useWindowsStore } from '@/store/useWindowsStore'
import { APP_REGISTRY } from '@/constants/appRegistry'

export const useSearchIndex = () => {
    const { openWindows, pinnedApps, updateWindow } = useWindowsStore()

    // Apps du registre
    const apps = Object.values(APP_REGISTRY).map(app => ({
        id: app.id,
        type: 'app',
        name: app.name,
        description: app.description,
        icon: app.icon,
        onSelect: () => {
            updateWindow(app.id, {
                id: app.id,
                title: app.name,
                icon: app.icon,
                isOpen: true,
                isMinimized: false,
            })
        },
    }))

    // Fenêtres déjà ouvertes
    const windows = openWindows.map(w => ({
        id: w.id,
        type: 'window',
        name: w.title,
        description: w.isMinimized ? 'Fenêtre minimisée' : 'Fenêtre active',
        icon: w.icon,
        onSelect: () =>
            updateWindow(w.id, {
                isOpen: true,
                isMinimized: false,
            }),
    }))

    // Apps épinglées
    const pinned = pinnedApps.map(a => ({
        id: a.id,
        type: 'pinned',
        name: a.name,
        description: 'Épinglée à la barre',
        icon: a.icon,
        onSelect: () =>
            updateWindow(a.id, {
                id: a.id,
                title: a.name,
                icon: a.icon,
                isOpen: true,
                isMinimized: false,
            }),
    }))

    return [...apps, ...windows, ...pinned]
}
