'use client'

import { useCallback, useEffect, useState } from 'react'
import { useWindowsStore } from '@/store/useWindowsStore'
import { useFileSystem, FileNodeFile } from '@/store/useFileSystem'
import { RoleGuard } from '@/components/provider/RoleGuard'
import { APP_REGISTRY } from '@/constants/appRegistry'
import DesktopApp from '@/components/desktop/icons/DesktopApp'
import WindowContainer from '@/components/desktop/windows/WindowContainer'
import FolderExplorer from '@/components/desktop/viewers/FolderExplorer'
import ImageViewer from '@/components/desktop/viewers/ImageViewer'
import FileViewer from '@/components/desktop/viewers/FileViewer'

interface FolderApplicationProps {
    id: string
    name: string
    icon: string | React.ReactNode
    position?: { x: number; y: number }
    selected?: boolean
    onRegister?: (id: string, el: HTMLElement, pos: { x: number; y: number }, size: { width: number; height: number }) => void
    onUnregister?: (id: string) => void
    hideDesktopIcon?: boolean
    requireAuth?: boolean
    roles?: string[]
}

export default function FolderApplication({
    id,
    name,
    icon,
    position,
    selected = false,
    onRegister,
    onUnregister,
    hideDesktopIcon = false,
    requireAuth = false,
    roles = []
}: FolderApplicationProps) {

    // Récupérer les infos du dossier depuis l'appRegistry si disponible
    const folderConfig = APP_REGISTRY[id as keyof typeof APP_REGISTRY]
    const actualRequireAuth = requireAuth || folderConfig?.requireAuth || false
    const actualRoles = roles.length > 0 ? roles : (folderConfig?.roles ? [...folderConfig.roles] : [])

    // 🆕 On génère un ID distinct pour la fenêtre
    const windowId = `folder-${id}`

    const { openWindows, addWindow, updateWindow, removeWindow } = useWindowsStore()
    const { getFileById } = useFileSystem()
    const windowInfo = openWindows.find(w => w.id === windowId)

    const [isOpen, setIsOpen] = useState(false)

    // 🛠 Sync avec le store
    useEffect(() => {
        const open = windowInfo?.isOpen && !windowInfo?.isMinimized
        if (open !== isOpen) setIsOpen(!!open)
    }, [windowInfo, isOpen])

    // ✅ Ouvrir le dossier → créer la fenêtre si besoin
    const openFolder = useCallback(() => {
        if (!windowInfo) {
            addWindow({
                id: windowId,
                title: name,
                icon: icon,
                isOpen: true,
                isMinimized: false,
                position: { x: 100, y: 100 },
                size: { width: 750, height: 500 }
            })
        } else {
            updateWindow(windowId, { isOpen: true, isMinimized: false })
        }
        setIsOpen(true)
    }, [addWindow, updateWindow, windowInfo, windowId, name, icon])

    // ✅ Fermer la fenêtre
    const closeFolder = useCallback(() => {
        removeWindow(windowId)
        setIsOpen(false)
    }, [removeWindow, windowId])

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
                    type="folder"
                    onDoubleClick={openFolder}
                    onRegister={onRegister}
                    onUnregister={onUnregister}
                />
            )}

            {/* --- Fenêtre du dossier --- */}
            <WindowContainer
                id={windowId}
                title={name}
                icon={icon}
                isOpen={isOpen}
                onClose={closeFolder}
                width={750}
                height={500}
                requireAuth={actualRequireAuth}
            >
                {actualRoles.length > 0 ? (
                    <RoleGuard roles={actualRoles}>
                        <FolderExplorer
                            initialPath={id === 'documents' ? 'documents-folder' : id}
                            windowId={windowId}
                        />
                    </RoleGuard>
                ) : (
                    <FolderExplorer
                        initialPath={id === 'documents' ? 'documents-folder' : id}
                        windowId={windowId}
                    />
                )}
            </WindowContainer>

            {/* Rendu des viewers de fichiers pour tous les fichiers du système */}
            {openWindows
                .filter(window => (window.id.startsWith('file-') || window.id.startsWith('image-')) && window.isOpen)
                .map(window => {
                    const isImageWindow = window.id.startsWith('image-')
                    const fileId = isImageWindow ? window.id.replace('image-', '') : window.id.replace('file-', '')
                    const fileData = getFileById(fileId)

                    if (!fileData || fileData.type !== 'file') return null

                    const fileContent = (fileData as FileNodeFile).content || ''
                    const extension = fileData.name.split('.').pop()?.toLowerCase() || 'txt'
                    const isImageFile = ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension)

                    if (isImageFile && isImageWindow) {
                        return (
                            <ImageViewer
                                key={fileId}
                                fileId={fileId}
                                fileName={fileData.name}
                                fileContent={typeof fileContent === 'string' ? fileContent : JSON.stringify(fileContent)}
                                fileIcon={fileData.icon || '/svg/file_image.svg'}
                                isOpen={true}
                                onClose={() => removeWindow(window.id)}
                            />
                        )
                    } else if (!isImageFile && !isImageWindow) {
                        return (
                            <FileViewer
                                key={fileId}
                                fileId={fileId}
                                fileName={fileData.name}
                                fileExtension={extension}
                                fileContent={typeof fileContent === 'string' ? fileContent : JSON.stringify(fileContent)}
                                fileIcon={fileData.icon || '/svg/file_default.svg'}
                                isOpen={true}
                                onClose={() => removeWindow(window.id)}
                            />
                        )
                    }

                    return null // Ne pas rendre si le type ne correspond pas
                })}
        </>
    )
}
