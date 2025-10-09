import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link';
import ImageLueur from '@/components/commun/ImageLueur';

export const metadata: Metadata = {
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
    return (
        <html lang="en">
            <body>
                <div className='bg-[#141414] overflow-hidden w-full min-h-screen relative flex flex-col py-20 justify-center items-center'>
                    <ImageLueur lueurImage='/img/glow/danger.png' />

                    <section className='flex flex-col justify-center items-center text-center w-full'>
                        <h1 className='leading-8 md:leading-26 gradient__danger font-semibold text-4xl md:text-7xl lg:text-9xl uppercase text-transparent z-10 mx-auto' data-text="404">
                           404
                        </h1>
                        <p className='text-gray-300 text-sm md:text-lg max-w-xl z-10 mx-auto mt-4'>
                            Page not found
                        </p>
                        <Link href="/" className='mt-6 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-sm transition-colors duration-200 text-white'>
                            Return Home
                        </Link>
                    </section>
                </div>
            </body>
        </html>
    )
}


