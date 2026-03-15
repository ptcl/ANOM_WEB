import React from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
    children: React.ReactNode;
    height?: 'screen' | 'fit' | 'fit-title' | 'auto' | 'full' | string;
    width?: 'full' | 'fit' | 'auto' | string;
    flexDirection?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
    items?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    textAlign?: 'left' | 'center' | 'right';
    className?: string;
    bgDefault?: boolean;
    pb?: boolean;
    pb_xl?: boolean;
    noPadding?: boolean;
    overflow?: boolean;
}

export default function Container({ children, height = 'screen', width = 'full', flexDirection = 'col', items = 'center', justify = 'center', textAlign = 'center', className, pb, pb_xl, noPadding, bgDefault, overflow }: ContainerProps) {
    const heightClass = { 'screen': 'h-screen', 'fit': 'h-fit', 'fit-title': 'h-[calc(100vh-10rem)]', 'auto': 'h-auto', 'full': 'h-full' }[height] || `h-[${height}]`;
    const widthClass = { 'full': 'w-full', 'fit': 'w-fit', 'auto': 'w-auto' }[width] || `w-[${width}]`;

    const paddingClass = noPadding ? '' : (pb || pb_xl ? '' : '');

    return (
        <section className={cn(' relative flex', paddingClass, heightClass, widthClass, `flex-${flexDirection}`, `items-${items}`, `justify-${justify}`, `text-${textAlign}`, className, { 'pb-40': pb, 'pb-80': pb_xl, 'bg-[var(--background)]': bgDefault, 'overflow-hidden': overflow })}>
            {children}
        </section>
    )
}
