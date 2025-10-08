'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Copy, Lock, Unlock } from 'lucide-react';

const VEX_CONFIG = {
    CHAR_MAP: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ',
    CIPHER_MAP: '◇◈◉◎○●△▲▽▼◁▷⬟⬠⬢⬣⟡⟢⟣⟤⟥⟦⟧⟨⟩⟪⟫◐◑◒◓◔◕◖◗▣⬡⬢⬣⟊⟐⟞⟠⌬ ',
    VEX_DISPLAY_MAP: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij '
};

type CypherConvertProps = {
    timeKey?: number;
    placeholder?: string;
    className?: string;
    onValueChange?: (value: { normal: string; vex: { display: string; cipher: string } }) => void;
    autoVexMode?: boolean;
};

export default function CypherConvert({
    timeKey = 1,
    placeholder = "Tapez votre message...",
    className = "",
    onValueChange = () => { },
    autoVexMode = true
}: CypherConvertProps) {
    const [normalText, setNormalText] = useState('');
    const [displayMode, setDisplayMode] = useState(autoVexMode ? 'vex' : 'normal');
    const [copied, setCopied] = useState(false);
    const [pasted, setPasted] = useState(false);
    const [fontLoaded, setFontLoaded] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const checkFont = () => {
            if (document.fonts && document.fonts.check) {
                setFontLoaded(document.fonts.check('1em Vex'));
            } else {
                setFontLoaded(true);
            }
        };
        checkFont();
        setTimeout(checkFont, 1000);
    }, []);

    const encryptToVex = (text: string) => {
        const upperText = text.toUpperCase();
        if (!upperText) return { display: '', cipher: '' };

        let displayResult = '';
        let cipherResult = '';

        upperText.split('').forEach((char, position) => {
            const charIndex = VEX_CONFIG.CHAR_MAP.indexOf(char);
            if (charIndex === -1) return;

            const temporalShift = timeKey * (position + 1);
            const positionWeight = Math.floor(Math.sin(position * 0.7) * 3) + 3;
            const finalIndex = (charIndex + temporalShift + positionWeight) % VEX_CONFIG.CHAR_MAP.length;

            displayResult += VEX_CONFIG.VEX_DISPLAY_MAP[finalIndex];
            cipherResult += VEX_CONFIG.CIPHER_MAP[finalIndex];
        });

        return { display: displayResult, cipher: cipherResult };
    };

    const decryptFromCipher = (cipherText: string) => {
        if (!cipherText) return '';

        return cipherText.split('').map((char, position) => {
            const cipherIndex = VEX_CONFIG.CIPHER_MAP.indexOf(char);
            if (cipherIndex === -1) return '';

            const temporalShift = timeKey * (position + 1);
            const positionWeight = Math.floor(Math.sin(position * 0.7) * 3) + 3;

            let originalIndex = cipherIndex - temporalShift - positionWeight;
            while (originalIndex < 0) {
                originalIndex += VEX_CONFIG.CHAR_MAP.length;
            }
            originalIndex = originalIndex % VEX_CONFIG.CHAR_MAP.length;

            return VEX_CONFIG.CHAR_MAP[originalIndex];
        }).join('');
    };

    const vexData = encryptToVex(normalText);

    const handleInputChange = (e: { target: { value: string; }; }) => {
        const value = e.target.value.toUpperCase();
        const filteredValue = value.split('').filter(char =>
            VEX_CONFIG.CHAR_MAP.includes(char)
        ).join('');

        setNormalText(filteredValue);

        if (onValueChange) {
            onValueChange({
                normal: filteredValue,
                vex: encryptToVex(filteredValue)
            });
        }
    };

    const handleCopy = async () => {
        try {
            const textToCopy = displayMode === 'vex' ? vexData.cipher : normalText;
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Erreur copie:', error);
        }
    };

    const handlePaste = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();

            const isVexSymbols = clipboardText.split('').every(char =>
                VEX_CONFIG.CIPHER_MAP.includes(char) || char === ' '
            );

            if (isVexSymbols && clipboardText.trim()) {
                const decryptedText = decryptFromCipher(clipboardText);
                setNormalText(decryptedText);
                setPasted(true);
                setTimeout(() => setPasted(false), 2000);
            } else {
                const filteredText = clipboardText.toUpperCase().split('').filter(char =>
                    VEX_CONFIG.CHAR_MAP.includes(char)
                ).join('');
                setNormalText(filteredText);
            }
        } catch (error) {
            console.error('Erreur collage:', error);
        }
    };

    const toggleDisplayMode = () => {
        setDisplayMode(prev => prev === 'normal' ? 'vex' : 'normal');
    };

    const displayText = displayMode === 'vex' ? vexData.display : normalText;

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={toggleDisplayMode} className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${displayMode === 'vex' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                        {displayMode === 'vex' ? (
                            <>
                                <Lock size={16} />
                                Mode Vex
                            </>
                        ) : (
                            <>
                                <Unlock size={16} />
                                Mode Normal
                            </>
                        )}
                    </button>

                    <div className="text-sm text-gray-400">
                        Clé: {timeKey} | {normalText.length} chars
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={handlePaste} className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${pasted ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                        📥
                        {pasted ? 'Collé!' : 'Coller'}
                    </button>

                    <button onClick={handleCopy} disabled={!normalText} className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${copied ? 'bg-green-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed'}`}>
                        <Copy size={16} />
                        {copied ? 'Copié!' : `Copier ${displayMode === 'vex' ? 'Symboles' : 'Texte'}`}
                    </button>
                </div>
            </div>

            <div className="relative">
                <textarea ref={inputRef} value={displayText} onChange={displayMode === 'normal' ? handleInputChange : undefined} placeholder={displayMode === 'normal' ? placeholder : ''} readOnly={displayMode === 'vex'} className={`w-full p-4 rounded-lg border-2 resize-none transition-all duration-300${displayMode === 'vex' ? 'bg-black/80 border-red-500/50 text-red-200 cursor-default vex-font text-xl tracking-wider' : 'bg-gray-900 border-gray-600 text-white focus:border-blue-500'}${displayMode === 'vex' && !fontLoaded ? 'font-mono' : ''} focus:outline-none focus:ring-2 focus:ring-opacity-50${displayMode === 'vex' ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`} rows={4} />

                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${displayMode === 'vex' ? 'bg-red-900/80 text-red-300 border border-red-700/50' : 'bg-gray-800/80 text-gray-400 border border-gray-600/50'}`}>
                    {displayMode === 'vex' ? 'VEX' : 'TXT'}
                </div>
            </div>

            {normalText && displayMode === 'vex' && (
                <div className="p-3 bg-gray-900/70 border border-gray-600/30 rounded-lg">
                    <p className="text-gray-400 text-sm mb-2 font-bold">Debug Info:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div>
                            <span className="text-gray-500">Texte original:</span>
                            <div className="font-mono text-white bg-black/50 p-2 rounded mt-1">{normalText}</div>
                        </div>
                        <div>
                            <span className="text-gray-500">Symboles secrets:</span>
                            <div className="font-mono text-yellow-300 bg-black/50 p-2 rounded mt-1 break-all">{vexData.cipher}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-sm text-gray-500 space-y-1">
                <div>💡 <strong>Mode Normal:</strong> Tapez votre texte normalement</div>
                <div>🔐 <strong>Mode Vex:</strong> Affichage crypté avec votre police (lecture seule)</div>
                <div>📋 <strong>Copie:</strong> {displayMode === 'vex' ? 'Symboles secrets' : 'Texte normal'}</div>
                <div>📥 <strong>Collage:</strong> Auto-détection et déchiffrement des symboles Vex</div>
            </div>
        </div>
    );
};
