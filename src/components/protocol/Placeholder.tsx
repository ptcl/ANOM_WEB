import React from 'react'
import { cn } from '@/lib/utils'
import ComponentSvg from '../svg/ComponentSvg'

interface PlaceholderProps {
    text?: string
    rounded?: 'sm' | 'md' | 'lg' | 'full' | string
    classname?: string
}

export default function Placeholder({ text, rounded, classname }: PlaceholderProps) {
    const roundedClass = rounded ? `rounded-${rounded}` : 'rounded';

    return (
        <section className={cn('relative h-full w-full flex items-center justify-center bg-[var(--black-900)] border-[1.5px] border-[var(--black-800)] p-4 overflow-hidden', roundedClass, classname)}>
            <div className='flex flex-col items-center justify-center'>
                <ComponentSvg color='var(--black-50)' width={64} height={64} />
                <p className='font-grotesk text-[var(--black-50)] text-sm font-medium mt-2'>{text}</p>
            </div>
            <div className="absolute top-0 left-0 -rotate-90">
                <ComponentSvg color="var(--black-800)" variant="fragment" width={32} height={32} />
            </div>
            <div className="absolute top-0 right-0 rotate-0">
                <ComponentSvg color="var(--black-800)" variant="fragment" width={32} height={32} />
            </div>
            <div className="absolute bottom-0 left-0 rotate-180">
                <ComponentSvg color="var(--black-800)" variant="fragment" width={32} height={32} />
            </div>
            <div className="absolute bottom-0 right-0 rotate-90">
                <ComponentSvg color="var(--black-800)" variant="fragment" width={32} height={32} />
            </div>
        </section>
    )
}