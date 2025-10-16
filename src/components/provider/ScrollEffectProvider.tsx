"use client";

import { useEffect, useState, useCallback } from "react";

export default function ScrollEffectProvider({ children }: { children: React.ReactNode }) {
    const [style, setStyle] = useState({ padding: 0, radius: 0 });

    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const maxScrollable = document.documentElement.scrollHeight - window.innerHeight - 640;
        const progress = Math.min(Math.max((scrollTop - maxScrollable) / 640, 0), 1);
        const eased = Math.pow(progress, 1.5);

        const isMobile = window.innerWidth < 768;

        setStyle({
            padding: isMobile ? 0 : eased * 100,
            radius: isMobile ? 0 : eased * 16,
        });
    }, []);

    useEffect(() => {
        let ticking = false;

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", onScroll);

        handleScroll();

        return () => window.removeEventListener("scroll", onScroll);
    }, [handleScroll]);

    return (
        <div style={{ paddingLeft: `${style.padding}px`, paddingRight: `${style.padding}px`, transition: "padding 0.2s ease-out", maxHeight: "100vh", }}>
            <div className="page_content flex flex-col" style={{ borderRadius: `${style.radius}px`, transition: "border-radius 0.2s ease-out", overflow: "hidden" }}>
                <div id="content_overflow">
                    {children}
                </div>
            </div>
            <div className="spaceScroll w-full h-620" style={{ pointerEvents: "none" }}></div>
        </div>
    );
}
