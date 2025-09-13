"use client";

import { createContext, useContext, useState, useEffect } from "react";

type AccentColor = "bray" | "protocol" | "red";

interface AccentColorContextValue {
    accent: AccentColor;
    setAccent: (color: AccentColor) => void;
}

const AccentColorContext = createContext<AccentColorContextValue | undefined>(undefined);

export function AccentColorProvider({ children }: { children: React.ReactNode }) {
    const [accent, setAccentState] = useState<AccentColor>("protocol");

    useEffect(() => {
        const saved = localStorage.getItem("accent-color") as AccentColor | null;
        const initial = saved ?? "protocol";
        setAccentState(initial);
        document.documentElement.classList.add(`accent-${initial}`);
        if (!saved) localStorage.setItem("accent-color", initial);

        const onStorage = (e: StorageEvent) => {
            if (e.key === "accent-color" && e.newValue) {
                document.documentElement.classList.remove(`accent-${accent}`);
                document.documentElement.classList.add(`accent-${e.newValue}`);
                setAccentState(e.newValue as AccentColor);
            }
        };
        window.addEventListener("storage", onStorage);

        return () => window.removeEventListener("storage", onStorage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setAccent = (color: AccentColor) => {
        document.documentElement.classList.remove(`accent-${accent}`);
        document.documentElement.classList.add(`accent-${color}`);
        setAccentState(color);
        localStorage.setItem("accent-color", color);
    };

    return (
        <AccentColorContext.Provider value={{ accent, setAccent }}>
            {children}
        </AccentColorContext.Provider>
    );
}

export function useAccentColor() {
    const ctx = useContext(AccentColorContext);
    if (!ctx) throw new Error("useAccentColor must be used inside AccentColorProvider");
    return ctx;
}
