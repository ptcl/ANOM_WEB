'use client'

import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent, } from '@/components/ui/context-menu'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from '@/components/ui/dialog'
import { FilePlus2, RefreshCw, Pin, PinOff, Info, PencilLine, Trash, FolderOpen } from 'lucide-react'
import { useFileSystem } from '@/store/useFileSystem'
import { useWindowsStore } from '@/store/useWindowsStore'
import { APP_REGISTRY } from '@/constants/appRegistry'
import { useState } from 'react'
import NewFileDialog from '@/components/ui/NewFileDialog'
import Image from 'next/image'

interface UniversalContextMenuProps {
    children: React.ReactNode
    target?: {
        id: string
        name: string
        type: 'file' | 'folder' | 'app'
    } | null
    parentId?: string | null
}

export default function UniversalContextMenu({
    children,
    target,
    parentId = 'root',
}: UniversalContextMenuProps) {
    const { deleteFile, createFolder, getFileById } = useFileSystem()
    const { addWindow, updateWindow, reorganizeIcons, addPinnedApp, removePinnedApp, pinnedApps } = useWindowsStore()

    const [isNewFileOpen, setIsNewFileOpen] = useState(false)
    const [infoDialogOpen, setInfoDialogOpen] = useState(false)
    const [infoContent, setInfoContent] = useState('')

    // Ouvrir dossier/fichier/app
    const handleOpen = () => {
        if (!target) return

        if (target.type === 'folder') {
            addWindow({
                id: `folder-${target.id}`,
                title: target.name,
                icon: '/svg/folder.svg',
                isOpen: true,
                isMinimized: false,
            })
        } else if (target.type === 'app') {
            updateWindow(target.id, { isOpen: true, isMinimized: false })
        } else {
            const file = getFileById(target.id)
            if (file) {
                console.log(`📄 Ouvrir fichier "${file.name}"`)
            }
        }
    }

    const handleRename = () => {
        if (!target) return
        const evt = new CustomEvent('startRename', { detail: { id: target.id } })
        window.dispatchEvent(evt)
    }

    const handleDelete = () => {
        if (!target) return

        if (target.type === 'app') {
            alert('Impossible de supprimer une application système')
            return
        }

        if (confirm(`Supprimer "${target.name}" ?`)) {
            deleteFile(target.id)
        }
    }

    const handlePin = () => {
        if (!target || target.type !== 'app') return
        const isCurrentlyPinned = pinnedApps.some(app => app.id === target.id)

        if (isCurrentlyPinned) {
            removePinnedApp(target.id)
        } else {
            const appConfig = APP_REGISTRY[target.id as keyof typeof APP_REGISTRY]
            const appIcon = appConfig?.icon || '/svg/file_default.svg'
            const appName = appConfig?.name || target.name

            addPinnedApp({ id: target.id, name: appName, icon: appIcon })
        }
    }

    const handleInfo = () => {
        if (!target) return

        let info = `**Nom:** ${target.name}\n\n**Type:** ${target.type === 'app' ? 'Application' : target.type === 'folder' ? 'Dossier' : 'Fichier'}\n\n`

        if (target.type === 'app') {
            const appConfig = APP_REGISTRY[target.id as keyof typeof APP_REGISTRY]
            if (appConfig) {
                info += `**Description:** ${appConfig.description || 'Non disponible'}\n\n`
                if (appConfig.requireAuth) {
                    info += `**Authentification requise:** Oui\n\n`
                }
                if (appConfig.roles && appConfig.roles.length > 0) {
                    info += `**Rôles requis:** ${appConfig.roles.join(', ')}\n\n`
                }
                if (appConfig.defaultPosition) {
                    info += `**Position par défaut:** x: ${appConfig.defaultPosition.x}, y: ${appConfig.defaultPosition.y}\n\n`
                }
                if (appConfig.pinned) {
                    info += `**Épinglé par défaut:** Oui`
                }
            }
        } else if (target.type === 'file') {
            const file = getFileById(target.id)
            if (file && file.type === 'file') {
                const extension = file.name.split('.').pop()
                info += `**Extension:** ${extension || 'Aucune'}\n\n`
            }
        } else if (target.type === 'folder') {
            const folder = getFileById(target.id)
            if (folder) {
            }
        }

        setInfoContent(info)
        setInfoDialogOpen(true)
    }

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <div className="w-full h-full">{children}</div>
                </ContextMenuTrigger>

                <ContextMenuContent className="w-56 bg-[var(--background)] border-white/10 text-sm">
                    {target ? (
                        <>
                            <ContextMenuItem onClick={handleOpen} className="flex items-center gap-3 cursor-pointer">
                                <FolderOpen size={16} /> Ouvrir
                            </ContextMenuItem>

                            {target.type === 'app' && (
                                <ContextMenuItem onClick={handlePin} className="flex items-center gap-3 cursor-pointer">
                                    {pinnedApps.some(app => app.id === target.id) ? (
                                        <>
                                            <PinOff size={16} /> Détacher de la barre
                                        </>
                                    ) : (
                                        <>
                                            <Pin size={16} /> Épingler à la barre
                                        </>
                                    )}
                                </ContextMenuItem>
                            )}

                            <ContextMenuItem onClick={handleInfo} className="flex items-center gap-3 cursor-pointer">
                                <Info size={16} /> Informations
                            </ContextMenuItem>

                            {target.type !== 'app' && (
                                <ContextMenuItem onClick={handleRename} className="cursor-pointer">
                                    <PencilLine /> Renommer
                                </ContextMenuItem>
                            )}
                            {target.type !== 'app' && (
                                <ContextMenuItem onClick={handleDelete} className="text-[var(--danger)] cursor-pointer" variant='destructive'>
                                    <Trash color='var(--danger)' /> Supprimer
                                </ContextMenuItem>
                            )}
                            <ContextMenuSeparator />
                        </>
                    ) : (
                        <>
                            <ContextMenuSub>
                                <ContextMenuSubTrigger>
                                    <FilePlus2 size={14} className="mr-2" /> Nouveau
                                </ContextMenuSubTrigger>
                                <ContextMenuSubContent className="bg-[var(--background)] border-white/10">
                                    <ContextMenuItem onClick={() => setIsNewFileOpen(true)}>
                                        📄 Fichier…
                                    </ContextMenuItem>
                                    <ContextMenuItem onClick={() => createFolder('Nouveau dossier', parentId ?? 'root')}>
                                        📁 Dossier
                                    </ContextMenuItem>
                                </ContextMenuSubContent>
                            </ContextMenuSub>

                            <ContextMenuItem onClick={() => reorganizeIcons()}>
                                <RefreshCw size={14} className="mr-2" /> Réorganiser les icônes
                            </ContextMenuItem>

                            <ContextMenuSeparator />
                        </>
                    )}

                    <ContextMenuItem disabled className="opacity-40">
                        Paramètres d’affichage
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            {/* Dialog de création de fichier */}
            <NewFileDialog
                open={isNewFileOpen}
                onClose={() => setIsNewFileOpen(false)}
                parentId={parentId ?? 'root'}
            />

            {/* Dialog d'informations */}
            <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
                <DialogContent className="bg-[#1a1a1a]/95 backdrop-blur-xl border-white/10 shadow-2xl max-w-md">
                    <DialogHeader className="border-b border-white/10 pb-4">
                        <div className="flex items-center gap-3">
                            {target && target.type === 'app' && (
                                <div className="w-8 h-8 flex-shrink-0">
                                    <Image
                                        src={APP_REGISTRY[target.id as keyof typeof APP_REGISTRY]?.icon || '/svg/file_default.svg'}
                                        alt={target.name}
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            <DialogTitle className="text-white text-xl font-semibold">
                                {target?.name || 'Informations'}
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                    <div className="pt-4">
                        <div className="text-white/80 text-sm leading-relaxed space-y-3">
                            {infoContent.split('\n\n').map((line, index) => {
                                if (!line.trim()) return null
                                const parts = line.split('**')
                                return (
                                    <div key={index} className="flex gap-2">
                                        <span className="text-white/60 font-medium min-w-[140px]">
                                            {parts[1] || ''}
                                        </span>
                                        <span className="text-white/90 flex-1">
                                            {parts[2]?.trim() || ''}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
