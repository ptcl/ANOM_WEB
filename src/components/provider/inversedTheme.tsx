import React, { createContext, useContext, useMemo, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface InversedThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

const InversedThemeContext = createContext<InversedThemeContextProps | undefined>(undefined);

export const useInversedTheme = () => {
    const context = useContext(InversedThemeContext);
    if (!context) {
        throw new Error('useInversedTheme must be used within an InversedThemeProvider');
    }
    return context;
};

interface InversedThemeProviderProps {
    children: ReactNode;
    initialTheme?: Theme;
}

export const InversedThemeProvider: React.FC<InversedThemeProviderProps> = ({
    children,
    initialTheme = 'light',
}) => {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme === 'light' || storedTheme === 'dark') {
                return storedTheme;
            }
        }
        return initialTheme;
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <InversedThemeContext.Provider value={value}>
            {children}
        </InversedThemeContext.Provider>
    );
};