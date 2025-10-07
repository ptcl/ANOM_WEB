import { CipherSystem } from "./effect";

export const VexCipher: CipherSystem = {
    name: 'Vex',
    fontFamily: 'Vex, monospace',
    encrypt: (text: string, key = 1) => {
        const charMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ';
        const cipherMap = '◇◈◉◎○●△▲▽▼◁▷⬟⬠⬢⬣⟡⟢⟣⟤⟥⟦⟧⟨⟩⟪⟫◐◑◒◓◔◕◖◗▣⬡⬢⬣⟊⟐⟞⟠⌬ ';
        const displayMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij ';

        const upperText = text.toUpperCase();
        let display = '';
        let cipher = '';

        for (let i = 0; i < upperText.length; i++) {
            const char = upperText[i];
            const charIndex = charMap.indexOf(char);

            if (charIndex === -1) continue;

            const shift = (key * (i + 1) + Math.floor(Math.sin(i * 0.7) * 3) + 3) % charMap.length;
            const finalIndex = (charIndex + shift) % charMap.length;

            display += displayMap[finalIndex];
            cipher += cipherMap[finalIndex];
        }

        return { display, cipher };
    }
};