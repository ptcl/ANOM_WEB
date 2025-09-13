'use client'

import { useState, useCallback, useEffect } from 'react'
import { useWindowsStore } from '@/store/useWindowsStore'
import WindowContainer from '../WindowContainer'
import DesktopIcon from '../DesktopIcon'

interface DashboardIconProps {
    position?: { x: number, y: number }
    selected?: boolean
    onRegister?: (id: string, element: HTMLElement, position: { x: number, y: number }, size: { width: number, height: number }) => void
    onUnregister?: (id: string) => void
}

export default function DashboardIcon({ position, selected = false, onRegister, onUnregister }: DashboardIconProps) {
    const [isWindowOpen, setIsWindowOpen] = useState(false)
    const { openWindows, updateWindow, removeWindow, addPinnedApp, isPinned } = useWindowsStore()

    useEffect(() => {
        const dashboardId = 'dashboard'
        if (!isPinned(dashboardId)) {
            addPinnedApp({
                id: dashboardId,
                name: 'Protocol Dashboard',
                icon: '/svg/dashboard_ico.svg'
            })
        }
    }, [addPinnedApp, isPinned])

    const dashboardWindow = openWindows.find(w => w.id === 'dashboard')

    useEffect(() => {
        if (dashboardWindow) {
            const shouldBeOpen = dashboardWindow.isOpen && !dashboardWindow.isMinimized

            if (isWindowOpen !== shouldBeOpen) {
                // console.log(`DashboardIcon: Mise à jour de l'état local isWindowOpen à ${shouldBeOpen} (isOpen: ${dashboardWindow.isOpen}, isMinimized: ${dashboardWindow.isMinimized})`)
                setIsWindowOpen(shouldBeOpen)
            }
        } else if (isWindowOpen) {
            // console.log(`DashboardIcon: Fenêtre non trouvée dans le store, fermeture de la fenêtre locale`)
            setIsWindowOpen(false)
        }
    }, [dashboardWindow, isWindowOpen])

    const handleOpenDashboard = useCallback(() => {
        updateWindow('dashboard', { isOpen: true, isMinimized: false });
        setIsWindowOpen(true)
    }, [updateWindow])

    const handleCloseDashboard = useCallback(() => {
        removeWindow('dashboard');
        setIsWindowOpen(false)
    }, [removeWindow])

    return (
        <>
            <DesktopIcon id='dashboard' name="Protocol Dashboard" icon="/svg/dashboard_ico.svg" onDoubleClick={handleOpenDashboard} pinned={true} position={position} selected={selected} onRegister={onRegister} onUnregister={onUnregister} />
            <WindowContainer id="dashboard" title="Protocol Dashboard" icon="/svg/dashboard_ico.svg" isOpen={isWindowOpen} onClose={handleCloseDashboard} width={800} height={600} requireAuth={true}>
                <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <iframe src="/desktop/dashboard" className="w-full h-full border-0" title="Protocol Dashboard" />
                    </div>
                </div>
            </WindowContainer>
        </>
    )
}
