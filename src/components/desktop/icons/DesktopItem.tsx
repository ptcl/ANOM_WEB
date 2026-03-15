'use client'

import { useCallback } from 'react'
import { useWindowsStore } from '@/store/useWindowsStore'
import DesktopApp from '@/components/desktop/icons/DesktopApp'
import UniversalContextMenu from '@/components/desktop/ui/UniversalContextMenu'
import type { IconData } from '@/constants/desktop'

interface IDesktopItemProps {
    id: string
    name: string
    icon: string | React.ReactNode
    type: 'app' | 'folder' | 'file'
    position: { x: number; y: number }
    windowId: string
    iconsRef: React.MutableRefObject<Map<string, IconData>>
    children?: React.ReactNode
}

export function DesktopItem({ id, name, icon, type, position, windowId, iconsRef, children }: IDesktopItemProps) {
    const { updateWindow, bringToFront } = useWindowsStore()

    const handleOpen = useCallback(() => {
        updateWindow(windowId, { isOpen: true, isMinimized: false })
        bringToFront(windowId)
    }, [updateWindow, bringToFront, windowId])

    const handleRegister = useCallback(
        (iconId: string, el: HTMLElement, pos: { x: number; y: number }, size: { width: number; height: number }) => {
            iconsRef.current.set(iconId, { element: el, position: pos, size })
        },
        [iconsRef]
    )

    const handleUnregister = useCallback(
        (iconId: string) => {
            iconsRef.current.delete(iconId)
        },
        [iconsRef]
    )

    return (
        <div>
            <UniversalContextMenu target={{ id, name, type }}>
                <DesktopApp
                    id={id}
                    name={name}
                    icon={icon}
                    position={position}
                    selected={false}
                    type={type}
                    onDoubleClick={handleOpen}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                />
            </UniversalContextMenu>
            {children}
        </div>
    )
}
