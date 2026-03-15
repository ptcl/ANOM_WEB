'use client'

import { useState, useRef, useEffect } from 'react'
import { useWindowsStore } from '@/store/useWindowsStore'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useResponsiveGrid } from '@/hooks/useResponsiveGrid'
import { useDesktopItems } from '@/hooks/useDesktopItems'
import { DesktopItem } from '@/components/desktop/icons/DesktopItem'
import FolderApplication from '@/components/desktop/applications/FolderApplication'
import FileApplication from '@/components/desktop/applications/FileApplication'
import UniversalContextMenu from '@/components/desktop/ui/UniversalContextMenu'
import { cn } from '@/lib/utils'
import type { IconData } from '@/constants/desktop'
import type { FileNodeFile } from '@/store/useFileSystem'

export default function DesktopPage() {
    const { isMobile, getGridPosition } = useResponsiveGrid()
    const isMobileDevice = useMediaQuery('(max-width: 768px)')
    const iconsRef = useRef<Map<string, IconData>>(new Map())
    const { iconPositions, initializeIconPosition } = useWindowsStore()
    const { desktopApps, userFiles, hiddenApps } = useDesktopItems()

    const [contextTarget, setContextTarget] = useState<{
        id: string
        name: string
        type: 'app' | 'folder' | 'file'
    } | null>(null)

    const [hydrated, setHydrated] = useState(false)

    // Init icon positions with default or grid-based positions
    useEffect(() => {
        if (isMobile) return
        desktopApps.forEach((app, i) => {
            if (!iconPositions[app.id]) {
                const position = app.defaultPosition || getGridPosition(i)
                initializeIconPosition(app.id, position)
            }
        })
    }, [desktopApps, iconPositions, initializeIconPosition, getGridPosition, isMobile])

    useEffect(() => setHydrated(true), [])

    if (!hydrated) return <div className="w-full h-full bg-black/20" />

    /* ----- Mobile ----- */
    if (isMobile) {
        return (
            <section className="desktop-page relative h-full flex flex-col w-full overflow-hidden p-4">
                <div className="grid grid-cols-3 gap-6 justify-items-center">
                    {desktopApps.map((app, i) => {
                        const position = iconPositions[app.id] || getGridPosition(i)

                        if (app.type === 'folder') {
                            return (
                                <FolderApplication
                                    key={app.id}
                                    id={app.id}
                                    name={app.name}
                                    icon={app.icon}
                                    position={position}
                                    selected={false}
                                    onRegister={(id, el, pos, size) =>
                                        iconsRef.current.set(id, { element: el, position: pos, size })
                                    }
                                    onUnregister={(id) => iconsRef.current.delete(id)}
                                />
                            )
                        }

                        const Component = app.component
                        return (
                            <Component
                                key={app.id}
                                position={position}
                                selected={false}
                                onRegister={(id: string, el: HTMLElement, pos: { x: number; y: number }, size: { width: number; height: number }) =>
                                    iconsRef.current.set(id, { element: el, position: pos, size })
                                }
                                onUnregister={(id: string) => iconsRef.current.delete(id)}
                            />
                        )
                    })}
                </div>
            </section>
        )
    }

    const handleContextMenu = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) setContextTarget(null)
    }

    /* ----- Desktop ----- */
    return (
        <UniversalContextMenu target={contextTarget}>
            <section
                className={cn(
                    "desktop-page relative h-full w-full",
                    isMobileDevice && "grid grid-cols-3 gap-3 p-4 overflow-y-auto pb-20"
                )}
                onContextMenu={handleContextMenu}
            >
                {/* System apps */}
                {desktopApps.map((app, i) => {
                    const position = iconPositions[app.id] || getGridPosition(i)

                    if (app.type === 'folder') {
                        return (
                            <DesktopItem key={app.id} id={app.id} name={app.name} icon={app.icon} type="folder" position={position} windowId={`folder-${app.id}`} iconsRef={iconsRef}>
                                <FolderApplication id={app.id} name={app.name} icon={app.icon} position={position} selected={false} hideDesktopIcon />
                            </DesktopItem>
                        )
                    }

                    const Component = app.component
                    return (
                        <DesktopItem key={app.id} id={app.id} name={app.name} icon={app.icon} type="app" position={position} windowId={app.id} iconsRef={iconsRef}>
                            <Component position={position} selected={false} hideDesktopIcon onRegister={() => {}} onUnregister={() => {}} />
                        </DesktopItem>
                    )
                })}

                {/* User files & folders */}
                {userFiles.map((file, i) => {
                    const position = iconPositions[file.id] || getGridPosition(i + desktopApps.length)

                    if (file.type === 'folder') {
                        return (
                            <DesktopItem key={file.id} id={file.id} name={file.name} icon={file.icon || '/svg/folder.svg'} type="folder" position={position} windowId={`folder-${file.id}`} iconsRef={iconsRef}>
                                <FolderApplication id={file.id} name={file.name} icon={file.icon || '/svg/folder.svg'} position={position} selected={false} hideDesktopIcon />
                            </DesktopItem>
                        )
                    }

                    if (file.type === 'file') {
                        const fileNode = file as FileNodeFile
                        return (
                            <DesktopItem key={file.id} id={file.id} name={file.name} icon={file.icon || '/svg/file_default.svg'} type="file" position={position} windowId={`file-${file.id}`} iconsRef={iconsRef}>
                                <FileApplication id={file.id} name={file.name} icon={file.icon || '/svg/file_default.svg'} extension={fileNode.extension || 'txt'} content={fileNode.content || ''} position={position} selected={false} hideDesktopIcon />
                            </DesktopItem>
                        )
                    }

                    return null
                })}

                {/* Hidden apps — window only, no desktop icon (e.g. Settings) */}
                {hiddenApps.map((app) => {
                    const AppComponent = app.component
                    return (
                        <AppComponent
                            key={app.id}
                            id={app.id}
                            name={app.name}
                            icon={app.icon}
                            position={app.defaultPosition}
                            hideDesktopIcon
                            onRegister={() => {}}
                            onUnregister={() => {}}
                        />
                    )
                })}
            </section>
        </UniversalContextMenu>
    )
}
