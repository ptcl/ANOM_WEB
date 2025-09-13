import React from 'react'

type SettingSvg = {
    width?: number
    height?: number
    color?: string
    variant?: 'default' | 'primary' | 'secondary' | 'fragment' | 'card1' | 'cat'
    className?: string
    text?: string
    smallText?: string
}


function Default({ width, height, color = "currentColor" }: SettingSvg) {
    return (
        <svg width={width} height={height} viewBox="0 0 381 381" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M297.039 0.0898589C298.42 0.089859 299.539 1.20915 299.539 2.58986V125.59C299.539 126.971 298.411 128.092 297.03 128.066C228.33 126.745 172.884 71.2989 171.563 2.59872C171.537 1.21826 172.658 0.0898535 174.039 0.0898535L297.039 0.0898589Z"
                fill={color} />
            <path
                d="M171.539 150.59C171.539 149.209 172.658 148.09 174.039 148.09L297.039 148.09C298.42 148.09 299.542 149.218 299.515 150.599C298.194 219.299 242.748 274.745 174.048 276.066C172.667 276.092 171.539 274.971 171.539 273.59L171.539 150.59Z"
                fill={color} />
            <path
                d="M80.5391 2.58983C80.5391 1.20912 81.6584 0.0898438 83.0391 0.0898438H149.039C150.42 0.0898438 151.539 1.20913 151.539 2.58984V377.59C151.539 378.971 150.42 380.09 149.039 380.09H83.0391C81.6584 380.09 80.5391 378.971 80.5391 377.59V2.58983Z"
                fill={color} />
        </svg>
    );
}
function Fragment({ width, height, color = "currentColor" }: SettingSvg) {
    return (
        <svg width={width} height={height} viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M125.539 0.0898492C126.92 0.0898493 128.039 1.20914 128.039 2.58985V125.59C128.039 126.971 126.911 128.092 125.53 128.066C56.8301 126.745 1.38388 71.2989 0.0631592 2.59871C0.0366206 1.21825 1.15835 0.0898438 2.53906 0.0898439L125.539 0.0898492Z" fill={color} />
        </svg>

    );
}
function CardBandeau({ width = 547, height = 76, color = "currentColor", text = "default text", smallText = "default small text" }: SettingSvg) {
    return (
        <div className="relative" style={{ width, height }}>
            <svg width={width} height={height} viewBox="0 0 547 76" className="absolute" fill="fill" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M0 0H547V45.2514H340.704C334.017 45.2514 327.772 48.5935 324.063 54.1574L315.937 66.3454C312.228 71.9094 305.983 75.2514 299.296 75.2514H0V0Z"
                    fill={color} />
            </svg>
            <div className="absolute px-4 flex flex-col pointer-events-none">
                <span className="text-4xl font-bold">{text}</span>
                <span className="text-2xl px-6">{smallText}</span>
            </div>
        </div>

    );
}

function Cat({ width = 256, height = 256, color = "currentColor" }: SettingSvg) {
    return (
        <svg width={width} height={height} viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M83.5238 177.893L53.2324 207.055L14.3887 180.646L28.0917 156.699L28.1253 156.567L28.7091 97.1081L56.8668 137.659L57.324 153.932L83.5238 177.893Z" fill={color} />
            <path d="M57.7114 212.353L95.5866 232.927H73.9846L57.7114 212.353Z" fill={color} />
            <path d="M48.7457 56.3529L28.9364 88.9741L32.5836 3.65625L97.7899 51.8093L91.464 65.9876L34.4253 8.45037L48.7457 56.3529Z" fill={color} />
            <path d="M85.4352 81.8061L104.948 151.032L79.3625 136.115H58.6233L29.5227 94.2073L85.4352 81.8061Z" fill={color} />
            <path d="M100.128 232.736L100.14 232.754L55.2291 208.357L85.7813 178.947L106.779 174.876L106.376 200.259V200.262L126.017 216.153L100.128 232.736Z" fill={color} />
            <path d="M128.001 195.109L146.772 199.58L128.001 214.768L109.23 199.58L128.001 195.109Z" fill={color} />
            <path d="M128.001 217.643L153.754 234.141L128.001 252.344L102.246 234.138L128.001 217.643Z" fill={color} />
            <path d="M87.5016 80.574L100.089 52.3646L128.001 42.934L155.911 52.3646L168.498 80.574L148.162 152.716L146.891 174.424L147.253 197.304L128.001 192.719L108.747 197.304L109.111 174.424L107.838 152.716L87.5016 80.574Z" fill={color} />
            <path d="M160.416 232.927L198.288 212.353L182.018 232.927H160.416Z" fill={color} />
            <path d="M170.221 178.947L200.771 208.357L155.864 232.751L155.875 232.736L129.985 216.153L149.626 200.262L149.624 200.259L149.223 174.876L170.218 178.947H170.221Z" fill={color} />
            <path d="M170.567 81.8087L226.477 94.2047L197.376 136.115H176.637L151.052 151.032L170.567 81.8087Z" fill={color} />
            <path d="M164.536 65.9876L158.21 51.8093L223.416 3.65625L227.066 88.9767L207.254 56.3529L221.577 8.45037L164.536 65.9876Z" fill={color} />
            <path d="M241.611 180.646L202.77 207.058L172.476 177.89L198.676 153.932L199.133 137.662L227.293 97.1055L227.872 156.43L227.874 156.567L241.611 180.646Z" fill={color} />
        </svg>

    )
}


export default function ComponentSvg({ width = 100, height = 100, color = "currentColor", variant = 'default', text, smallText }: SettingSvg) {
    switch (variant) {
        case 'fragment':
            return <Fragment width={width} height={height} color={color} />
        case 'card1':
            return <CardBandeau width={width} height={height} color={color} text={text} smallText={smallText} />
        case 'cat':
            return <Cat width={width} height={height} color={color} />
        default:
            return <Default width={width} height={height} color={color} />
    }
}
