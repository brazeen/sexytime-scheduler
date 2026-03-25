/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    pink: '#ff00ff',
                    blue: '#00ffff',
                    green: '#39ff14',
                    indigo: '#4b0082', // Deep indigo for backgrounds
                    dark: '#0a0a0a',   // Main background
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                'neon-pink': '0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff',
                'neon-blue': '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff',
                'neon-green': '0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 20px #39ff14',
            },
            animation: {
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #ff00ff' },
                    '100%': { boxShadow: '0 0 20px #ff00ff, 0 0 30px #ff00ff' },
                }
            }
        },
    },
    plugins: [],
}
