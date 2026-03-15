// Cache durations (milliseconds)
export const CACHE_DURATION_DEFAULT = 5 * 60 * 1000  // 5 minutes
export const CACHE_DURATION_SHORT = 2 * 60 * 1000    // 2 minutes

// Z-index management
export const Z_INDEX_BASE = 1000
export const Z_INDEX_NORMALIZE_THRESHOLD = 2000

// TaskBar
export const TASKBAR_HEIGHT = 56

// Desktop grid layout
export const DESKTOP_GRID = {
    iconWidth: 120,
    iconHeight: 140,
    startX: 0,
    startY: 0,
    gapX: 30,
    gapY: 20,
    columns: 8,
} as const

export interface GridConfig {
    iconWidth: number
    iconHeight: number
    startX: number
    startY: number
    gapX: number
    gapY: number
    columns: number
}

export interface IconData {
    element: HTMLElement
    position: { x: number; y: number }
    size: { width: number; height: number }
}

/** Returns responsive grid config based on viewport width */
export function getGridConfig(width: number): GridConfig {
    if (width < 768) return { iconWidth: 80, iconHeight: 100, startX: 10, startY: 10, gapX: 10, gapY: 10, columns: 3 }
    if (width < 1024) return { iconWidth: 100, iconHeight: 120, startX: 20, startY: 20, gapX: 20, gapY: 15, columns: 5 }
    if (width < 1440) return { iconWidth: 120, iconHeight: 140, startX: 10, startY: 10, gapX: 30, gapY: 20, columns: 6 }
    return { iconWidth: 120, iconHeight: 140, startX: 10, startY: 10, gapX: 30, gapY: 20, columns: 8 }
}

// Resize handle configurations
export const RESIZE_HANDLES = [
    { direction: { x: 1, y: 1 }, className: 'bottom-0 right-0 w-2 h-2 cursor-se-resize' },
    { direction: { x: -1, y: 1 }, className: 'bottom-0 left-0 w-2 h-2 cursor-sw-resize' },
    { direction: { x: 1, y: -1 }, className: 'top-0 right-0 w-2 h-2 cursor-ne-resize' },
    { direction: { x: -1, y: -1 }, className: 'top-0 left-0 w-2 h-2 cursor-nw-resize' },
    { direction: { x: 1, y: 0 }, className: 'right-0 top-10 bottom-10 w-1 cursor-e-resize' },
    { direction: { x: -1, y: 0 }, className: 'left-0 top-10 bottom-10 w-1 cursor-w-resize' },
    { direction: { x: 0, y: 1 }, className: 'bottom-0 left-10 right-10 h-1 cursor-s-resize' },
    { direction: { x: 0, y: -1 }, className: 'top-0 left-10 right-10 h-1 cursor-n-resize' },
] as const
