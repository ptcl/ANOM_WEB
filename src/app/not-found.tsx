import React from 'react'
import Link from 'next/link';

export default function NotFoundPage() {
    return (
        <div className='bg-[#141414] overflow-hidden w-full min-h-screen relative flex flex-col py-20 justify-center items-center'>
            <section className='flex flex-col justify-center items-center text-center w-full'>
                <h1 className='font-semibold text-4xl md:text-7xl lg:text-9xl uppercase text-red-500 z-10 mx-auto'>
                    404
                </h1>
                <p className='text-gray-300 text-sm md:text-lg max-w-xl z-10 mx-auto mt-4'>
                    Page not found
                </p>
                <Link href="/" className='mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 text-white'>
                    Return Home
                </Link>
            </section>
        </div>
    )
}
