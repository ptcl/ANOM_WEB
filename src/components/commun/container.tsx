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
    pb?: boolean;
    pb_xl?: boolean;

}

export default function Container({ children, height = 'screen', width = 'full', flexDirection = 'col', items = 'center', justify = 'center', textAlign = 'center', className, pb, pb_xl }: ContainerProps) {
    const heightClass = { 'screen': 'h-screen', 'fit': 'h-fit', 'fit-title': 'h-[calc(100vh-10rem)]', 'auto': 'h-auto', 'full': 'h-full' }[height] || `h-[${height}]`;
    const widthClass = { 'full': 'w-full', 'fit': 'w-fit', 'auto': 'w-auto' }[width] || `w-[${width}]`;

    const paddingClass = pb || pb_xl ? 'p-4 md:px-0 md:pt-0' : 'p-4 md:p-0';

    return (
        <section className={cn('bg-[var(--background)] overflow-hidden relative flex', paddingClass, heightClass, widthClass, `flex-${flexDirection}`, `items-${items}`, `justify-${justify}`, `text-${textAlign}`, className, { 'pb-40': pb, 'pb-80': pb_xl })}>
            {children}
        </section>
    )
}
