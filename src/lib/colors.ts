interface RGB {
    r: number
    g: number
    b: number
}

function hexToRgb(hex: string): RGB {
    const cleaned = hex.replace('#', '')
    return {
        r: parseInt(cleaned.slice(0, 2), 16),
        g: parseInt(cleaned.slice(2, 4), 16),
        b: parseInt(cleaned.slice(4, 6), 16),
    }
}

function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b]
        .map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0'))
        .join('')
}

/** Mixes a color towards a target by `amount` (0 = original, 1 = target) */
function mix(color: RGB, target: RGB, amount: number): string {
    return rgbToHex(
        color.r + (target.r - color.r) * amount,
        color.g + (target.g - color.g) * amount,
        color.b + (target.b - color.b) * amount,
    )
}

const WHITE: RGB = { r: 255, g: 255, b: 255 }
const BLACK: RGB = { r: 0, g: 0, b: 0 }

/**
 * Generates a full color scale (50–950) from a single hex color.
 * The input color is used as the 500 (base) value.
 * Lighter shades (50–400) are mixed towards white.
 * Darker shades (600–950) are mixed towards black.
 */
export function generateColorScale(hex: string): Record<number, string> {
    const rgb = hexToRgb(hex)

    return {
        50:  mix(rgb, WHITE, 0.95),
        100: mix(rgb, WHITE, 0.88),
        200: mix(rgb, WHITE, 0.75),
        300: mix(rgb, WHITE, 0.55),
        400: mix(rgb, WHITE, 0.30),
        500: hex,
        600: mix(rgb, BLACK, 0.15),
        700: mix(rgb, BLACK, 0.30),
        800: mix(rgb, BLACK, 0.45),
        900: mix(rgb, BLACK, 0.60),
        950: mix(rgb, BLACK, 0.75),
    }
}

/** All step values in the color scale */
export const COLOR_SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
