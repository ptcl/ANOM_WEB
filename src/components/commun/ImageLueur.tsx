'use client';
import React from 'react'
import Image from 'next/image';

interface ImageLueurProps {
    lueurImage?: string;
    patternImage?: string;
    lueurOpacity?: number;
    patternOpacity?: number;
    showDoubleLueur?: boolean;
    lueurQuality?: number;
    patternQuality?: number;
    alt?: string;
    imageType?: 'auto' | 'anom' | 'vex' | 'neutre' | 'protocol' | 'custom';
}

export default function ImageLueur({ lueurImage, patternImage = "/img/pattern/grid.png", lueurOpacity = 1, patternOpacity = 0.1, showDoubleLueur = true, lueurQuality = 50, patternQuality = 20, alt = "Background Effect", imageType = 'auto' }: ImageLueurProps) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const getAutoLueurImage = () => {
        if (imageType !== 'auto') {
            switch (imageType) {
                case 'anom':
                    return '/img/glow/anom.png';
                case 'vex':
                    return '/img/glow/vex.png';
                case 'protocol':
                    return '/img/glow/protocol.png';
                case 'neutre':
                    return '/img/glow/neutre.png';
                case 'custom':
                    return lueurImage || '/img/glow/neutre.png';
                default:
                    return '/img/glow/neutre.png';
            }
        }

        if (!mounted) {
            return '/img/glow/neutre.png';
        }

        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

        if (currentPath.includes('/cipher') || currentPath.includes('/vex')) {
            return '/img/glow/vex.png';
        }

        if (currentPath.includes('/protocol')) {
            return '/img/glow/protocol.png';
        }


        if (currentPath.includes('/identity') || currentPath.includes('/auth')) {
            return '/img/glow/protocol.png';
        }

        return '/img/glow/anom.png';
    };

    const finalLueurImage = lueurImage || getAutoLueurImage();
    return (
        <>
            <div className='absolute inset-0 w-full h-full overflow-hidden pointer-events-none'>
                <Image src={finalLueurImage} alt={alt} fill className='z-20 md:object-cover' style={{ objectFit: 'fill', objectPosition: 'center', opacity: lueurOpacity }} quality={lueurQuality} />
                {showDoubleLueur && (
                    <Image src={finalLueurImage} alt={alt} fill className='z-20 md:object-cover' style={{ objectFit: 'fill', objectPosition: 'center', opacity: lueurOpacity }} quality={lueurQuality} />)}
                <Image src={patternImage} alt={alt} fill className="z-1 mask-radial-top object-cover" style={{ opacity: patternOpacity }} quality={patternQuality} />
            </div>
        </>
    )
}
