'use client'

import { useCallback, useEffect, useState } from 'react'
import { useWindowsStore } from '@/store/useWindowsStore'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import WindowContainer from '@/components/desktop/windows/WindowContainer'
import Image from 'next/image'
import { ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImageViewerProps {
    fileId: string
    fileName: string
    fileContent: string
    fileIcon: string
    isOpen: boolean
    onClose: () => void
}

export default function ImageViewer({
    fileId,
    fileName,
    fileContent,
    fileIcon,
    isOpen,
    onClose
}: ImageViewerProps) {
    const windowId = `image-${fileId}`
    const { openWindows, addWindow, removeWindow } = useWindowsStore()
    const windowInfo = openWindows.find(w => w.id === windowId)
    const isMobile = useMediaQuery('(max-width: 768px)')

    const [zoom, setZoom] = useState(100)
    const [rotation, setRotation] = useState(0)

    // Créer la fenêtre si elle n'existe pas
    useEffect(() => {
        if (isOpen && !windowInfo) {
            addWindow({
                id: windowId,
                title: `🖼️ ${fileName}`,
                icon: fileIcon,
                isOpen: true,
                isMinimized: false,
                position: { x: 150, y: 150 },
                size: { width: 800, height: 600 }
            })
        }
    }, [isOpen, windowInfo, addWindow, windowId, fileName, fileIcon])



    // Fermer la fenêtre
    const handleClose = useCallback(() => {
        removeWindow(windowId)
        onClose()
    }, [removeWindow, windowId, onClose])

    // Contrôles d'image
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 500))
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25))
    const handleRotate = () => setRotation(prev => (prev + 90) % 360)
    const handleReset = () => {
        setZoom(100)
        setRotation(0)
    }

    // Télécharger l'image
    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = fileContent
        link.download = fileName
        link.click()
    }

    if (!isOpen || !windowInfo?.isOpen || windowInfo?.isMinimized) {
        return null
    }

    return (
        <WindowContainer
            id={windowId}
            title={`🖼️ ${fileName}`}
            icon={fileIcon}
            isOpen={isOpen}
            onClose={handleClose}
            width={800}
            height={600}
        >
            <div className="h-full flex flex-col bg-black/90">
                {/* Barre d'outils adaptée mobile/desktop */}
                <div className={`flex items-center justify-between bg-black/50 border-b border-white/10 ${isMobile ? 'p-2' : 'p-3'}`}>
                    <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2'}`}>
                        <Button 
                            variant="ghost" 
                            size={isMobile ? "default" : "sm"}
                            onClick={handleZoomOut}
                            className={`text-white hover:bg-white/10 ${isMobile ? 'h-10 w-10 p-0' : ''}`}
                        >
                            <ZoomOut className={isMobile ? "w-5 h-5" : "w-4 h-4"} />
                        </Button>
                        <span className={`text-white text-center ${isMobile ? 'text-base min-w-[70px]' : 'text-sm min-w-[60px]'}`}>
                            {zoom}%
                        </span>
                        <Button 
                            variant="ghost" 
                            size={isMobile ? "default" : "sm"}
                            onClick={handleZoomIn}
                            className={`text-white hover:bg-white/10 ${isMobile ? 'h-10 w-10 p-0' : ''}`}
                        >
                            <ZoomIn className={isMobile ? "w-5 h-5" : "w-4 h-4"} />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size={isMobile ? "default" : "sm"}
                            onClick={handleRotate}
                            className={`text-white hover:bg-white/10 ${isMobile ? 'h-10 w-10 p-0' : ''}`}
                        >
                            <RotateCw className={isMobile ? "w-5 h-5" : "w-4 h-4"} />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size={isMobile ? "default" : "sm"}
                            onClick={handleReset}
                            className={`text-white hover:bg-white/10 ${isMobile ? 'h-10 px-3' : 'text-xs'}`}
                        >
                            Reset
                        </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={handleDownload}
                            className="text-white hover:bg-white/10"
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Zone d'affichage de l'image */}
                <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
                    <div 
                        className="relative transition-transform duration-200 ease-out"
                        style={{ 
                            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                            transformOrigin: 'center'
                        }}
                    >
                        <Image
                            src={fileContent}
                            alt={fileName}
                            width={600}
                            height={400}
                            className="max-w-none rounded-lg shadow-2xl"
                            style={{
                                objectFit: 'contain',
                                maxWidth: 'none',
                                maxHeight: 'none'
                            }}
                            onError={(e) => {
                                // Fallback en cas d'erreur de chargement
                                const target = e.target as HTMLImageElement
                                target.src = '/img/image-placeholder.png'
                            }}
                        />
                    </div>
                </div>

                {/* Informations sur l'image */}
                <div className="p-3 bg-black/50 border-t border-white/10 text-white text-xs">
                    <div className="flex justify-between items-center">
                        <span>{fileName}</span>
                        <span>Zoom: {zoom}% | Rotation: {rotation}°</span>
                    </div>
                </div>
            </div>
        </WindowContainer>
    )
}