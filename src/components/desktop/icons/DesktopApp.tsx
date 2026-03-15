'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useWindowsStore } from '@/store/useWindowsStore'
import { cn } from '@/lib/utils'
import AppIconBase from '@/components/desktop/icons/AppIconBase'
import { useDrag } from '@/components/provider/DragProvider'
import { motion } from 'framer-motion'

interface DesktopAppProps {
    id: string
    name?: string
    icon: string | React.ReactNode
    pinned?: boolean
    position?: { x: number; y: number }
    selected?: boolean
    type?: 'app' | 'folder' | 'file'
    onClick?: () => void
    onDoubleClick?: () => void
    onRegister?: (
        id: string,
        element: HTMLElement,
        position: { x: number; y: number },
        size: { width: number; height: number }
    ) => void
    onUnregister?: (id: string) => void
    appDescription?: string
    appVersion?: string
    selectedIcons?: string[]
}

export default function DesktopApp({ id, name = 'Unnamed App', icon, position, selected = false, onClick, onDoubleClick, onRegister, onUnregister, selectedIcons = [] }: DesktopAppProps) {
    const { iconPositions, updateIconPosition } = useWindowsStore()
    const { startDrag, isDragging, currentDragId } = useDrag()
    const iconRef = useRef<HTMLDivElement>(null)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const pos = iconPositions[id] ?? position ?? { x: 0, y: 0 }
    const isThisDragging = isDragging && currentDragId === id

    // ✅ Hydration-safe mobile detection
    const [hydrated, setHydrated] = useState(false)
    const [isClientMobile, setIsClientMobile] = useState(false)

    useEffect(() => {
        setHydrated(true)
        if (typeof window !== 'undefined') {
            const checkMobile = () => setIsClientMobile(window.innerWidth < 768)
            checkMobile()
            window.addEventListener('resize', checkMobile)
            return () => window.removeEventListener('resize', checkMobile)
        }
    }, [])

    useEffect(() => {
        if (!hydrated || isClientMobile || !onRegister || !iconRef.current) return
        const el = iconRef.current
        const rect = el.getBoundingClientRect()
        onRegister(id, el, pos, { width: rect.width, height: rect.height })
        return () => onUnregister?.(id)
    }, [id, onRegister, onUnregister, pos, hydrated, isClientMobile])

    const handlePointerDown = useCallback(
        (e: React.PointerEvent) => {
            if (isClientMobile) return
            if (e.button === 2) return
            e.stopPropagation()

            const isGroupDrag = selectedIcons.includes(id) && selectedIcons.length > 1
            const startPos = pos

            if (isGroupDrag) {
                const offsets = selectedIcons
                    .map(selId => {
                        const iconPos = iconPositions[selId]
                        if (!iconPos) return null
                        return {
                            id: selId,
                            offsetX: iconPos.x - startPos.x,
                            offsetY: iconPos.y - startPos.y,
                        }
                    })
                    .filter(Boolean) as { id: string; offsetX: number; offsetY: number }[]

                startDrag(
                    e,
                    id,
                    startPos,
                    (newPos) => {
                        offsets.forEach(({ id, offsetX, offsetY }) => {
                            updateIconPosition(id, {
                                x: newPos.x + offsetX,
                                y: newPos.y + offsetY,
                            })
                        })
                    },
                    (finalPos) => {
                        offsets.forEach(({ id, offsetX, offsetY }) => {
                            updateIconPosition(id, {
                                x: finalPos.x + offsetX,
                                y: finalPos.y + offsetY,
                            })
                        })
                    }
                )
            } else {
                startDrag(
                    e,
                    id,
                    startPos,
                    (pos) => updateIconPosition(id, pos),
                    (final) => updateIconPosition(id, final)
                )
            }
        },
        [id, pos, startDrag, updateIconPosition, iconPositions, selectedIcons, isClientMobile]
    )



    const mobileAnimation = {
        initial: { opacity: 0, scale: 0.9, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { duration: 0.25, ease: 'easeOut' as const },
    }

    const Container = isClientMobile ? motion.div : 'div'

    return (
        <Container
            ref={iconRef}
            onPointerDown={handlePointerDown}
            draggable={false}
            {...(isClientMobile ? { onClick: onClick || onDoubleClick } : { onDoubleClick: onDoubleClick })}
            style={!isClientMobile ? { transform: `translate(${pos.x}px, ${pos.y}px)` } : undefined}
            className={cn(
                isClientMobile ? 'relative flex flex-col items-center justify-center p-2 w-fit' : 'absolute flex flex-col items-center justify-center p-2 w-fit ',
                'select-none cursor-pointer rounded-md transition-all duration-200',
                selected && 'bg-white/10',
                'hover:bg-white/20',
                isThisDragging && 'opacity-60'
            )}
            {...(isClientMobile ? mobileAnimation : {})}
        >
            <div className="pointer-events-none flex flex-col items-center">
                <AppIconBase id={id} name={name} icon={icon} />
            </div>
        </Container>
    )
}
