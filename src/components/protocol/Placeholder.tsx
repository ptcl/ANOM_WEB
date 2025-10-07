import React from 'react'
import ComponentSvg from '../svg/ComponentSvg'

interface PlaceholderProps {
    text?: string
}

export default function Placeholder({ text }: PlaceholderProps) {
    return (
        <section className='relative h-full w-full flex items-center justify-center bg-[var(--bg-placeholder)] border-[1.5px] border-[var(--grey-accent1)] rounded-lg p-4 overflow-hidden'>
            <div className='flex flex-col items-center justify-center'>
                <ComponentSvg color='var(--grey-accent1)' width={64} height={64} />
                <p className='Grotesk text-[var(--grey-accent1)] text-sm font-medium mt-2'>{text}</p>
            </div>
            <div className="absolute top-0 left-0 -rotate-90">
                <ComponentSvg color="var(--grey-accent1)" variant="fragment" width={32} height={32} />
            </div>
            <div className="absolute top-0 right-0 rotate-0">
                <ComponentSvg color="var(--grey-accent1)" variant="fragment" width={32} height={32} />
            </div>
            <div className="absolute bottom-0 left-0 rotate-180">
                <ComponentSvg color="var(--grey-accent1)" variant="fragment" width={32} height={32} />
            </div>
            <div className="absolute bottom-0 right-0 rotate-90">
                <ComponentSvg color="var(--grey-accent1)" variant="fragment" width={32} height={32} />
            </div>
        </section>
    )
}
