import React from 'react'
import Image from 'next/image'
import ComponentSvg from '../svg/ComponentSvg'

export default function Placeholder() {
    return (
        <section className='relative h-full w-full flex items-center justify-center bg-[var(--bg-placeholder)] border-2 border-[var(--border-1)] rounded'>
            <ComponentSvg color='var(--grey-accent1)' width={64} height={64}/>
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
