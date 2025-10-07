'use client';
import React from 'react'
import './globals.css'
import ImageLueur from '@/components/commun/ImageLueur';
import Link from 'next/link';
import Container from '@/components/commun/container';

export default function NotFoundPage() {
    return (
        <Container className='bg-[#141414] overflow-hidden w-full min-h-screen relative flex flex-col py-20'>
            <ImageLueur lueurImage='/img/glow/danger.png'/>
            <section className='flex flex-col justify-center items-center text-center w-full'>
                <h1 className='leading-8 md:leading-26 gradient__danger font-semibold text-4xl md:text-7xl lg:text-9xl uppercase text-transparent z-10 mx-auto' data-text="404">
                    404
                </h1>
                <p className='Grotesk text-[var(--light-dark-3)] text-sm md:text-lg max-w-xl z-10 mx-auto text-white'>
                    Page not found
                </p>
                <Link href="/" className='mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white'>
                    Return Home
                </Link>
            </section>
        </Container>
    )
}
