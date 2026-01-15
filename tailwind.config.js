/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: NativeWind v4 uses "content" differently, but for standard setup:
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./App.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0A0A0A',
          secondary: '#141414',
          tertiary: '#1E1E1E',
        },
        primary: { // Keeping primary for backward compatibility
          DEFAULT: '#0A0A0A',
          secondary: '#141414',
          tertiary: '#1E1E1E',
        },
        accent: {
          DEFAULT: '#1D9BF0', // X Blue
          primary: '#1D9BF0',
          hover: '#1A8CD8',
          pressed: '#1780C6',
          light: 'rgba(29, 155, 240, 0.1)',
          glow: 'rgba(29, 155, 240, 0.3)',
        },
        frosted: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.12)',
          pressed: 'rgba(255, 255, 255, 0.06)',
          border: 'rgba(255, 255, 255, 0.12)',
        },
        text: {
          primary: '#FFFFFF',
          secondary: 'rgba(255, 255, 255, 0.6)',
          tertiary: 'rgba(255, 255, 255, 0.4)',
          disabled: 'rgba(255, 255, 255, 0.3)',
        },
        semantic: {
          success: '#00D66F',
          error: '#F4212E',
          warning: '#FFD60A',
        },
        // Status aliases for backward compatibility
        status: {
          success: '#00D66F',
          error: '#F4212E',
          warning: '#FFD60A',
        },
      },
      fontFamily: {
        display: ["CooperOldStyle-Bold", "Georgia", "serif"],
        h1: ["CooperOldStyle-Bold", "Georgia", "serif"],
        body: ["CooperOldStyle-Regular", "System", "sans-serif"],
        medium: ["CooperOldStyle-Medium", "System", "sans-serif"],
      },
      fontSize: {
        // Typography Scale
        display: ['48px', { lineHeight: '56px', letterSpacing: '-0.5px' }],
        h1: ['32px', { lineHeight: '40px', letterSpacing: '-0.3px' }],
        h2: ['24px', { lineHeight: '32px', letterSpacing: '-0.2px' }],
        h3: ['20px', { lineHeight: '28px', letterSpacing: '0px' }],
        body: ['16px', { lineHeight: '24px', letterSpacing: '0px' }],
        caption: ['14px', { lineHeight: '20px', letterSpacing: '0.1px' }],
        overline: ['12px', { lineHeight: '16px', letterSpacing: '0.5px' }],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(29, 155, 240, 0.3)',
        'glow-success': '0 0 20px rgba(0, 214, 111, 0.3)',
        'glow-error': '0 0 20px rgba(244, 33, 46, 0.3)',
        'glow-warning': '0 0 20px rgba(255, 214, 10, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
