/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Colores de marca Tramitia
        primary: {
          DEFAULT: '#23265a',
          50: '#f0f1f8',
          100: '#e0e2f0',
          200: '#c1c5e1',
          300: '#9298c7',
          400: '#6269ac',
          500: '#3d4485',
          600: '#23265a',
          700: '#1d2049',
          800: '#171937',
          900: '#101226',
        },
        accent: {
          DEFAULT: '#ed5823',
          50: '#fef3ee',
          100: '#fde4d9',
          200: '#fbc6b2',
          300: '#f8a080',
          400: '#f47144',
          500: '#ed5823',
          600: '#de3f12',
          700: '#b82e11',
          800: '#932716',
          900: '#772315',
        },
        muted: {
          DEFAULT: '#bfbfbf',
          light: '#f0efef',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
