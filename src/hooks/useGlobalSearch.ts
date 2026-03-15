// src/hooks/useGlobalSearch.ts
import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useWindowsStore } from '@/store/useWindowsStore'
import { APP_REGISTRY } from '@/constants/appRegistry'
import type { ReactNode } from 'react'

export interface SearchItem {
    id: string
    type: 'app' | 'window' | 'folder' | 'file' | 'setting' | 'lore'
    name: string
    description?: string
    icon?: string | ReactNode
    onSelect?: () => void
}

export const useGlobalSearch = () => {
    const { openWindows, pinnedApps } = useWindowsStore()
    const t = useTranslations('commun')

    const staticApps: SearchItem[] = useMemo(() => {
        return Object.values(APP_REGISTRY).map(app => ({
            id: app.id,
            type: 'app' as const,
            name: app.name,
            description: app.description,
            icon: app.icon,
            onSelect: () => { },
        }))
    }, [])

    const windows: SearchItem[] = openWindows.map((w) => ({
        id: w.id,
        type: 'window',
        name: w.title,
        description: w.isMinimized ? t('desktop.window.minimized') : t('desktop.window.active'),
        icon: w.icon,
        onSelect: () => { },
    }))

    const pinned: SearchItem[] = pinnedApps.map((a) => ({
        id: a.id,
        type: 'app',
        name: a.name,
        description: t('desktop.pinned'),
        icon: a.icon,
        onSelect: () => { },
    }))

    const all: SearchItem[] = [...staticApps, ...windows, ...pinned]

    return all
}
