'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

interface SelectionAreaProps {
    onSelectionChange?: (selectionRect: { x: number; y: number; width: number; height: number }) => void;
}

export default function SelectionArea({ onSelectionChange }: SelectionAreaProps) {
    const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null)
    const [selectionEnd, setSelectionEnd] = useState<{ x: number; y: number } | null>(null)
    const [isSelecting, setIsSelecting] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)

    const selectionRect = useMemo(() => {
        if (selectionStart && selectionEnd) {
            return {
                x: Math.min(selectionStart.x, selectionEnd.x),
                y: Math.min(selectionStart.y, selectionEnd.y),
                width: Math.abs(selectionEnd.x - selectionStart.x),
                height: Math.abs(selectionEnd.y - selectionStart.y)
            }
        }
        return null
    }, [selectionStart, selectionEnd])

    useEffect(() => {
        if (selectionRect && isSelecting && onSelectionChange) {
            onSelectionChange(selectionRect)
        }
    }, [selectionRect, isSelecting, onSelectionChange])

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (e.button !== 0) return

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            setSelectionStart({ x, y })
            setSelectionEnd({ x, y })
            setIsSelecting(true)

            containerRef.current.setPointerCapture(e.pointerId)
        }
    }, [])

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (!isSelecting) return

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
            const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))

            setSelectionEnd({ x, y })
        }
    }, [isSelecting])

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        if (!isSelecting) return

        if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
            containerRef.current.releasePointerCapture(e.pointerId)
        }

        setTimeout(() => {
            setIsSelecting(false)
            setSelectionStart(null)
            setSelectionEnd(null)
        }, 100)
    }, [isSelecting])

    return (
        <div ref={containerRef} className="absolute inset-0 z-0" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} style={{ touchAction: 'none' }}>
            {selectionRect && isSelecting && (
                <div className="absolute border rounded-sm" style={{ left: `${selectionRect.x}px`, top: `${selectionRect.y}px`, width: `${selectionRect.width}px`, height: `${selectionRect.height}px`, pointerEvents: 'none', borderColor: 'var(--ThemeColorAccent)', backgroundColor: 'color-mix(in srgb, var(--ThemeColorAccent) 20%, transparent)', }} />
            )}
        </div>
    )
}
