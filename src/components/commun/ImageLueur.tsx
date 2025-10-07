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
}

export default function ImageLueur({ lueurImage = "/img/glow/neutre.png", patternImage = "/img/pattern/grid.png", lueurOpacity = 1, patternOpacity = 0.1, showDoubleLueur = true, lueurQuality = 50, patternQuality = 20, alt = "Background Effect" }: ImageLueurProps) {
    return (
        <>
            <div className='absolute inset-0 w-full h-full overflow-hidden pointer-events-none'>
                <Image src={lueurImage} alt={alt} fill className='z-20 md:object-cover' style={{ objectFit: 'fill', objectPosition: 'center', opacity: lueurOpacity }} quality={lueurQuality} />
                {showDoubleLueur && (
                    <Image src={lueurImage} alt={alt} fill className='z-20 md:object-cover' style={{ objectFit: 'fill', objectPosition: 'center', opacity: lueurOpacity }} quality={lueurQuality} />)}
                <Image src={patternImage} alt={alt} fill className="z-1 mask-radial-top object-cover" style={{ opacity: patternOpacity }} quality={patternQuality} />
            </div>
        </>
    )
}
