'use client'

import { useCallback } from 'react'
import { useWindowsStore } from '@/store/useWindowsStore'
import BaseApplication from '@/components/desktop/core/BaseApplication'
import DesktopApp from '@/components/desktop/icons/DesktopApp'
import { Settings } from 'lucide-react'

interface SettingsApplicationProps {
    position?: { x: number; y: number }
    selected?: boolean
    onRegister?: (id: string, el: HTMLElement, pos: { x: number; y: number }, size: { width: number; height: number }) => void
    onUnregister?: (id: string) => void
    hideDesktopIcon?: boolean
}

export default function SettingsApplication({ position, selected = false, onRegister, onUnregister, hideDesktopIcon = false }: SettingsApplicationProps) {
    const id = 'settings'
    const icon = <Settings />
    const name = 'Settings'

    const { updateWindow } = useWindowsStore()

    // Ouvrir la fenêtre
    const handleOpen = useCallback(() => {
        updateWindow(id, { isOpen: true, isMinimized: false })
    }, [updateWindow])

    return (
        <>
            {/* Icône du bureau */}
            {!hideDesktopIcon && (
                <DesktopApp
                    id={id}
                    name={name}
                    icon={icon}
                    pinned={false}
                    position={position}
                    selected={selected}
                    onDoubleClick={handleOpen}
                    onRegister={onRegister}
                    onUnregister={onUnregister}
                    appDescription="Paramètres système et configuration"
                    appVersion="1.0.0"
                />
            )}

            {/* Fenêtre */}
            <BaseApplication appId={id} width={900} height={700}>
                <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <iframe
                            src="/desktop/settings"
                            className="w-full h-full border-0"
                            title="Paramètres"
                            onLoad={(e) => {
                                const iframe = e.currentTarget as HTMLIFrameElement
                                const token = localStorage.getItem('protocol_token')
                                if (iframe?.contentWindow && token) {
                                    iframe.contentWindow.postMessage({ type: 'AUTH_TOKEN', token }, window.location.origin)
                                }
                            }}
                        />
                    </div>
                </div>
            </BaseApplication>
        </>
    )
}