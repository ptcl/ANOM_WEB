module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        "accent-mono",
        "accent-bray",
        "accent-protocol",
        "accent-red",
    ],
    theme: {
        extend: {
            colors: {
                accent: "var(--accent)",
                "accent-light": "var(--accent-light)",
                "accent-dark": "var(--accent-dark)",
            }
        }
    }
};
