/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Animation configurations
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      
      // Transition configurations
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      
      // Layout configurations
      spacing: {
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
      },
      
      // Color palette - accessible in both light and dark modes
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dce3fe',
          300: '#c2ceff',
          400: '#a5b4ff',
          500: '#818dff', // Primary brand color
          600: '#666eff',
          700: '#4d4dff',
          800: '#3333ff',
          900: '#0000ff',
        },
      },
      
      // Responsive breakpoints
      screens: {
        'xs': '475px',
      }
    },
  },
  // Required plugins
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-animate'),
  ],
}
