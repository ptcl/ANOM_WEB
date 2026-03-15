'use client'
import { useState } from 'react'

export default function SelectionArea() {
    const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
    const [start, setStart] = useState<{ x: number; y: number } | null>(null)

    const handleMouseDown = (e: React.MouseEvent) => {
        const bounds = (e.target as HTMLElement).getBoundingClientRect()
        setStart({ x: e.clientX - bounds.left, y: e.clientY - bounds.top })
        setRect({ x: e.clientX - bounds.left, y: e.clientY - bounds.top, w: 0, h: 0 })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!start) return
        const bounds = (e.target as HTMLElement).getBoundingClientRect()
        const currentX = e.clientX - bounds.left
        const currentY = e.clientY - bounds.top
        setRect({
            x: Math.min(start.x, currentX),
            y: Math.min(start.y, currentY),
            w: Math.abs(currentX - start.x),
            h: Math.abs(currentY - start.y)
        })
    }

    const handleMouseUp = () => {
        setStart(null)
        setTimeout(() => setRect(null), 150)
    }

    return (
        <div
            className="relative w-full h-screen inset-0 z-[1]"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {rect && (
                <div
                    className="absolute border border-blue-400 bg-blue-400/15 rounded-sm"
                    style={{
                        left: rect.x,
                        top: rect.y,
                        width: rect.w,
                        height: rect.h
                    }}
                />
            )}
        </div>
    )
}
