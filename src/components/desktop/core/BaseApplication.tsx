'use client'

import { useCallback, ReactNode } from 'react'
import { useWindowsStore } from '@/store/useWindowsStore'
import WindowContainer from '@/components/desktop/windows/WindowContainer'
import { APP_REGISTRY } from '@/constants/appRegistry'

interface BaseApplicationProps {
    appId: string
    children: ReactNode
    width?: number
    height?: number
    onTokenLoad?: (iframe: HTMLIFrameElement) => void
}

export default function BaseApplication({ appId, children, width = 800, height = 600, onTokenLoad }: BaseApplicationProps) {
    const appConfig = APP_REGISTRY[appId]
    const { openWindows, removeWindow } = useWindowsStore()

    const handleClose = useCallback(() => {
        if (appConfig) removeWindow(appConfig.id)
    }, [removeWindow, appConfig])

    if (!appConfig) {
        return null
    }

    const { id, name, icon } = appConfig
    const appWindow = openWindows.find(w => w.id === id)
    const isWindowOpen = appWindow?.isOpen && !appWindow?.isMinimized

    if (!isWindowOpen) return null

    return (
        <WindowContainer id={id} title={name} icon={icon} isOpen={isWindowOpen} onClose={handleClose} width={width} height={height} requireAuth={appConfig.requireAuth}>
            {children}
        </WindowContainer>
    )
}
