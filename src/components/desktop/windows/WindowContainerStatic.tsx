'use client'
import { useRef, ReactNode, useEffect, useState } from 'react'
import Image from 'next/image'
import { X, Minus, Square } from 'lucide-react'
import { motion } from 'framer-motion'

interface WindowContainerStaticProps {
    windowContainerId?: string | number
    title: string | ReactNode
    icon?: string | ReactNode
    children?: ReactNode
    width?: number | string
    height?: number | string
    fitContentWidth?: boolean
    fitContentHeight?: boolean
    responsiveMode?: 'fullscreen' | 'scale' | 'fixed'
    absolute?: boolean
    mobileBreakpoint?: number
    enableAnimation?: boolean
    animationDelay?: number
    animationType?: 'scale' | 'fade' | 'slideUp' | 'scaleAndFade'
    top?: number | string
    left?: number | string
    right?: number | string
    bottom?: number | string
    zIndex?: number
    mobile?: boolean
    showIcon?: boolean
    showControls?: boolean
    scanlines?: boolean | string
}

// (supprimé, doublon)
export default function WindowContainerStatic({ title, icon = '/file.svg', children, width = 900, height = 600, fitContentWidth = false, fitContentHeight = false, responsiveMode = 'scale', mobileBreakpoint = 768, enableAnimation = true, animationDelay = 0, animationType = 'scaleAndFade', absolute = false, top, left, right, bottom, zIndex, windowContainerId, mobile = false, showIcon = true, showControls = true, scanlines = false }: WindowContainerStaticProps) {
    const windowStaticRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < mobileBreakpoint)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [mobileBreakpoint])

    const getStyle = () => {
        if (isMobile) {
            switch (responsiveMode) {
                case 'fullscreen':
                    return {
                        padding: ".5rem",
                        paddingTop: "5rem",
                        width: '100vw',
                        height: '100vh',
                        maxWidth: '100%',
                        maxHeight: '100%'
                    }
                case 'scale':
                    return {
                        width: '100%',
                        height: 'auto',
                        maxWidth: '100vw',
                        minHeight: '400px'
                    }
                case 'fixed':
                default:
                    return {
                        width: fitContentWidth ? 'fit-content' : width,
                        height: fitContentHeight ? 'fit-content' : height,
                        maxWidth: '100vw',
                        overflow: 'auto'
                    }
            }
        }

        return {
            width: fitContentWidth ? 'fit-content' : width,
            height: fitContentHeight ? 'fit-content' : height
        }
    }

    const getAnimationVariants = () => {
        switch (animationType) {
            case 'scale':
                return {
                    initial: { scale: 0.8, opacity: 1 },
                    animate: { scale: 1, opacity: 1 }
                }
            case 'fade':
                return {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 }
                }
            case 'slideUp':
                return {
                    initial: { y: 50, opacity: 0 },
                    animate: { y: 0, opacity: 1 }
                }
            case 'scaleAndFade':
                return {
                    initial: { scale: 0.9, opacity: 0 },
                    animate: { scale: 1, opacity: 1 }
                }
            default:
                return {
                    initial: { scale: 0.8, opacity: 1 },
                    animate: { scale: 1, opacity: 1 }
                }
        }
    }

    // Calcul du style de position
    const positionStyle = absolute
        ? {
            position: 'absolute',
            ...(top !== undefined ? { top: mobile ? 0 : top } : {}),
            ...(left !== undefined ? { left: mobile ? 0 : left } : {}),
            ...(right !== undefined ? { right: mobile ? 0 : right } : {}),
            ...(bottom !== undefined ? { bottom: mobile ? 0 : bottom } : {}),
            ...(zIndex !== undefined ? { zIndex } : {})
        }
        : { position: 'relative', ...(zIndex !== undefined ? { zIndex } : {}) };
    const WindowContent = (
        <div ref={windowStaticRef} id={`${windowContainerId}`} className={`bg-[var(--black-500)] border-2 border-[var(--black-500)] rounded-md shadow-xl overflow-hidden flex flex-col ${isMobile && responsiveMode === 'fullscreen' ? 'rounded-none' : ''}`} style={{ ...getStyle(), ...positionStyle } as React.CSSProperties}>
            <div className="bg-[var(--black-500)] px-4 py-2 flex items-center justify-between select-none">
                <div className="text-white font-medium flex items-center gap-2 text-sm sm:text-base">
                    {showIcon && (typeof icon === 'string' ? (
                        <Image src={icon} alt="" width={24} height={24} className="mr-2 sm:mr-4 w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                        icon
                    ))}
                    <span className="truncate">{title}</span>
                </div>
                {showControls && (
                    <div className="flex items-center gap-3 sm:gap-6 z-1 relative">
                        <button className="text-gray-400 hover:text-white focus:outline-none cursor-pointer hidden sm:block">
                            <Minus size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-white focus:outline-none cursor-pointer hidden sm:block">
                            <Square size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-red-500 focus:outline-none cursor-pointer">
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>
            <div className={`flex-1 overflow-hidden bg-[var(--black-800)] p-2 sm:p-4 relative ${isMobile && responsiveMode === 'fullscreen' ? 'h-full' : ''}`}>
                {scanlines && (
                    <div
                        className="absolute -inset-2 sm:-inset-4 z-10 pointer-events-none bg-repeat opacity-50 mix-blend-overlay"
                        style={{ backgroundImage: `url('${typeof scanlines === 'string' ? scanlines : '/img/overlay_terminal_1.png'}')` }}
                    />
                )}
                <div className="relative z-0 h-full flex flex-col">
                    {children}
                </div>
            </div>
        </div>
    )

    if (!enableAnimation) {
        return WindowContent
    }

    const variants = getAnimationVariants()

    return (
        <motion.div className={height === '100%' ? 'h-full' : ''} initial={variants.initial} animate={variants.animate} transition={{ duration: 0.5, delay: animationDelay, ease: [0.25, 0.1, 0.25, 1] }}>
            {WindowContent}
        </motion.div>
    )
}