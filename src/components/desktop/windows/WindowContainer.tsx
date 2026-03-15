'use client'

import { useState, useEffect, useRef, ReactNode, useCallback } from 'react'
import Image from 'next/image'
import { X, Minus, Square } from 'lucide-react'
import { useWindowsStore } from '@/store/useWindowsStore'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useResize } from '@/components/provider/ResizeProvider'
import { useDrag } from '@/components/provider/DragProvider'
import { EXTERNAL_ROUTES } from '@/config/desktop-apps'
import { RESIZE_HANDLES, Z_INDEX_BASE } from '@/constants/desktop'

interface WindowContainerProps {
  id?: string
  title: string
  icon?: string | ReactNode
  isOpen?: boolean
  onClose?: () => void
  children?: ReactNode
  width?: number
  height?: number
  requireAuth?: boolean
  mobileBreakpoint?: number
}

export default function WindowContainer({ id = Math.random().toString(36).substr(2, 9), title, icon = '/file.svg', isOpen, onClose, children, width = 800, height = 600, requireAuth = false, mobileBreakpoint = 768 }: WindowContainerProps) {
  const { isAuthenticated, isLoading } = useAuthentication()
  const { openWindows, addWindow, removeWindow, minimizeWindow, updateWindowState, bringToFront } = useWindowsStore()
  const windowInfo = openWindows.find(w => w.id === id)
  const [isMobile, setIsMobile] = useState(false)
  const { isResizing, startResize } = useResize()
  const { isDragging, currentDragId, startDrag } = useDrag()
  const windowRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [size, setSize] = useState({ width, height })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileBreakpoint])

  const handleMinimize = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    minimizeWindow(id, true)
  }, [id, minimizeWindow]);

  const handleMaximise = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (EXTERNAL_ROUTES[id]) {
      window.open(EXTERNAL_ROUTES[id], '_blank');
      return;
    }

    const GLOBAL_ROUTES = ['settings', 'documents'];
    if (GLOBAL_ROUTES.includes(id)) {
      window.location.href = `/desktop/${id}`;
      return;
    }

    const pathId = id.replace(/([a-z])([A-Z])/g, '$1/$2').toLowerCase();

    window.location.href = `/desktop/${pathId}`;
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

  const handleWindowClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    bringToFront(id)
  }, [id, bringToFront])

  const handleMouseDown = useCallback((e: React.PointerEvent) => {
    if (isMobile) return;

    bringToFront(id)

    let rafId: number | null = null

    startDrag(
      e,
      id,
      { ...position },
      (newPos) => {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(() => {
          setPosition((prev) =>
            prev.x === newPos.x && prev.y === newPos.y ? prev : newPos
          )
        })
      },
      (finalPos) => {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = null
        updateWindowState(id, finalPos)
        setPosition(finalPos)
      }
    )
  }, [id, position, startDrag, updateWindowState, isMobile, bringToFront]);

  const handleResizeStart = useCallback((e: React.PointerEvent, direction: { x: number, y: number }) => {
    if (isMobile) return;

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
  }, [id, position, size, startResize, updateWindowState, isMobile]);

  useEffect(() => {
    if (windowInfo?.position && !isDragging && !isResizing) {
      setPosition(windowInfo.position)
    }
  }, [windowInfo?.position, isDragging, isResizing])

  useEffect(() => {
    if (windowInfo?.size && !isDragging && !isResizing) {
      setSize(windowInfo.size)
    }
  }, [windowInfo?.size, isDragging, isResizing])

  const currentSize = size
  const currentPosition = position
  const currentIsMinimized = windowInfo?.isMinimized ?? false

  useEffect(() => {
    if (isOpen && !windowInfo) {
      addWindow({
        id,
        title,
        icon,
        isOpen: true,
        isMinimized: false,
        position: { x: 50, y: 50 },
        size: { width, height },
      });
    }
  }, [isOpen, windowInfo, id, title, icon, addWindow, width, height]);

  useEffect(() => {
    const handleMaximizeEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ id: string }>;
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
    if (requireAuth) {
      if (isLoading) {
        return (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )
      }

      if (!isAuthenticated) {
        return window.location.href = '/'
      }
    }

    return children
  }

  if (!isOpen) {
    return null
  }

  if (currentIsMinimized) {
    return <div style={{ display: 'none' }} />;
  }

  const mobileStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: 'calc(100vh - 3.5rem)',
    zIndex: windowInfo?.zIndex ?? Z_INDEX_BASE,
    borderRadius: 0,
    minWidth: 'auto',
    minHeight: 'auto'
  }

  const isThisWindowDragging = isDragging && currentDragId === id
  const desktopStyle = {
    width: `${currentSize.width}px`,
    height: `${currentSize.height}px`,
    position: 'absolute' as const,
    top: `${currentPosition.y}px`,
    left: `${currentPosition.x}px`,
    transform: isThisWindowDragging ? 'scale(1.02)' : 'scale(1)',
    transition: isThisWindowDragging || isResizing ? 'none' : 'transform 0.1s',
    zIndex: windowInfo?.zIndex ?? Z_INDEX_BASE
  }

  return (
    <div ref={windowRef} className={`bg-[var(--black-800)] border-2 border-[var(--black-500)] shadow-xl overflow-hidden flex flex-col relative ${isMobile ? 'rounded-none' : 'rounded-md min-w-[800px] min-h-[600px]'}`} style={isMobile ? mobileStyle : desktopStyle} onClick={handleWindowClick} draggable={false}>
      <div className={`bg-[var(--black-500)] px-4 py-2 flex items-center justify-between select-none ${isMobile ? 'cursor-default' : 'cursor-move'}`} onPointerDown={handleMouseDown} draggable={false}>
        <div className="text-white font-medium flex items-center text-sm sm:text-base">
          {typeof icon === 'string' ? (
            <Image src={icon || '/svg/file_default.svg'} alt="" width={24} height={24} className="mr-2 sm:mr-4 w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <div className="mr-2 sm:mr-4 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">{icon}</div>
          )}
          <span className="truncate">{title}</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6 z-20 relative">
          <button className="text-gray-400 hover:text-white focus:outline-none cursor-pointer hidden sm:block" onClick={handleMinimize}>
            <Minus size={16} />
          </button>
          <button className="text-gray-400 hover:text-white focus:outline-none cursor-pointer hidden sm:block" onClick={handleMaximise}>
            <Square size={16} />
          </button>
          <button className="text-gray-400 hover:text-red-500 focus:outline-none cursor-pointer" onClick={handleClose}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[var(--black-800)]">
        {renderContent()}
      </div>

      {!isMobile && RESIZE_HANDLES.map((handle, i) => (
        <div key={i} className={`resize-handle absolute ${handle.className}`} onPointerDown={(e) => handleResizeStart(e, handle.direction)} />
      ))}
    </div>
  )
}