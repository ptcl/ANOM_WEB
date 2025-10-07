'use client';
import React, { useEffect, useRef } from 'react';
import '../../css/secureText.css'
import { CipherSystem } from '@/types/effect';
import { VexCipher } from '@/types/cipherLangage';



interface SecureTextProps {
    children: string;
    cipher?: CipherSystem;
    encryptionKey?: number;
    className?: string;
    style?: React.CSSProperties;
}


export default function SecureText({ children, cipher = VexCipher, encryptionKey = 1, className = '', style = {} }: SecureTextProps) {
    const spanRef = useRef<HTMLSpanElement>(null);
    const encrypted = cipher.encrypt(children, encryptionKey);

    useEffect(() => {
        const span = spanRef.current;
        if (!span) return;

        const replaceContent = () => {
            const computedStyle = window.getComputedStyle(span);
            const originalColor = computedStyle.color;

            const vexSpan = document.createElement('span');
            vexSpan.textContent = encrypted.display;
            vexSpan.style.visibility = 'hidden';
            vexSpan.style.position = 'absolute';
            vexSpan.style.fontSize = computedStyle.fontSize;
            vexSpan.style.fontFamily = cipher.fontFamily;
            document.body.appendChild(vexSpan);
            const vexWidth = vexSpan.offsetWidth;
            document.body.removeChild(vexSpan);

            const normalSpan = document.createElement('span');
            normalSpan.textContent = encrypted.cipher;
            normalSpan.style.visibility = 'hidden';
            normalSpan.style.position = 'absolute';
            normalSpan.style.fontSize = computedStyle.fontSize;
            normalSpan.style.fontFamily = computedStyle.fontFamily;
            document.body.appendChild(normalSpan);
            const normalWidth = normalSpan.offsetWidth;
            document.body.removeChild(normalSpan);

            const scaleRatio = normalWidth > 0 && vexWidth > 0 ? normalWidth / vexWidth : 1;

            span.textContent = encrypted.cipher;

            span.classList.add('secure-text');

            span.style.setProperty('--display-text', `"${encrypted.display}"`);
            span.style.setProperty('--cipher-font', cipher.fontFamily);
            span.style.setProperty('--original-color', originalColor || 'white');
            span.style.setProperty('--scale-ratio', scaleRatio.toString());
            span.style.color = 'transparent';
            span.style.position = 'relative';
        };

        setTimeout(replaceContent, 0);

        const handleCopy = (e: ClipboardEvent) => {
            e.clipboardData?.setData('text/plain', encrypted.cipher);
            e.preventDefault();
        };

        span.addEventListener('copy', handleCopy);
        return () => {
            span.removeEventListener('copy', handleCopy);
            span.classList.remove('secure-text');
        };
    }, [children, encryptionKey, cipher, encrypted.display, encrypted.cipher]);

    return (
        <>
            <span ref={spanRef} className={`select-none ${className} ml-1 mr-1`} style={style} data-cipher={cipher.name}>
                {encrypted.display}
            </span>
        </>
    );
};
