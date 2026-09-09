import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Direct DESIGN.md tokens
        surface: {
          DEFAULT: '#fff8f3',
          dim: '#e1d9cf',
          bright: '#fff8f3',
          variant: '#eae1d7',
          'container-lowest': '#ffffff',
          'container-low': '#fbf2e8',
          'container': '#f6ece3',
          'container-high': '#f0e7dd',
          'container-highest': '#eae1d7',
        },
        'on-surface': {
          DEFAULT: '#1f1b15',
          variant: '#59413d',
        },
        'inverse-surface': '#343029',
        'inverse-on-surface': '#f8efe5',
        outline: {
          DEFAULT: '#8d716c',
          variant: '#e1bfba',
          subtle: '#e8e4dc',
        },
        'surface-tint': '#ae3123',
        primary: {
          DEFAULT: '#ae3123',
          foreground: '#ffffff',
          container: '#ff6b57',
          'on-container': '#6c0000',
          fixed: '#ffdad4',
          'fixed-dim': '#ffb4a8',
          'on-fixed': '#410000',
          'on-fixed-variant': '#8c170e',
        },
        secondary: {
          DEFAULT: '#0f9b8e',
          dark: '#006a61',
          foreground: '#ffffff',
          container: '#84f6e6',
          'on-container': '#007167',
          fixed: '#84f6e6',
          'fixed-dim': '#66d9ca',
          'on-fixed': '#00201d',
          'on-fixed-variant': '#005049',
        },
        tertiary: {
          DEFAULT: '#f4a261',
          dark: '#8e4e14',
          container: '#d6894a',
          'on-container': '#512700',
          fixed: '#ffdcc4',
          'fixed-dim': '#ffb780',
          'on-fixed': '#2f1400',
          'on-fixed-variant': '#6f3800',
        },
        error: {
          DEFAULT: '#ba1a1a',
          foreground: '#ffffff',
          container: '#ffdad6',
          'on-container': '#93000a',
        },
        background: '#fff8f3',
        'on-background': '#1f1b15',

        // Core Brand Named Aliases
        cream: {
          50: '#ffffff',
          100: '#fff8f3',
          200: '#faf7f2',
          300: '#f6ece3',
          400: '#f0e7dd',
          500: '#eae1d7',
          600: '#e1d9cf',
        },
        coral: {
          DEFAULT: '#ff6b57',
          hover: '#ff7d6b',
          deep: '#ae3123',
          subtle: '#fff0ed',
        },
        teal: {
          DEFAULT: '#0f9b8e',
          dark: '#006a61',
          container: '#84f6e6',
          subtle: '#e6f7f5',
        },
        amber: {
          DEFAULT: '#f4a261',
          dark: '#8e4e14',
          container: '#d6894a',
          subtle: '#fef5ec',
        },
        charcoal: {
          DEFAULT: '#1f1b15',
          muted: '#59413d',
          soft: '#4a453e',
          light: '#787168',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 2px 6px -1px rgba(74, 69, 62, 0.04)',
        DEFAULT: '0 4px 20px -2px rgba(74, 69, 62, 0.04), 0 2px 6px -1px rgba(74, 69, 62, 0.02)',
        md: '0 6px 24px -3px rgba(74, 69, 62, 0.06), 0 3px 8px -2px rgba(74, 69, 62, 0.03)',
        lg: '0 12px 32px -4px rgba(74, 69, 62, 0.08), 0 4px 12px -2px rgba(74, 69, 62, 0.03)',
        xl: '0 20px 40px -6px rgba(74, 69, 62, 0.12), 0 8px 16px -4px rgba(74, 69, 62, 0.04)',
        coral: '0 8px 24px -4px rgba(255, 107, 87, 0.28)',
        teal: '0 8px 24px -4px rgba(15, 155, 142, 0.24)',
      },
      spacing: {
        'space-xxs': '0.25rem',
        'space-xs': '0.5rem',
        'space-sm': '0.75rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
        'space-2xl': '3rem',
        'space-3xl': '4.5rem',
      }
    },
  },
  plugins: [],
};

export default config;
