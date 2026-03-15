'use client'

import { useMemo, useCallback, useEffect } from 'react'
import { useAgent } from '@/hooks/use-agent'
import { useFileSystem } from '@/store/useFileSystem'
import { useWindowsStore } from '@/store/useWindowsStore'
import { APP_REGISTRY } from '@/constants/appRegistry'
import type { FileNode } from '@/store/useFileSystem'

export function useDesktopItems() {
    const { roles } = useAgent()
    const { getChildren, createFile, getFileById } = useFileSystem()
    const { initializePinnedApps } = useWindowsStore()

    // Desktop-visible apps filtered by user roles
    const desktopApps = useMemo(() => {
        return Object.values(APP_REGISTRY).filter(app => {
            if (app.desktopView === false) return false

            if (app.requireAuth && app.roles && app.roles.length > 0) {
                if (app.visibleWithoutRole) return true
                return app.roles.some(role => roles.includes(role))
            }

            return true
        })
    }, [roles])

    // Hidden apps — no icon on desktop, window only (e.g. Settings)
    const hiddenApps = useMemo(() => {
        return Object.values(APP_REGISTRY).filter(
            app => app.type === 'app' && app.desktopView === false
        )
    }, [])

    // Sync filesystem with APP_REGISTRY folder content
    const syncFilesFromRegistry = useCallback(() => {
        Object.entries(APP_REGISTRY).forEach(([appId, appConfig]) => {
            if (appConfig.type !== 'folder' || !('content' in appConfig)) return

            const folderId = appId === 'documents' ? 'documents-folder' : appId

            if (!getFileById(folderId)) {
                createFile({
                    id: folderId,
                    name: appConfig.name,
                    type: 'folder',
                    parentId: null,
                    icon: typeof appConfig.icon === 'string' ? appConfig.icon : undefined
                })
            }

            if (appConfig.content.files) {
                appConfig.content.files.forEach((file) => {
                    if (!getFileById(file.id)) {
                        createFile({
                            id: file.id,
                            name: file.name,
                            type: 'file',
                            extension: file.extension,
                            content: file.content,
                            parentId: folderId,
                            icon: `/svg/file_${file.extension}.svg`
                        })
                    }
                })
            }

            if (appId === 'documents' && appConfig.content.folders) {
                Object.entries(appConfig.content.folders).forEach(([, folderData]) => {
                    if (!getFileById(folderData.id)) {
                        createFile({
                            id: folderData.id,
                            name: folderData.name,
                            type: 'folder',
                            parentId: appId,
                            icon: '/svg/folder.svg'
                        })

                        folderData.files.forEach((file) => {
                            if (!getFileById(file.id)) {
                                createFile({
                                    id: file.id,
                                    name: file.name,
                                    type: 'file',
                                    extension: file.extension,
                                    content: file.content,
                                    parentId: folderData.id,
                                    icon: `/svg/file_${file.extension}.svg`
                                })
                            }
                        })
                    }
                })
            }
        })
    }, [createFile, getFileById])

    useEffect(() => {
        syncFilesFromRegistry()
    }, [syncFilesFromRegistry])

    // Init pinned apps from registry
    useEffect(() => {
        const pinnedApps = Object.values(APP_REGISTRY)
            .filter(app => app.pinned === true)
            .map(app => ({ id: app.id, name: app.name, icon: app.icon }))

        if (pinnedApps.length > 0) initializePinnedApps(pinnedApps)
    }, [initializePinnedApps])

    // User-created files at root (exclude files belonging to APP_REGISTRY folders)
    const userFiles: FileNode[] = getChildren('root').filter(file => {
        if (file.parentId && APP_REGISTRY[file.parentId as keyof typeof APP_REGISTRY]) {
            return false
        }
        return true
    })

    return { desktopApps, userFiles, hiddenApps }
}
