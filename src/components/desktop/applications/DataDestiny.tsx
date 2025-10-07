'use client'

import { useState, useCallback, useEffect } from 'react'
import { useWindowsStore } from '@/store/useWindowsStore'
import WindowContainer from '../WindowContainer'
import DesktopIcon from '../DesktopIcon'

interface DataDestinyProps {
    position?: { x: number, y: number }
    selected?: boolean
    onRegister?: (id: string, element: HTMLElement, position: { x: number, y: number }, size: { width: number, height: number }) => void
    onUnregister?: (id: string) => void
}

export default function DataDestiny({ position, selected = false, onRegister, onUnregister }: DataDestinyProps) {
    const APP_ID = 'dataDestiny';
    const APP_NAME = 'Data Destiny';
    const APP_ICON = '/svg/dataDestiny.svg';

    const { openWindows, updateWindow, removeWindow, isPinned } = useWindowsStore()

    const [isWindowOpen, setIsWindowOpen] = useState(() => {
        const existingWindow = openWindows.find(w => w.id === APP_ID);
        return existingWindow ? (existingWindow.isOpen && !existingWindow.isMinimized) : false;
    });

    // Supprimer ou commenter l'effet d'auto-épinglage si vous ne voulez pas que l'application soit épinglée
    /*
    useEffect(() => {
        if (!isPinned(APP_ID)) {
            console.log(`TestIcon: Épinglage automatique de ${APP_ID}`);
            addPinnedApp({
                id: APP_ID,
                name: APP_NAME,
                icon: APP_ICON
            });
        }
    }, [APP_ID, addPinnedApp, isPinned]);
    */

    useEffect(() => {
        const appWindow = openWindows.find(w => w.id === APP_ID);

        if (appWindow) {
            const shouldBeOpen = appWindow.isOpen && !appWindow.isMinimized;

            if (isWindowOpen !== shouldBeOpen) {
                setIsWindowOpen(shouldBeOpen);
            }
        }
    }, [APP_ID, openWindows, isWindowOpen]);

    const handleOpenWindow = useCallback(() => {
        updateWindow(APP_ID, { isOpen: true, isMinimized: false });
        setIsWindowOpen(true);
    }, [APP_ID, updateWindow]);

    const handleCloseWindow = useCallback(() => {
        removeWindow(APP_ID);
        setIsWindowOpen(false);
    }, [APP_ID, removeWindow]);

    return (
        <>
            <DesktopIcon id={APP_ID} name={APP_NAME} icon={APP_ICON} onDoubleClick={handleOpenWindow} pinned={isPinned(APP_ID)} position={position} selected={selected} onRegister={onRegister} onUnregister={onUnregister} />
            <WindowContainer id={APP_ID} title={APP_NAME} icon={APP_ICON} isOpen={isWindowOpen} onClose={handleCloseWindow} width={800} height={600} requireAuth={true}>
                <div className="h-full flex flex-col">
                    <div className="flex-1 overflow-auto">
                        <iframe
                            src="https://data.destinysets.com/"
                            className="w-full h-full border-0"
                            title="Test Application"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            loading="lazy"
                        />
                    </div>
                </div>
            </WindowContainer>
        </>
    );
}