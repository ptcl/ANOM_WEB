'use client'

import { useState, useEffect, useRef, ReactNode, useCallback } from 'react'
import Image from 'next/image'
import { X, Minus, Square } from 'lucide-react'
import { useWindowsStore } from '@/store/useWindowsStore'
import { useResize } from '../provider/ResizeProvider'
import { useDrag } from '../provider/DragProvider'
import { useAuthentication } from '@/hooks/useAuthentication'

interface WindowContainerProps {
  id?: string
  title: string
  icon?: string
  isOpen?: boolean
  onClose?: () => void
  children?: ReactNode
  width?: number
  height?: number
  requireAuth?: boolean
}

export default function WindowContainer({ id = Math.random().toString(36).substr(2, 9), title, icon = '/file.svg', isOpen, onClose, children, width = 800, height = 600, requireAuth = false }: WindowContainerProps) {
  // ✅ Appel simple et direct du hook - pas de logique complexe
  const { isAuthenticated, isLoading } = useAuthentication()
  const { openWindows, addWindow, removeWindow, minimizeWindow, updateWindowState } = useWindowsStore()
  const windowInfo = openWindows.find(w => w.id === id)
  const [isMinimized, setIsMinimized] = useState(windowInfo?.isMinimized || false)
  const [position, setPosition] = useState(windowInfo?.position || { x: 50, y: 50 })
  const [size, setSize] = useState(windowInfo?.size || { width, height })
  const { isResizing, startResize } = useResize()
  const { isDragging, startDrag } = useDrag()
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMinimize = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsMinimized(true)
    minimizeWindow(id, true)
  }, [id, minimizeWindow]);

  const handleMaximise = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    const externalRoutes: Record<string, string> = {
      'dataDestiny': 'https://data.destinysets.com/',
    };

    if (externalRoutes[id]) {
      window.open(externalRoutes[id], '_blank');
      return;
    }

    const formatPagePath = (id: string) => {
      return id.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    };

    const pagePath = `/desktop/${formatPagePath(id)}`;

    window.location.href = pagePath;
  }, [id]);

  const handleClose = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    removeWindow(id)
    if (onClose) {
      onClose()
    }
  }, [id, removeWindow, onClose]);

  const handleMouseDown = useCallback((e: React.PointerEvent) => {
    startDrag(
      e,
      id,
      { ...position },
      (newPosition) => {
        setPosition(newPosition)
        updateWindowState(id, newPosition)
      }
    )
  }, [id, position, startDrag, updateWindowState]);

  const handleResizeStart = useCallback((e: React.PointerEvent, direction: { x: number, y: number }) => {
    startResize(
      e,
      direction,
      id,
      { ...size },
      { ...position },
      (newPosition, newSize) => {
        setSize(newSize)
        setPosition(newPosition)
        updateWindowState(id, newPosition, newSize)
      }
    )
  }, [id, position, size, startResize, updateWindowState]);

  useEffect(() => {
    if (windowInfo) {
      setIsMinimized(windowInfo.isMinimized);
    }
  }, [windowInfo]);

  useEffect(() => {
    if (isOpen) {
      addWindow({
        id,
        title,
        icon,
        isOpen: true,
        isMinimized,
        position,
        size
      })
    }
  }, [id, title, icon, isOpen, isMinimized, position, size, addWindow]);

  useEffect(() => {
    const handleMaximizeEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string }>;
      // Vérifier si cet événement concerne cette fenêtre
      if (customEvent.detail && customEvent.detail.id === id) {
        handleMaximise();
      }
    };

    window.addEventListener('maximize-window', handleMaximizeEvent);

    return () => {
      window.removeEventListener('maximize-window', handleMaximizeEvent);
    };
  }, [id, handleMaximise]);

  const renderContent = () => {
    // ✅ Vérification auth simplifiée - pas de state complexe
    if (requireAuth) {
      if (isLoading) {
        return (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )
      }

      if (!isAuthenticated) {
        return (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="text-red-500 mb-4">Vous devez être connecté pour accéder à ce contenu.</div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition" onClick={() => window.location.href = '/login'}>
              Se connecter
            </button>
          </div>
        )
      }
    }

    return children
  }

  if (!isOpen) {
    return null
  }

  if (isMinimized) {
    return <div style={{ display: 'none' }} />;
  }

  return (
    <div ref={windowRef} className="bg-[var(--window)] border-2 min-w-[900px] min-h-[600px]  border-[var(--window-border)] rounded shadow-xl overflow-hidden flex flex-col relative" style={{ width: `${size.width}px`, height: `${size.height}px`, position: 'absolute', top: `${position.y}px`, left: `${position.x}px`, transform: isDragging ? 'scale(1.02)' : 'scale(1)', transition: isDragging || isResizing ? 'none' : 'transform 0.1s', zIndex: 50 }}>
      <div className="bg-[var(--window)] px-4 py-2 flex items-center justify-between cursor-move select-none" onPointerDown={handleMouseDown}>
        <div className="text-white font-medium flex items-center">
          <Image src={icon} alt="" width={24} height={24} className="mr-4" />
          {title}
        </div>
        <div className="flex items-center gap-6 z-20 relative">
          <button className="text-gray-400 hover:text-white focus:outline-none cursor-pointer" onClick={handleMinimize}>
            <Minus size={16} />
          </button>
          <button className="text-gray-400 hover:text-white focus:outline-none cursor-pointer" onClick={handleMaximise}>
            <Square size={16} />
          </button>
          <button className="text-gray-400 hover:text-red-500 focus:outline-none cursor-pointer" onClick={handleClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      <div className="resize-handle absolute bottom-0 right-0 w-2 h-2 cursor-se-resize" onPointerDown={(e) => handleResizeStart(e, { x: 1, y: 1 })} />
      <div className="resize-handle absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize" onPointerDown={(e) => handleResizeStart(e, { x: -1, y: 1 })} />
      <div className="resize-handle absolute top-0 right-0 w-2 h-2 cursor-ne-resize" onPointerDown={(e) => handleResizeStart(e, { x: 1, y: -1 })} />
      <div className="resize-handle absolute top-0 left-0 w-2 h-2 cursor-nw-resize" onPointerDown={(e) => handleResizeStart(e, { x: -1, y: -1 })} />
      <div className="resize-handle absolute right-0 top-10 bottom-10 w-1 cursor-e-resize" onPointerDown={(e) => handleResizeStart(e, { x: 1, y: 0 })} />
      <div className="resize-handle absolute left-0 top-10 bottom-10 w-1 cursor-w-resize" onPointerDown={(e) => handleResizeStart(e, { x: -1, y: 0 })} />
      <div className="resize-handle absolute bottom-0 left-10 right-10 h-1 cursor-s-resize" onPointerDown={(e) => handleResizeStart(e, { x: 0, y: 1 })} />
      <div className="resize-handle absolute top-0 left-10 right-10 h-1 cursor-n-resize" onPointerDown={(e) => handleResizeStart(e, { x: 0, y: -1 })} />
    </div>
  )
}