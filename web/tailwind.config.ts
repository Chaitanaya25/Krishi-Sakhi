import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New color palette as specified
        navy: '#023047',      // Deep Navy for navbar
        teal: '#219EBC',     // Teal Blue for headings
        yellow: '#FFB703',   // Yellow for primary buttons and active tabs
        orange: '#FB8500',   // Orange for alerts/warnings
        lightblue: '#8ECAE6', // Light Blue for secondary buttons
        background: '#F9FAFB', // Very light gray for background
        
        // Keep existing colors for backward compatibility
        primary: '#219EBC',  // Updated to teal
        accent: '#FFB703',   // Updated to yellow
        muted: '#6b7280',    // gray-500 (unchanged)
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.1)',
        'soft': '0 4px 12px rgba(0,0,0,0.05)',
        'card': '0 2px 10px rgba(0,0,0,0.04)',
      },
      backdropBlur: {
        xs: '2px'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
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
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
} satisfies Config