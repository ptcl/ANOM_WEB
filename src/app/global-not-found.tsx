import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link';
import ImageLueur from '@/components/commun/ImageLueur';
import GradientTitle from '@/components/commun/GradientTitle';

export const metadata: Metadata = {
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
    return (
        <html lang="en">
            <body>
                <div className='bg-[#141414] overflow-hidden w-full min-h-screen relative flex flex-col py-20 justify-center items-center'>
                    <ImageLueur imageType='custom' lueurImage='/img/glow/danger.png' />

                    <section className='flex flex-col justify-center items-center text-center w-full'>
                        <GradientTitle title='404' subtitle=' Page not found' className='text-gray-300' gradientType='danger' />

                        <Link href="/" className='mt-6 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-sm transition-colors duration-200 text-white'>
                            Return Home
                        </Link>
                    </section>
                </div>
            </body>
        </html>
    )
}


