import React from 'react'
import Image from 'next/image'

type SettingSvg = {
    width?: number
    height?: number
    color?: string
    variant?: 'default' | 'primary' | 'secondary' | 'fragment' | 'card1' | 'cat' | 'catGradientBlack' | 'catCompact' | 'discord' | 'github' | 'X' | 'linkedin' | 'instagram' | 'facebook'
    className?: string
    text?: string
    smallText?: string
    gradient?: {
        id?: string
        colors: Array<{ color: string; offset: string }>
        direction?: 'horizontal' | 'vertical' | 'diagonal'
    }
}

// ...existing code...

function Default({ width, height, color = "currentColor", gradient }: SettingSvg) {
    const fillValue = gradient ? `url(#${gradient.id || 'defaultGradient'})` : color;

    return (
        <svg width={width} height={height} viewBox="0 0 381 381" fill="none" xmlns="http://www.w3.org/2000/svg">
            {gradient && (
                <defs>
                    <linearGradient
                        id={gradient.id || 'defaultGradient'}
                        x1={gradient.direction === 'vertical' ? '0%' : gradient.direction === 'diagonal' ? '0%' : '0%'}
                        y1={gradient.direction === 'vertical' ? '0%' : gradient.direction === 'diagonal' ? '0%' : '50%'}
                        x2={gradient.direction === 'vertical' ? '0%' : gradient.direction === 'diagonal' ? '100%' : '100%'}
                        y2={gradient.direction === 'vertical' ? '100%' : gradient.direction === 'diagonal' ? '100%' : '50%'}
                    >
                        {gradient.colors.map((colorStop, index) => (
                            <stop key={index} offset={colorStop.offset} stopColor={colorStop.color} />
                        ))}
                    </linearGradient>
                </defs>
            )}
            <path
                d="M297.039 0.0898589C298.42 0.089859 299.539 1.20915 299.539 2.58986V125.59C299.539 126.971 298.411 128.092 297.03 128.066C228.33 126.745 172.884 71.2989 171.563 2.59872C171.537 1.21826 172.658 0.0898535 174.039 0.0898535L297.039 0.0898589Z"
                fill={fillValue} />
            <path
                d="M171.539 150.59C171.539 149.209 172.658 148.09 174.039 148.09L297.039 148.09C298.42 148.09 299.542 149.218 299.515 150.599C298.194 219.299 242.748 274.745 174.048 276.066C172.667 276.092 171.539 274.971 171.539 273.59L171.539 150.59Z"
                fill={fillValue} />
            <path
                d="M80.5391 2.58983C80.5391 1.20912 81.6584 0.0898438 83.0391 0.0898438H149.039C150.42 0.0898438 151.539 1.20913 151.539 2.58984V377.59C151.539 378.971 150.42 380.09 149.039 380.09H83.0391C81.6584 380.09 80.5391 378.971 80.5391 377.59V2.58983Z"
                fill={fillValue} />
        </svg>
    );
}

function Fragment({ width, height, color = "currentColor", gradient }: SettingSvg) {
    const fillValue = gradient ? `url(#${gradient.id || 'fragmentGradient'})` : color;

    return (
        <svg width={width} height={height} viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
            {gradient && (
                <defs>
                    <linearGradient
                        id={gradient.id || 'fragmentGradient'}
                        x1={gradient.direction === 'vertical' ? '0%' : gradient.direction === 'diagonal' ? '0%' : '0%'}
                        y1={gradient.direction === 'vertical' ? '0%' : gradient.direction === 'diagonal' ? '0%' : '50%'}
                        x2={gradient.direction === 'vertical' ? '0%' : gradient.direction === 'diagonal' ? '100%' : '100%'}
                        y2={gradient.direction === 'vertical' ? '100%' : gradient.direction === 'diagonal' ? '100%' : '50%'}
                    >
                        {gradient.colors.map((colorStop, index) => (
                            <stop key={index} offset={colorStop.offset} stopColor={colorStop.color} />
                        ))}
                    </linearGradient>
                </defs>
            )}
            <path d="M125.539 0.0898492C126.92 0.0898493 128.039 1.20914 128.039 2.58985V125.59C128.039 126.971 126.911 128.092 125.53 128.066C56.8301 126.745 1.38388 71.2989 0.0631592 2.59871C0.0366206 1.21825 1.15835 0.0898438 2.53906 0.0898439L125.539 0.0898492Z" fill={fillValue} />
        </svg>
    );
}

function CardBandeau({ width = 547, height = 76, color = "currentColor", text = "default text", smallText = "default small text", gradient }: SettingSvg) {
    const fillValue = gradient ? `url(#${gradient.id || 'cardGradient'})` : color;

    return (
        <div className="relative" style={{ width, height }}>
            <svg width={width} height={height} viewBox="0 0 547 76" className="absolute" fill="fill" xmlns="http://www.w3.org/2000/svg">
                {gradient && (
                    <defs>
                        <linearGradient
                            id={gradient.id || 'cardGradient'}
                            x1={gradient.direction === 'vertical' ? '0%' : gradient.direction === 'diagonal' ? '0%' : '0%'}
                            y1={gradient.direction === 'vertical' ? '0%' : gradient.direction === 'diagonal' ? '0%' : '50%'}
                            x2={gradient.direction === 'vertical' ? '0%' : gradient.direction === 'diagonal' ? '100%' : '100%'}
                            y2={gradient.direction === 'vertical' ? '100%' : gradient.direction === 'diagonal' ? '100%' : '50%'}
                        >
                            {gradient.colors.map((colorStop, index) => (
                                <stop key={index} offset={colorStop.offset} stopColor={colorStop.color} />
                            ))}
                        </linearGradient>
                    </defs>
                )}
                <path
                    d="M0 0H547V45.2514H340.704C334.017 45.2514 327.772 48.5935 324.063 54.1574L315.937 66.3454C312.228 71.9094 305.983 75.2514 299.296 75.2514H0V0Z"
                    fill={fillValue} />
            </svg>
            <div className="absolute px-4 flex flex-col pointer-events-none">
                <span className="text-4xl font-bold">{text}</span>
                <span className="text-2xl px-6">{smallText}</span>
            </div>
        </div>
    );
}

function Cat({ width = 256, height = 256, color = "currentColor", gradient }: SettingSvg) {
    const fillValue = gradient ? `url(#${gradient.id || 'catGradient'})` : color;

    return (
        <svg width={width} height={height} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            {gradient && (
                <defs>
                    <linearGradient
                        id={gradient.id || 'catGradient'}
                        x1={gradient.direction === 'vertical' ? '0%' : gradient.direction === 'diagonal' ? '0%' : '0%'}
                        y1={gradient.direction === 'vertical' ? '0%' : gradient.direction === 'diagonal' ? '0%' : '50%'}
                        x2={gradient.direction === 'vertical' ? '0%' : gradient.direction === 'diagonal' ? '100%' : '100%'}
                        y2={gradient.direction === 'vertical' ? '100%' : gradient.direction === 'diagonal' ? '100%' : '50%'}
                    >
                        {gradient.colors.map((colorStop, index) => (
                            <stop key={index} offset={colorStop.offset} stopColor={colorStop.color} />
                        ))}
                    </linearGradient>
                </defs>
            )}
            {/* Tous les paths avec fillValue au lieu de color */}
            <path d="M83.5238 177.893L53.2324 207.055L14.3887 180.646L28.0917 156.699L28.1253 156.567L28.7091 97.1081L56.8668 137.659L57.324 153.932L83.5238 177.893Z" fill={fillValue} />
            <path d="M57.7114 212.353L95.5866 232.927H73.9846L57.7114 212.353Z" fill={fillValue} />
            <path d="M48.7457 56.3529L28.9364 88.9741L32.5836 3.65625L97.7899 51.8093L91.464 65.9876L34.4253 8.45037L48.7457 56.3529Z" fill={fillValue} />
            <path d="M85.4352 81.8061L104.948 151.032L79.3625 136.115H58.6233L29.5227 94.2073L85.4352 81.8061Z" fill={fillValue} />
            <path d="M100.128 232.736L100.14 232.754L55.2291 208.357L85.7813 178.947L106.779 174.876L106.376 200.259V200.262L126.017 216.153L100.128 232.736Z" fill={fillValue} />
            <path d="M128.001 195.109L146.772 199.58L128.001 214.768L109.23 199.58L128.001 195.109Z" fill={fillValue} />
            <path d="M128.001 217.643L153.754 234.141L128.001 252.344L102.246 234.138L128.001 217.643Z" fill={fillValue} />
            <path d="M87.5016 80.574L100.089 52.3646L128.001 42.934L155.911 52.3646L168.498 80.574L148.162 152.716L146.891 174.424L147.253 197.304L128.001 192.719L108.747 197.304L109.111 174.424L107.838 152.716L87.5016 80.574Z" fill={fillValue} />
            <path d="M160.416 232.927L198.288 212.353L182.018 232.927H160.416Z" fill={fillValue} />
            <path d="M170.221 178.947L200.771 208.357L155.864 232.751L155.875 232.736L129.985 216.153L149.626 200.262L149.624 200.259L149.223 174.876L170.218 178.947H170.221Z" fill={fillValue} />
            <path d="M170.567 81.8087L226.477 94.2047L197.376 136.115H176.637L151.052 151.032L170.567 81.8087Z" fill={fillValue} />
            <path d="M164.536 65.9876L158.21 51.8093L223.416 3.65625L227.066 88.9767L207.254 56.3529L221.577 8.45037L164.536 65.9876Z" fill={fillValue} />
            <path d="M241.611 180.646L202.77 207.058L172.476 177.89L198.676 153.932L199.133 137.662L227.293 97.1055L227.872 156.43L227.874 156.567L241.611 180.646Z" fill={fillValue} />
        </svg>
    )
}


function CatGradientBlack({ width = 256, height = 256, className }: SettingSvg) {
    return (
        <Image src="/svg/cat_gradient.svg" alt="Cat with gradient" width={width} height={height} className={className} />
    )
}

function CatCompact({ width = 64, height = 64, className, color = "currentColor" }: SettingSvg) {
    return (
        <svg width={width} height={height} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <g>
                <path
                    d="M57.702 39.3515V39.3172L57.5529 24.0501L57.4945 21.9586L42.9548 20.113L42.4228 19.7946L40.954 16.5063L41.4013 16.0408L56.082 1.23515L52.3947 13.5625L57.4945 21.9586L56.5555 0L39.7752 12.3938L39.1828 12.5348L31.9996 10.1089L24.8164 12.5348L24.2261 12.3938L7.44578 0L6.50683 21.9566L11.6046 13.5625L7.91929 1.23515L22.598 16.0408L23.0876 16.4116L21.5785 19.7946L21.0465 20.113L6.50683 21.9566L6.4484 24.0501L6.29728 39.3515L6.28922 39.3857L4.75586 45.5494L12.7591 52.3457L13.9117 53.7078L18.0987 59.003H23.6579L25.0985 59.134H25.1005L25.3726 59.3153L31.9996 64L38.6267 59.3153L38.9008 59.134L40.3414 59.003H45.9006L50.0876 53.7078L51.2422 52.3457L50.7263 52.6802L50.9843 52.5129L51.2422 52.3457L59.2434 45.5494L57.702 39.3515ZM27.1699 50.4215L31.9996 49.2709L36.8314 50.4215L31.9996 54.3304L27.1699 50.4215ZM13.8109 38.6745L13.6941 34.4854L14.1454 34.0885H19.4829L26.0677 37.9269L26.8112 38.3601L27.1396 43.9475L26.5392 44.0644L21.1352 45.1121L20.5549 44.8401L13.8109 38.6745ZM42.8661 45.1121L37.4641 44.0644L36.8637 43.9475L37.1901 38.3601L37.9336 37.9269L44.5184 34.0885H49.8559L50.3072 34.4874L50.1904 38.6745L50.0977 38.7591L43.4484 44.8401L42.8681 45.1121H42.8661Z"
                    fill={color} />
            </g>
        </svg>
    )
}

function Discord({ width = 64, height = 64, className, color = "currentColor" }: SettingSvg) {
    return (
        <svg width={width} height={height} viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <g>
                <path d="M20.2875 0C19.9781 0.549325 19.7003 1.1176 19.4477 1.6985C17.0484 1.3386 14.6048 1.3386 12.1991 1.6985C11.9529 1.1176 11.6687 0.549325 11.3593 0C9.10518 0.385175 6.90785 1.06078 4.8242 2.0142C0.694752 8.1326 -0.422848 14.0931 0.132802 19.9716C2.5511 21.7585 5.25988 23.1223 8.14543 23.9937C8.79578 23.1223 9.37038 22.1941 9.86288 21.2281C8.92838 20.8808 8.02545 20.4452 7.16043 19.94C7.38773 19.7759 7.60873 19.6054 7.8234 19.4412C12.8937 21.8279 18.7658 21.8279 23.8424 19.4412C24.057 19.618 24.278 19.7885 24.5053 19.94C23.6403 20.4515 22.7374 20.8808 21.7966 21.2344C22.2891 22.2005 22.8637 23.1287 23.514 24C26.3995 23.1287 29.1083 21.7711 31.5268 19.9842C32.1833 13.1649 30.4028 7.25492 26.8225 2.02052C24.7453 1.0671 22.548 0.391475 20.2938 0.012625L20.2875 0ZM10.5701 16.3536C9.01048 16.3536 7.71608 14.9392 7.71608 13.1902C7.71608 11.4412 8.95995 10.0205 10.5638 10.0205C12.1676 10.0205 13.443 11.4475 13.4177 13.1902C13.3925 14.9329 12.1612 16.3536 10.5701 16.3536ZM21.0894 16.3536C19.5235 16.3536 18.2417 14.9392 18.2417 13.1902C18.2417 11.4412 19.4856 10.0205 21.0894 10.0205C22.6932 10.0205 23.9623 11.4475 23.9371 13.1902C23.9118 14.9329 22.6806 16.3536 21.0894 16.3536Z"
                    fill={color} />
            </g>
        </svg>

    )
}

function X({ width = 64, height = 64, className, color = "currentColor" }: SettingSvg) {
    return (
        <svg width={width} height={height} viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <g>
                <path d="M19.5403 0.160156H23.2203L15.1403 9.36016L24.5803 21.8402H17.1723L11.3723 14.2562L4.73227 21.8402H1.05227L9.61227 12.0002L0.572266 0.160156H8.16427L13.4043 7.08816L19.5403 0.160156ZM18.2523 19.6802H20.2923L7.09227 2.24016H4.90027L18.2523 19.6802Z" fill={color} />
            </g>
        </svg>

    )
}

export default function ComponentSvg({ width = 100, height = 100, color = "currentColor", variant = 'default', text, smallText, gradient }: SettingSvg) {
    switch (variant) {
        case 'fragment':
            return <Fragment width={width} height={height} color={color} gradient={gradient} />
        case 'card1':
            return <CardBandeau width={width} height={height} color={color} text={text} smallText={smallText} gradient={gradient} />
        case 'cat':
            return <Cat width={width} height={height} color={color} gradient={gradient} />
        case 'catGradientBlack':
            return <CatGradientBlack width={width} height={height} />
        case 'catCompact':
            return <CatCompact width={width} height={height} color={color} />
        case 'discord':
            return <Discord width={width} height={height} color={color} />
        case 'X':
            return <X width={width} height={height} color={color} />
        default:
            return <Default width={width} height={height} color={color} gradient={gradient} />
    }
}