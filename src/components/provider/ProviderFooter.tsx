import React from 'react'
import Footer from '../commun/Footer'
import ScrollEffectProvider from './ScrollEffectProvider'

export default function ProviderFooter({ children }: { children: React.ReactNode }) {
    return (
        <section className="relative">
            <Footer />
            <ScrollEffectProvider>
                <section className='page_wrapper' suppressHydrationWarning>
                    {children}
                </section>
            </ScrollEffectProvider>
        </section>
    )
}
