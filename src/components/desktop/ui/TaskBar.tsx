'use client'

import React, { memo, useEffect, useState } from 'react'
import { useWindowsStore } from '@/store/useWindowsStore'
import { APP_REGISTRY } from '@/constants/appRegistry'
import { Badge } from '@/components/ui/badge'
import CoreMenu from '@/components/desktop/core/CoreMenu'
import AppIconBase from '@/components/desktop/icons/AppIconBase'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/** Composant isolé pour l'horloge — évite le re-render de toute la TaskBar chaque seconde */
const Clock = memo(function Clock({ compact }: { compact?: boolean }) {
    const [currentTime, setCurrentTime] = useState('')

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }))
        }
        updateTime()
        const timer = setInterval(updateTime, 1000)
        return () => clearInterval(timer)
    }, [])

    if (compact) {
        return (
            <div className="text-right text-xs">
                <p className="text-white font-medium">{currentTime}</p>
                <p className="text-white/70">{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center select-none">
            <p className="text-sm">{currentTime}</p>
            <p className="text-xs opacity-70">{new Date().toLocaleDateString('fr-FR')}</p>
        </div>
    )
})

export default function TaskBar() {
    const { openWindows, minimizeWindow, pinnedApps, isPinned, updateWindow, bringToFront } = useWindowsStore()
    const isMobile = useMediaQuery('(max-width: 768px)')

    const handleOpenApp = (id: string) => {
        // Pour les dossiers, l'ID de la fenêtre est "folder-{id}"
        const appConfig = APP_REGISTRY[id as keyof typeof APP_REGISTRY]
        const windowId = appConfig?.type === 'folder' ? `folder-${id}` : id

        const appWindow = openWindows.find((w) => w.id === windowId && w.isOpen)
        if (appWindow) {
            if (appWindow.isMinimized) {
                minimizeWindow(windowId, false)
                bringToFront(windowId)
            } else {
                minimizeWindow(windowId, true)
            }
        } else {
            if (appConfig) {
                updateWindow(windowId, {
                    isOpen: true,
                    isMinimized: false,
                    title: appConfig.name,
                    icon: appConfig.icon,
                })
                bringToFront(windowId)
            }
        }
    }

    const handleMinimizeWindow = (id: string) => {
        const win = openWindows.find((w) => w.id === id)
        if (win) {
            if (win.isMinimized) {
                minimizeWindow(id, false)
                bringToFront(id)
            } else {
                minimizeWindow(id, true)
            }
        }
    }

    const renderPinnedApp = (app: typeof pinnedApps[number]) => {
        const win = openWindows.find((w) => w.id === app.id && w.isOpen)
        const isActive = !!win && !win.isMinimized
        const isMinimized = !!win && win.isMinimized

        const appConfig = APP_REGISTRY[app.id as keyof typeof APP_REGISTRY]
        const displayName = appConfig?.name || app.name
        const displayIcon = appConfig?.icon || app.icon

        return (
            <AppIconBase
                key={app.id}
                id={app.id}
                name={displayName}
                icon={displayIcon}
                isActive={isActive}
                isMinimized={isMinimized}
                onClick={() => handleOpenApp(app.id)}
                variant="taskbar"
            />
        )
    }

    // --- 🖥️ VERSION DESKTOP ---
    if (!isMobile) {
        return (
            <section className="w-full h-14 bg-[#737373]/30 border-t border-white/20 backdrop-blur-xs flex items-center justify-between px-4 relative">

                {/* 🎯 Zone centrale : Start + Apps centrés */}
                <section className="flex-1 flex justify-center items-center space-x-3">
                    {/* Bouton "Start" au tout début du groupe */}
                    <CoreMenu />

                    {pinnedApps.map(renderPinnedApp)}

                    {openWindows
                        .filter((w) => w.isOpen && !isPinned(w.id))
                        .map((w) => {
                            // Gérer les IDs de dossiers (folder-xxx) et les apps normales
                            let appConfig = APP_REGISTRY[w.id as keyof typeof APP_REGISTRY]

                            // Si pas trouvé et que l'ID commence par "folder-", essayer sans le préfixe
                            if (!appConfig && w.id.startsWith('folder-')) {
                                const folderId = w.id.replace('folder-', '')
                                appConfig = APP_REGISTRY[folderId as keyof typeof APP_REGISTRY]
                            }

                            const displayName = appConfig?.name || w.title
                            const displayIcon = appConfig?.icon || w.icon

                            return (
                                <AppIconBase
                                    key={w.id}
                                    id={w.id}
                                    name={displayName}
                                    icon={displayIcon}
                                    isActive={!w.isMinimized}
                                    isMinimized={w.isMinimized}
                                    onClick={() => handleMinimizeWindow(w.id)}
                                    variant="taskbar"
                                />
                            )
                        })}
                </section>

                <section className="absolute right-4 flex items-center gap-4">
                    <Clock />
                </section>

            </section>
        )
    }

    // --- 📱 VERSION MOBILE ---
    const openWindowsList = openWindows.filter(w => w.isOpen)

    return (
        <>
            {/* TaskBar compacte toujours visible */}
            <section className="fixed bottom-0 left-0 right-0 h-14 bg-[#737373]/30 border-t border-white/20 backdrop-blur-lg z-50 flex items-center justify-between px-3">
                {/* Zone gauche : CoreMenu + Apps actives */}
                <div className="flex items-center gap-2 flex-1">
                    <CoreMenu />

                    {/* Apps épinglées */}
                    {pinnedApps.slice(0, 3).map(renderPinnedApp)}

                    {/* Indicateur d'autres fenêtres ouvertes */}
                    {openWindowsList.length > 3 && (
                        <Badge
                            variant="secondary"
                            className="h-8 px-2 text-xs bg-white/10 hover:bg-white/20"
                        >
                            +{openWindowsList.length - 3}
                        </Badge>
                    )}
                </div>

                <div className="flex items-center">
                    <Clock compact />
                </div>
            </section>
        </>
    )
}
