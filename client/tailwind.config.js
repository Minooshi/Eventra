/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#D4AF37', // Metallic Gold
                    light: '#F4CF63',
                    dark: '#A67C00',
                },
                luxury: {
                    black: '#0A0A0B', // Deep Charcoal/Midnight
                    charcoal: '#1A1A1C',
                    gold: 'linear-gradient(135deg, #D4AF37 0%, #F4CF63 50%, #A67C00 100%)',
                },
                accent: '#E5E5E5',
            },
            fontFamily: {
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            backgroundImage: {
                'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F4CF63 50%, #A67C00 100%)',
                'premium-dark': 'linear-gradient(180deg, #0A0A0B 0%, #1A1A1C 100%)',
            },
            boxShadow: {
                'gold-glow': '0 0 20px rgba(212, 175, 55, 0.2)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            }
        },
    },
    plugins: [],
}

