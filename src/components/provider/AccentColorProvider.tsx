"use client";

import { createContext, useContext, useEffect } from "react";
import { useAgentStore } from "@/store/agentStore";
import { generateColorScale, COLOR_SCALE_STEPS } from "@/lib/colors";

interface ThemeContextValue {
    activeTheme: string | undefined;
    primary: string;
    secondary: string;
    accent: string;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Couleurs par défaut (thème protocol)
const DEFAULT_THEME = {
    primary: "#959EE6",
    secondary: "#172064",
    accent: "#3A4BD1",
};

export function AccentColorProvider({ children }: { children: React.ReactNode }) {
    const { agent, agentTheme, fetchAgentTheme } = useAgentStore();

    const activeThemeObj = agent?.protocol?.settings?.activeTheme as unknown as {
        themeId?: string;
        primary?: string;
        secondary?: string;
        accent?: string;
    } | undefined;

    const colors = {
        primary: activeThemeObj?.primary || DEFAULT_THEME.primary,
        secondary: activeThemeObj?.secondary || DEFAULT_THEME.secondary,
        accent: activeThemeObj?.accent || DEFAULT_THEME.accent,
    };

    useEffect(() => {
        if (!agentTheme && agent) {
            fetchAgentTheme();
        }
    }, [agent, agentTheme, fetchAgentTheme]);

    useEffect(() => {
        const root = document.documentElement;

        // Base colors (alias for 500)
        root.style.setProperty('--theme-primary', colors.primary);
        root.style.setProperty('--theme-secondary', colors.secondary);
        root.style.setProperty('--theme-accent', colors.accent);

        // Full scale 50→950 for each color
        const scales = {
            primary: generateColorScale(colors.primary),
            secondary: generateColorScale(colors.secondary),
            accent: generateColorScale(colors.accent),
        };

        for (const [name, scale] of Object.entries(scales)) {
            for (const step of COLOR_SCALE_STEPS) {
                root.style.setProperty(`--theme-${name}-${step}`, scale[step]);
            }
        }
    }, [colors.primary, colors.secondary, colors.accent]);

    return (
        <ThemeContext.Provider value={{
            activeTheme: activeThemeObj?.themeId,
            ...colors
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeColors() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        return {
            activeTheme: undefined,
            ...DEFAULT_THEME
        };
    }
    return ctx;
}

