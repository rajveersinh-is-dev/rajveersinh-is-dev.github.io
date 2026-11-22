/** @type {import('tailwindcss').Config} */

function withOpacity(varName, fallback) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `color-mix(in srgb, var(${varName}, ${fallback}) calc(${opacityValue} * 100%), transparent)`;
    }
    return `var(${varName}, ${fallback})`;
  };
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dual Palette Direct Tokens (CSS variable-driven with Night Study defaults & opacity support)
        paper: {
          bg: {
            base: withOpacity('--paper-bg-base', '#121110'),
            subtle: withOpacity('--paper-bg-subtle', '#1a1816'),
            elevated: withOpacity('--paper-bg-elevated', '#24211e'),
          },
          border: {
            subtle: withOpacity('--paper-border-subtle', '#38332d'),
            strong: withOpacity('--paper-border-strong', '#5c5449'),
          },
        },
        night: {
          bg: {
            base: '#121110',
            subtle: '#1a1816',
            elevated: '#24211e',
          },
          border: {
            subtle: '#38332d',
            strong: '#5c5449',
          },
          ink: {
            primary: '#ede8df',
            secondary: '#bab2a4',
            muted: '#7a7266',
            dim: '#5c5449',
          },
          seal: '#be123c',
          cobalt: '#60a5fa',
          amber: '#d97706',
        },
        ink: {
          primary: withOpacity('--ink-primary', '#ede8df'),
          secondary: withOpacity('--ink-secondary', '#bab2a4'),
          muted: withOpacity('--ink-muted', '#7a7266'),
          dim: withOpacity('--ink-dim', '#5c5449'),
        },
        academic: {
          seal: withOpacity('--academic-seal', '#be123c'),
          cobalt: withOpacity('--academic-cobalt', '#60a5fa'),
          amber: withOpacity('--academic-amber', '#d97706'),
          'seal-night': '#be123c',
          'cobalt-night': '#60a5fa',
          'amber-night': '#d97706',
        },
        // Semantic CSS Variable Tokens (Dynamically adapt between Archival Paper & Deep Espresso Slate)
        bg: {
          void: withOpacity('--bg-void', '#121110'),
          base: withOpacity('--bg-base', '#1a1816'),
          surface: withOpacity('--bg-surface', '#1a1816'),
          elevated: withOpacity('--bg-elevated', '#24211e'),
          card: withOpacity('--bg-card', '#1a1816'),
          cardHover: withOpacity('--bg-cardHover', '#24211e'),
        },
        border: {
          subtle: withOpacity('--border-subtle', '#38332d'),
          medium: withOpacity('--border-medium', '#5c5449'),
          highlight: withOpacity('--border-highlight', '#5c5449'),
        },
        text: {
          primary: withOpacity('--text-primary', '#ede8df'),
          secondary: withOpacity('--text-secondary', '#bab2a4'),
          muted: withOpacity('--text-muted', '#7a7266'),
          dim: withOpacity('--text-dim', '#5c5449'),
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#d97706',
          500: '#92400e',
          600: '#78350f',
          700: '#451a03',
          800: '#291002',
          900: '#140801',
          accent: '#92400e',
        },
      },
      fontFamily: {
        serif: [
          '"Computer Modern"',
          '"Latin Modern Roman"',
          'Charter',
          '"Bitstream Charter"',
          '"STIX Two Text"',
          'Garamond',
          '"EB Garamond"',
          'Georgia',
          'Cambria',
          '"Times New Roman"',
          'serif',
        ],
        math: [
          '"STIX Two Math"',
          '"Latin Modern Math"',
          '"Cambria Math"',
          '"KaTeX_Math"',
          'serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          '"Iosevka"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
