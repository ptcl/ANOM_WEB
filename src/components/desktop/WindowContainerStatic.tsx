'use client'

import { useRef, ReactNode } from 'react'
import Image from 'next/image'
import { X, Minus, Square } from 'lucide-react'

interface WindowContainerStaticProps {
    title: string | ReactNode
    icon?: string | ReactNode
    children?: ReactNode
    width?: number
    height?: number

}

export default function WindowContainerStatic({ title, icon = '/file.svg', children, width = 900, height = 600 }: WindowContainerStaticProps) {
    const windowStaticRef = useRef<HTMLDivElement>(null)

    return (
        <div ref={windowStaticRef} className={`bg-[var(--window)] border-2 border-[var(--window-border)] rounded shadow-xl overflow-hidden flex flex-col relative`} style={{ width, height }}>
            <div className="bg-[var(--window)] px-4 py-2 flex items-center justify-between select-none">
                <div className="text-white font-medium flex items-center gap-2">
                    {typeof icon === 'string' ? (
                        <Image src={icon} alt="" width={24} height={24} className="mr-4" />
                    ) : (
                        icon
                    )}
                    {title}
                </div>
                <div className="flex items-center gap-6 z-20 relative">
                    <button className="text-gray-400 hover:text-white focus:outline-none cursor-pointer">
                        <Minus size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-white focus:outline-none cursor-pointer" >
                        <Square size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-red-500 focus:outline-none cursor-pointer">
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden bg-[var(--window-inner)] p-4">
                {children}
            </div>
            {/* 
            <div className="resize-handle absolute bottom-0 right-0 w-2 h-2 cursor-se-resize" onPointerDown={(e) => handleResizeStart(e, { x: 1, y: 1 })} />
            <div className="resize-handle absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize" onPointerDown={(e) => handleResizeStart(e, { x: -1, y: 1 })} />
            <div className="resize-handle absolute top-0 right-0 w-2 h-2 cursor-ne-resize" onPointerDown={(e) => handleResizeStart(e, { x: 1, y: -1 })} />
            <div className="resize-handle absolute top-0 left-0 w-2 h-2 cursor-nw-resize" onPointerDown={(e) => handleResizeStart(e, { x: -1, y: -1 })} />
            <div className="resize-handle absolute right-0 top-10 bottom-10 w-1 cursor-e-resize" onPointerDown={(e) => handleResizeStart(e, { x: 1, y: 0 })} />
            <div className="resize-handle absolute left-0 top-10 bottom-10 w-1 cursor-w-resize" onPointerDown={(e) => handleResizeStart(e, { x: -1, y: 0 })} />
            <div className="resize-handle absolute bottom-0 left-10 right-10 h-1 cursor-s-resize" onPointerDown={(e) => handleResizeStart(e, { x: 0, y: 1 })} />
            <div className="resize-handle absolute top-0 left-10 right-10 h-1 cursor-n-resize" onPointerDown={(e) => handleResizeStart(e, { x: 0, y: -1 })} /> 
            */}
        </div>
    )
}