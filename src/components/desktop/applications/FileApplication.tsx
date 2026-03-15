'use client'

import { useCallback, useEffect, useState } from 'react'
import { useWindowsStore } from '@/store/useWindowsStore'
import { useFileSystem, FileNodeFile } from '@/store/useFileSystem'
import DesktopApp from '@/components/desktop/icons/DesktopApp'
import FileViewer from '@/components/desktop/viewers/FileViewer'

interface FileApplicationProps {
    id: string
    name: string
    icon: string
    extension: string
    content?: string | object
    position?: { x: number; y: number }
    selected?: boolean
    onRegister?: (id: string, el: HTMLElement, pos: { x: number; y: number }, size: { width: number; height: number }) => void
    onUnregister?: (id: string) => void
    hideDesktopIcon?: boolean
}

export default function FileApplication({
    id,
    name,
    icon,
    extension,
    content,
    position,
    selected = false,
    onRegister,
    onUnregister,
    hideDesktopIcon = false
}: FileApplicationProps) {
    const windowId = `file-${id}`
    const { openWindows, addWindow, updateWindow, removeWindow } = useWindowsStore()
    const { getFileById } = useFileSystem()
    const [isOpen, setIsOpen] = useState(false)

    const windowInfo = openWindows.find(w => w.id === windowId)

    // Sync avec le store
    useEffect(() => {
        const open = windowInfo?.isOpen && !windowInfo?.isMinimized
        if (open !== isOpen) setIsOpen(!!open)
    }, [windowInfo, isOpen])

    // Ouvrir le fichier
    const openFile = useCallback(() => {
        if (!windowInfo) {
            addWindow({
                id: windowId,
                title: name,
                icon: icon,
                isOpen: true,
                isMinimized: false,
                position: { x: 100, y: 100 },
                size: { width: 800, height: 600 }
            })
        } else {
            updateWindow(windowId, { isOpen: true, isMinimized: false })
        }
        setIsOpen(true)
    }, [addWindow, updateWindow, windowInfo, windowId, name, icon])

    // Fermer le fichier
    const closeFile = useCallback(() => {
        removeWindow(windowId)
        setIsOpen(false)
    }, [removeWindow, windowId])

    // Récupérer les données du fichier
    const fileData = getFileById(id) as FileNodeFile | undefined

    return (
        <>
            {/* --- Icône sur le bureau --- */}
            {!hideDesktopIcon && (
                <DesktopApp
                    id={id}
                    name={name}
                    icon={icon}
                    selected={selected}
                    position={position}
                    type="file"
                    onDoubleClick={openFile}
                    onRegister={onRegister}
                    onUnregister={onUnregister}
                />
            )}

            {/* --- Fenêtre du fichier --- */}
            <FileViewer
                fileId={id}
                fileName={name}
                fileExtension={extension}
                fileContent={fileData?.content || content || ''}
                fileIcon={icon}
                isOpen={isOpen}
                onClose={closeFile}
            />
        </>
    )
}