'use client'

import { useState, useEffect, useCallback } from 'react'
import { useWindowsStore } from '@/store/useWindowsStore'
import { getGridConfig, TASKBAR_HEIGHT } from '@/constants/desktop'
import type { GridConfig } from '@/constants/desktop'

export function useResponsiveGrid() {
    const [gridConfig, setGridConfig] = useState<GridConfig>(
        getGridConfig(typeof window !== 'undefined' ? window.innerWidth : 1920)
    )

    useEffect(() => {
        if (typeof window === 'undefined') return

        let timeoutId: ReturnType<typeof setTimeout>

        const handleResize = () => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                const width = window.innerWidth
                const config = getGridConfig(width)
                setGridConfig(config)

                // Clamp icon positions to stay within viewport
                const vh = window.innerHeight - TASKBAR_HEIGHT
                const { iconPositions, updateIconPosition } = useWindowsStore.getState()

                Object.entries(iconPositions).forEach(([id, pos]) => {
                    const clampedX = Math.max(0, Math.min(pos.x, width - config.iconWidth))
                    const clampedY = Math.max(0, Math.min(pos.y, vh - config.iconHeight))
                    if (clampedX !== pos.x || clampedY !== pos.y) {
                        updateIconPosition(id, { x: clampedX, y: clampedY })
                    }
                })
            }, 200)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        return () => {
            clearTimeout(timeoutId)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const isMobile = gridConfig.columns === 3

    const getGridPosition = useCallback(
        (index: number) => {
            const col = index % gridConfig.columns
            const row = Math.floor(index / gridConfig.columns)
            return {
                x: gridConfig.startX + col * (gridConfig.iconWidth + gridConfig.gapX),
                y: gridConfig.startY + row * (gridConfig.iconHeight + gridConfig.gapY),
            }
        },
        [gridConfig]
    )

    return { isMobile, gridConfig, getGridPosition }
}
