import React, { ReactNode } from 'react';

interface InversedThemeProps {
    children: ReactNode;
    currentTheme: 'light' | 'dark' | undefined;
    className?: string;
}

export const InversedTheme: React.FC<InversedThemeProps> = ({
    children,
    currentTheme,
    className = '',
}) => {
    const safeTheme = currentTheme || 'light';
    const inversedTheme = safeTheme === 'light' ? 'dark' : 'light';

    const baseClasses = inversedTheme === 'dark'
        ? 'bg-[var(--black-1)] text-white'
        : 'bg-[var(--white-accent1)] text-black';

    return (
        <div className={inversedTheme}>
            <div className={`${baseClasses} ${className}`}>
                {children}
            </div>
        </div>
    );
};