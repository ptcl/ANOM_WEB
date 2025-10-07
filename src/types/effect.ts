
export const DEFAULT_GLITCH_CHARS = [
    '█', '▓', '▒', '░', '▄', '▌', '▐', '▀', '■', '□', '▪', '▫',
    '◆', '◇', '◈', '◉', '◎', '●', '○', '◦', '⬜', '◾', '◽',
    '▲', '▼', '◀', '▶', '◤', '◥', '◣', '◢', '╱', '╲', '╳', '╬',
    '@', '#', '$', '%', '&', '*', '+', '=', '~', '^', '<', '>',
    '0', '1', 'X', 'Y', 'Z', 'Ø', 'Ξ', 'Δ', 'Λ', 'Ω', 'Φ', 'Ψ'
]

export interface IGlitchTextProps {
    text: string | React.ReactNode;
    glitchChars?: string[]
    langage?: string;
    glitchProbability?: number
    glitchDuration?: number
    glitchInterval?: number
    className?: string
    size?: number | string
}

export interface IGlitchChar {
    index: number
    originalChar: string
    isGlitching: boolean
    glitchChar: string
    nextGlitchTime: number
}

//! secure text
export interface CipherSystem {
    name: string;
    fontFamily: string;
    encrypt: (text: string, key?: number) => {
        display: string;
        cipher: string;
    };
}

