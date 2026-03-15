'use client'

import { useState, useCallback, useEffect } from 'react'
import { useWindowsStore } from '@/store/useWindowsStore'
import { useFileSystem, FileNode } from '@/store/useFileSystem'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useAgent } from '@/hooks/use-agent'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ChevronRight, ArrowLeft, ArrowRight, Home, Folder, File, ImageIcon, Code, FileText } from 'lucide-react'

interface FolderExplorerProps {
    initialPath?: string
    windowId: string
}

export default function FolderExplorer({ initialPath = 'documents-folder', windowId }: FolderExplorerProps) {
    const { updateWindow, addWindow, openWindows, bringToFront } = useWindowsStore()
    const { getChildren, getFileById } = useFileSystem()
    const { agentName } = useAgent()
    const isMobile = useMediaQuery('(max-width: 768px)')
    
    const [currentPath, setCurrentPath] = useState(initialPath)
    const [navigationHistory, setNavigationHistory] = useState<string[]>([initialPath])
    const [historyIndex, setHistoryIndex] = useState(0)

    // Récupérer le dossier actuel et son contenu
    const currentFolder = getFileById(currentPath)
    const content = getChildren(currentPath).filter(item => item.type === 'file' || item.type === 'folder')

    // Construire le chemin breadcrumb avec le nom de l'agent comme racine
    const buildBreadcrumb = useCallback((folderId: string): Array<{id: string, name: string, isAgentRoot?: boolean}> => {
        const path: Array<{id: string, name: string, isAgentRoot?: boolean}> = []
        let current = getFileById(folderId)
        
        while (current) {
            path.unshift({ id: current.id, name: current.name })
            if (current.parentId) {
                current = getFileById(current.parentId)
            } else {
                break
            }
        }
        
        // Ajouter le nom de l'agent comme racine principale
        if (path.length > 0) {
            path.unshift({ id: 'agent-root', name: agentName, isAgentRoot: true })
        }
        
        return path
    }, [getFileById, agentName])

    const breadcrumbPath = buildBreadcrumb(currentPath)

    // Navigation vers un dossier
    const navigateTo = useCallback((folderId: string) => {
        if (folderId !== currentPath) {
            setCurrentPath(folderId)
            
            // Ajouter à l'historique
            const newHistory = navigationHistory.slice(0, historyIndex + 1)
            newHistory.push(folderId)
            setNavigationHistory(newHistory)
            setHistoryIndex(newHistory.length - 1)

            // Mettre à jour le titre de la fenêtre
            const folder = getFileById(folderId)
            if (folder) {
                updateWindow(windowId, { title: `📁 ${folder.name}` })
            }
        }
    }, [currentPath, navigationHistory, historyIndex, updateWindow, windowId, getFileById])

    // Navigation précédent/suivant
    const goBack = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1
            setHistoryIndex(newIndex)
            setCurrentPath(navigationHistory[newIndex])
        }
    }, [historyIndex, navigationHistory])

    const goForward = useCallback(() => {
        if (historyIndex < navigationHistory.length - 1) {
            const newIndex = historyIndex + 1
            setHistoryIndex(newIndex)
            setCurrentPath(navigationHistory[newIndex])
        }
    }, [historyIndex, navigationHistory])

    // S'assurer que le chemin initial existe et a du contenu
    useEffect(() => {
        const checkAndSetInitialPath = () => {
            const folder = getFileById(initialPath)
            if (!folder) {
                // Si le dossier n'existe pas encore, attendre un peu
                setTimeout(checkAndSetInitialPath, 100)
                return
            }
            
            // Si on a trouvé le dossier et qu'on est toujours sur le chemin par défaut
            if (currentPath === initialPath) {
                // Déclencher une navigation pour mettre à jour le breadcrumb et le titre
                navigateTo(initialPath)
            }
        }
        
        checkAndSetInitialPath()
    }, [initialPath, getFileById, currentPath, navigateTo])

    // Obtenir l'icône selon le type de fichier
    const getFileIcon = (item: FileNode) => {
        const iconSize = isMobile ? "w-5 h-5" : "w-4 h-4"
        
        if (item.type === 'folder') {
            return <Folder className={`${iconSize} text-blue-400`} />
        }
        
        const fileName = item.name.toLowerCase()
        const extension = fileName.split('.').pop()
        
        switch (extension) {
            case 'txt':
            case 'md':
                return <FileText className={`${iconSize} text-gray-400`} />
            case 'js':
            case 'ts':
            case 'json':
                return <Code className={`${iconSize} text-green-400`} />
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                return <ImageIcon className={`${iconSize} text-purple-400`} />
            default:
                return <File className={`${iconSize} text-gray-400`} />
        }
    }

    // Obtenir le type de fichier pour l'affichage
    const getFileTypeLabel = (item: FileNode) => {
        if (item.type === 'folder') return 'Dossier'
        
        const extension = item.name.split('.').pop()?.toLowerCase()
        switch (extension) {
            case 'txt': return 'Fichier texte'
            case 'md': return 'Fichier Markdown'
            case 'json': return 'Fichier JSON'
            case 'js': return 'Fichier JavaScript'
            case 'ts': return 'Fichier TypeScript'
            case 'png':
            case 'jpg':
            case 'jpeg': return 'Image'
            default: return 'Fichier'
        }
    }

    // Gérer l'ouverture d'un élément
    const handleItemOpen = useCallback((item: FileNode) => {
        if (item.type === 'folder') {
            navigateTo(item.id)
        } else if (item.type === 'file') {
            // Ouvrir le fichier avec le bon viewer selon l'extension
            const extension = item.name.split('.').pop()?.toLowerCase()
            const isImageFile = ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(extension || '')
            
            // Utiliser l'ID correct selon le type de fichier
            const fileWindowId = isImageFile ? `image-${item.id}` : `file-${item.id}`
            
            // Vérifier si une fenêtre existe déjà
            const existingWindow = openWindows.find(w => w.id === fileWindowId)
            
            if (existingWindow) {
                // Réactiver la fenêtre existante et la mettre au premier plan
                updateWindow(fileWindowId, { isOpen: true, isMinimized: false })
                bringToFront(fileWindowId)
            } else {
                // Créer une nouvelle fenêtre selon le type de fichier
                let windowTitle = `📄 ${item.name}`
                let windowIcon = '/svg/file_default.svg'
                
                if (isImageFile) {
                    windowTitle = `🖼️ ${item.name}`
                    windowIcon = '/svg/file_image.svg'
                } else if (['txt', 'md'].includes(extension || '')) {
                    windowTitle = `📝 ${item.name}`
                    windowIcon = `/svg/file_${extension}.svg`
                }
                
                addWindow({
                    id: fileWindowId,
                    title: windowTitle,  
                    icon: windowIcon,
                    isOpen: true,
                    isMinimized: false,
                    position: { x: 200 + Math.random() * 100, y: 200 + Math.random() * 100 },
                    size: { width: 700, height: 500 }
                })
                // S'assurer que la nouvelle fenêtre est au premier plan
                setTimeout(() => bringToFront(fileWindowId), 0)
            }
        }
    }, [navigateTo, updateWindow, addWindow, openWindows, bringToFront])

    return (
        <div className="h-full flex flex-col bg-[var(--background)]">
            {/* Barre de navigation */}
            <div className={`flex items-center border-b border-white/10 bg-white/5 ${isMobile ? 'gap-3 p-4' : 'gap-2 p-3'}`}>
                {/* Boutons précédent/suivant */}
                <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-1'}`}>
                    <button
                        onClick={goBack}
                        disabled={historyIndex <= 0}
                        className={`rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${isMobile ? 'p-2.5' : 'p-1.5'}`}
                        title="Précédent"
                    >
                        <ArrowLeft className={isMobile ? "w-5 h-5" : "w-4 h-4"} />
                    </button>
                    <button
                        onClick={goForward}
                        disabled={historyIndex >= navigationHistory.length - 1}
                        className={`rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${isMobile ? 'p-2.5' : 'p-1.5'}`}
                        title="Suivant"
                    >
                        <ArrowRight className={isMobile ? "w-5 h-5" : "w-4 h-4"} />
                    </button>
                </div>

                {/* Séparateur */}
                <div className={`bg-white/20 ${isMobile ? 'w-px h-8' : 'w-px h-6'}`} />

                {/* Breadcrumb */}
                <Breadcrumb className="flex-1">
                    <BreadcrumbList className="text-white">
                        {breadcrumbPath.map((crumb, index) => (
                            <div key={crumb.id} className="flex items-center">
                                {index > 0 && (
                                    <BreadcrumbSeparator>
                                        <ChevronRight className="w-4 h-4" />
                                    </BreadcrumbSeparator>
                                )}
                                <BreadcrumbItem>
                                    {index === breadcrumbPath.length - 1 ? (
                                        <BreadcrumbPage className="text-white font-medium flex items-center gap-1">
                                            {crumb.isAgentRoot && <Home className="w-3 h-3" />}
                                            {crumb.name}
                                        </BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink 
                                            onClick={() => crumb.isAgentRoot ? null : navigateTo(crumb.id)}
                                            className={`flex items-center gap-1 ${crumb.isAgentRoot ? 'text-blue-300 cursor-default' : 'hover:text-blue-400 cursor-pointer'}`}
                                        >
                                            {crumb.isAgentRoot && <Home className="w-3 h-3" />}
                                            {crumb.name}
                                        </BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                            </div>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Contenu du dossier */}
            <div className="flex-1 p-4 overflow-auto">
                {content.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <Folder className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                            <p>Ce dossier est vide</p>
                        </div>
                    </div>
                ) : (
                    <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"}>
                        {content.map((item) => (
                            <div
                                key={item.id}
                                {...(isMobile 
                                    ? { onClick: () => handleItemOpen(item) } 
                                    : { onDoubleClick: () => handleItemOpen(item) }
                                )}
                                className={`group bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-all duration-200 border border-white/10 hover:border-white/20 ${isMobile ? 'p-3' : 'p-4'}`}
                            >
                                <div className="text-center">
                                    <div className={`flex justify-center ${isMobile ? 'mb-2' : 'mb-3'}`}>
                                        <div className={`rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors ${isMobile ? 'p-2' : 'p-3'}`}>
                                            {getFileIcon(item)}
                                        </div>
                                    </div>
                                    <p className={`text-white font-medium truncate mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                        {item.name}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        {getFileTypeLabel(item)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Barre de statut */}
            <div className="border-t border-white/10 p-2 text-xs text-gray-400 bg-white/5">
                {content.length} élément{content.length !== 1 ? 's' : ''} • {currentFolder?.name || 'Dossier'}
            </div>
        </div>
    )
}