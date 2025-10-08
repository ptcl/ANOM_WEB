'use client'

import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react'

interface Position {
    x: number
    y: number
}

interface Size {
    width: number
    height: number
}

interface ResizeContextType {
    isResizing: boolean
    startResize: (
        e: React.PointerEvent,
        direction: { x: number, y: number },
        elementId: string,
        initialSize: Size,
        initialPosition: Position,
        onUpdate: (newPosition: Position, newSize: Size) => void
    ) => void
}

const ResizeContext = createContext<ResizeContextType | undefined>(undefined)

interface ResizeProviderProps {
    children: ReactNode
}

export function ResizeProvider({ children }: ResizeProviderProps) {
    const [isResizing, setIsResizing] = useState(false)
    const resizeRef = useRef({
        active: false,
        rafId: 0,
        newSize: { width: 0, height: 0 },
        newPosition: { x: 0, y: 0 },
        initialSize: { width: 0, height: 0 },
        initialPosition: { x: 0, y: 0 },
        direction: { x: 0, y: 0 },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onUpdate: (_position: Position, _size: Size) => { },
        elementId: ''
    })

    const startResize = useCallback((
        e: React.PointerEvent,
        direction: { x: number, y: number },
        elementId: string,
        initialSize: Size,
        initialPosition: Position,
        onUpdate: (newPosition: Position, newSize: Size) => void
    ) => {
        e.preventDefault()
        e.stopPropagation()

        setIsResizing(true)

        resizeRef.current = {
            active: false,
            rafId: 0,
            newSize: { ...initialSize },
            newPosition: { ...initialPosition },
            initialSize: { ...initialSize },
            initialPosition: { ...initialPosition },
            direction,
            onUpdate,
            elementId
        }

        const target = e.currentTarget as HTMLElement

        // Appliquer les effets visuels
        target.classList.add('bg-blue-500/60')
        target.classList.remove('opacity-30')
        target.classList.add('opacity-100')

        // Capturer le pointeur
        target.setPointerCapture(e.pointerId)

        const initialX = e.clientX
        const initialY = e.clientY

        const handlePointerMove = (moveEvent: PointerEvent) => {
            moveEvent.preventDefault()

            const deltaX = moveEvent.clientX - initialX
            const deltaY = moveEvent.clientY - initialY

            const newSize = { ...resizeRef.current.newSize }
            const newPosition = { ...resizeRef.current.newPosition }
            const { direction, initialSize, initialPosition } = resizeRef.current

            if (direction.x !== 0) {
                const change = deltaX * Math.abs(direction.x)
                if (direction.x > 0) {
                    newSize.width = Math.max(300, initialSize.width + change)
                } else {
                    newSize.width = Math.max(300, initialSize.width - change)
                    newPosition.x = initialPosition.x - (newSize.width - initialSize.width)
                }
            }

            if (direction.y !== 0) {
                const change = deltaY * Math.abs(direction.y)
                if (direction.y < 0) {
                    newSize.height = Math.max(200, initialSize.height - change)
                    newPosition.y = Math.min(initialPosition.y + change, initialPosition.y + initialSize.height - 200)
                } else {
                    newSize.height = Math.max(200, initialSize.height + change)
                }
            }

            resizeRef.current.newSize = newSize
            resizeRef.current.newPosition = newPosition

            if (!resizeRef.current.active) {
                resizeRef.current.active = true
                resizeRef.current.rafId = requestAnimationFrame(() => {
                    resizeRef.current.onUpdate(
                        resizeRef.current.newPosition,
                        resizeRef.current.newSize
                    )
                    resizeRef.current.active = false
                })
            }
        }

        const handlePointerUp = () => {
            if (resizeRef.current.rafId) {
                cancelAnimationFrame(resizeRef.current.rafId)
                resizeRef.current.active = false
            }

            target.removeEventListener('pointermove', handlePointerMove)
            target.removeEventListener('pointerup', handlePointerUp)
            target.removeEventListener('pointercancel', handlePointerUp)

            if (target.hasPointerCapture(e.pointerId)) {
                target.releasePointerCapture(e.pointerId)
            }

            target.classList.remove('bg-blue-500/60')
            target.classList.remove('opacity-100')
            target.classList.add('opacity-30')

            setIsResizing(false)

            document.body.classList.remove('resizing')
            document.body.style.userSelect = ''
        }

        target.addEventListener('pointermove', handlePointerMove)
        target.addEventListener('pointerup', handlePointerUp)
        target.addEventListener('pointercancel', handlePointerUp)

        document.body.classList.add('resizing')
        document.body.style.userSelect = 'none'
    }, [])

    const value = {
        isResizing,
        startResize
    }

    return (
        <ResizeContext.Provider value={value}>
            {children}
        </ResizeContext.Provider>
    )
}

export function useResize() {
    const context = useContext(ResizeContext)
    if (context === undefined) {
        throw new Error('useResize doit être utilisé à lintérieur d\'un ResizeProvider')
    }
    return context
}