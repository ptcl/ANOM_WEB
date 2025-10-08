'use client'

import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react'

interface Position {
  x: number
  y: number
}

interface DragContextType {
  isDragging: boolean
  currentDragId: string | null;
  startDrag: (
    e: React.PointerEvent,
    elementId: string,
    initialPosition: Position,
    onUpdate: (newPosition: Position) => void,
    onComplete?: (finalPosition: Position) => void,
    constraints?: {
      minX?: number;
      minY?: number;
      maxX?: number;
      maxY?: number;
    }
  ) => void
}

const DragContext = createContext<DragContextType | undefined>(undefined)

interface DragProviderProps {
  children: ReactNode
}

export function DragProvider({ children }: DragProviderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [currentDragId, setCurrentDragId] = useState<string | null>(null)

  const dragRef = useRef({
    active: false,
    rafId: 0,
    newPosition: { x: 0, y: 0 },
    initialPosition: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onUpdate: (_position: Position) => { },
    onComplete: null as ((position: Position) => void) | null,
    elementId: '',
    constraints: {
      minX: 0,
      minY: 0,
      maxX: Infinity,
      maxY: Infinity
    }
  })

  const startDrag = useCallback((e: React.PointerEvent, elementId: string, initialPosition: Position, onUpdate: (newPosition: Position) => void, onComplete?: (finalPosition: Position) => void, constraints = {}) => {
    if (e.button === 2) return;

    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    const isWindowTitleBar = (e.target as HTMLElement).closest('.bg-gray-800');
    const isDesktopIcon = (e.currentTarget as HTMLElement).classList.contains('flex');

    if (!isDesktopIcon && !isWindowTitleBar && e.target !== e.currentTarget) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setCurrentDragId(elementId);

    const dragOffset = {
      x: e.clientX - initialPosition.x,
      y: e.clientY - initialPosition.y
    };

    // Préparer les contraintes
    const defaultConstraints = {
      minX: 0,
      minY: 0,
      maxX: Infinity,
      maxY: Infinity
    };

    dragRef.current = {
      active: false,
      rafId: 0,
      newPosition: { ...initialPosition },
      initialPosition: { ...initialPosition },
      dragOffset,
      onUpdate,
      onComplete: onComplete || null,
      elementId,
      constraints: { ...defaultConstraints, ...constraints }
    }

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    target.classList.add('dragging');

    const handlePointerMove = (moveEvent: PointerEvent) => {
      moveEvent.preventDefault();

      const { minX, minY, maxX, maxY } = dragRef.current.constraints;

      dragRef.current.newPosition = {
        x: Math.min(maxX, Math.max(minX, moveEvent.clientX - dragRef.current.dragOffset.x)),
        y: Math.min(maxY, Math.max(minY, moveEvent.clientY - dragRef.current.dragOffset.y))
      };

      if (!dragRef.current.active) {
        dragRef.current.active = true;
        dragRef.current.rafId = requestAnimationFrame(() => {
          dragRef.current.onUpdate(dragRef.current.newPosition);
          dragRef.current.active = false;
        });
      }
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      upEvent.preventDefault();

      if (dragRef.current.rafId) {
        cancelAnimationFrame(dragRef.current.rafId);
        dragRef.current.active = false;
      }

      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }

      if (dragRef.current.onComplete) {
        dragRef.current.onComplete(dragRef.current.newPosition);
      }

      setIsDragging(false);
      setCurrentDragId(null);

      target.classList.remove('dragging');

      document.body.classList.remove('dragging');
      document.body.style.userSelect = '';

      target.removeEventListener('pointermove', handlePointerMove);
      target.removeEventListener('pointerup', handlePointerUp);
      target.removeEventListener('pointercancel', handlePointerUp);
    };

    document.body.classList.add('dragging');
    document.body.style.userSelect = 'none';

    target.addEventListener('pointermove', handlePointerMove);
    target.addEventListener('pointerup', handlePointerUp);
    target.addEventListener('pointercancel', handlePointerUp);
  }, [])

  const value = {
    isDragging,
    currentDragId,
    startDrag
  }

  return (
    <DragContext.Provider value={value}>
      {children}
    </DragContext.Provider>
  )
}

export function useDrag() {
  const context = useContext(DragContext)
  if (context === undefined) {
    throw new Error('useDrag doit être utilisé à l\'intérieur d\'un DragProvider')
  }
  return context
}