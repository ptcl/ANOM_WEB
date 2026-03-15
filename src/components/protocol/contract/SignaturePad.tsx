'use client'

import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Eraser } from 'lucide-react'
import { useTranslations } from 'next-intl'

export interface SignaturePadRef {
    isEmpty: () => boolean
    clear: () => void
    toDataURL: () => string
    toSVG: () => string  // New method for PDF-friendly SVG
}

interface SignaturePadProps {
    label: string
    disabled?: boolean
    autoSignature?: string
}

// Convert signature points to SVG path
function pointsToSVG(points: any[], width: number, height: number): string {
    console.log('pointsToSVG called with:', { points, width, height })

    if (!points || points.length === 0) {
        console.log('No points provided')
        return ''
    }

    let pathData = ''
    for (const stroke of points) {
        // signature_pad returns array of point objects with x, y, time properties
        if (!stroke || !Array.isArray(stroke) || stroke.length === 0) {
            console.log('Invalid stroke:', stroke)
            continue
        }

        const firstPoint = stroke[0]
        if (!firstPoint || typeof firstPoint.x !== 'number') {
            console.log('Invalid first point:', firstPoint)
            continue
        }

        // Start path at first point
        pathData += `M ${firstPoint.x.toFixed(2)} ${firstPoint.y.toFixed(2)} `

        // Draw lines to subsequent points
        for (let i = 1; i < stroke.length; i++) {
            const point = stroke[i]
            if (point && typeof point.x === 'number') {
                pathData += `L ${point.x.toFixed(2)} ${point.y.toFixed(2)} `
            }
        }
    }

    console.log('Generated pathData:', pathData)

    if (!pathData) {
        console.log('Empty pathData')
        return ''
    }

    // Build SVG with black stroke on white background for better PDF visibility
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="white"/>
        <path d="${pathData.trim()}" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`

    console.log('Generated SVG:', svg.substring(0, 200) + '...')
    return svg
}

const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
    ({ label, disabled = false, autoSignature }, ref) => {
        const t = useTranslations()
        const signatureRef = useRef<SignatureCanvas>(null)
        const containerRef = useRef<HTMLDivElement>(null)
        const [canvasSize, setCanvasSize] = useState({ width: 300, height: 80 })

        // Resize canvas to match container
        useEffect(() => {
            const updateSize = () => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect()
                    setCanvasSize({
                        width: rect.width,
                        height: rect.height
                    })
                }
            }

            updateSize()
            window.addEventListener('resize', updateSize)

            // Delay to ensure container is rendered
            const timeout = setTimeout(updateSize, 100)

            return () => {
                window.removeEventListener('resize', updateSize)
                clearTimeout(timeout)
            }
        }, [])

        useImperativeHandle(ref, () => {
            console.log('useImperativeHandle called for SignaturePad:', label)
            return {
                isEmpty: () => {
                    if (autoSignature) return false
                    return signatureRef.current?.isEmpty() ?? true
                },
                clear: () => {
                    signatureRef.current?.clear()
                },
                toDataURL: () => {
                    if (autoSignature) return autoSignature
                    return signatureRef.current?.toDataURL('image/png') || ''
                },
                toSVG: () => {
                    console.log('toSVG called, signatureRef:', signatureRef.current)
                    if (autoSignature) return autoSignature
                    const points = signatureRef.current?.toData() || []
                    console.log('toData returned points:', points.length)
                    return pointsToSVG(points, canvasSize.width, canvasSize.height)
                }
            }
        }, [autoSignature, canvasSize.width, canvasSize.height, label])

        const handleClear = () => {
            signatureRef.current?.clear()
        }

        if (autoSignature) {
            return (
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-ibm text-[var(--black-300)] uppercase">{label}</span>
                    <div className="relative border border-[var(--black-400)] rounded bg-[var(--black-700)] h-20 flex items-center justify-center">
                        <img
                            src={autoSignature}
                            alt={t('protocol.contract.signature.automatic')}
                            className="max-h-16 max-w-full object-contain opacity-80 invert"
                        />
                        <span className="absolute bottom-1 right-2 text-[10px] text-[var(--black-400)] font-ibm">
                            {t('protocol.contract.signature.automatic')}
                        </span>
                    </div>
                </div>
            )
        }

        return (
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-ibm text-[var(--black-300)] uppercase">{label}</span>
                    {!disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-[var(--black-300)] hover:text-[var(--white-1)] text-xs flex items-center gap-1 transition-colors"
                        >
                            <Eraser className="w-3 h-3" />
                            {t('protocol.contract.signature.clear')}
                        </button>
                    )}
                </div>
                <div
                    ref={containerRef}
                    className={`relative border border-[var(--black-400)] rounded bg-[var(--black-700)] h-20 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <SignatureCanvas
                        ref={signatureRef}
                        canvasProps={{
                            width: canvasSize.width,
                            height: canvasSize.height,
                            className: 'rounded cursor-crosshair absolute inset-0'
                        }}
                        penColor="#ffffff"
                        backgroundColor="rgba(0,0,0,0)"
                        minWidth={1.5}
                        maxWidth={3}
                    />
                    {!disabled && (
                        <span className="absolute bottom-1 left-2 text-[10px] text-[var(--black-400)] font-ibm pointer-events-none">
                            {t('protocol.contract.signature.signHere')}
                        </span>
                    )}
                </div>
            </div>
        )
    }
)


SignaturePad.displayName = 'SignaturePad'

export default SignaturePad
