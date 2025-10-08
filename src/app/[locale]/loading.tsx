"use client";

import React, { useEffect, useState } from "react";
import { IBM_Plex_Mono } from 'next/font/google';
import Loader from "@/components/lottie/loader/loader";

const ibmPlexMono = IBM_Plex_Mono({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-ibm-plex-mono',
});

export default function InitialLoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    if (!isLoading) return null;

    return (
        <div className={`fixed inset-0 z-50 flex justify-center items-center bg-background bg-[#141414] ${ibmPlexMono.className}`}>
            <div className="flex flex-col items-center gap-4">
                <Loader width={120} height={120} />
            </div>
        </div>
    );
}