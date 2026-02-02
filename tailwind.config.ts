import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Medical Blue (Trust & Healthcare)
        primary: {
          50: '#E8F4F8',
          100: '#C2E3ED',
          200: '#9BD2E2',
          300: '#74C1D7',
          400: '#4DB0CC',
          500: '#2E9BB8', // Base brand color
          600: '#2581A0',
          700: '#1C6788',
          800: '#134D70',
          900: '#0A3358',
        },
        // Accent - Clean Mint (Freshness & Cleanliness)
        accent: {
          50: '#E6F9F5',
          100: '#B8F0E4',
          200: '#8AE7D3',
          300: '#5CDEC2',
          400: '#2ED5B1',
          500: '#1AB69A', // Base accent
          600: '#159580',
          700: '#107466',
          800: '#0B534C',
          900: '#063232',
        },
        // Semantic colors
        success: {
          light: '#D1FAE5',
          DEFAULT: '#10B981',
          dark: '#047857',
        },
        warning: {
          light: '#FEF3C7',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        error: {
          light: '#FEE2E2',
          DEFAULT: '#EF4444',
          dark: '#DC2626',
        },
        info: {
          light: '#DBEAFE',
          DEFAULT: '#3B82F6',
          dark: '#1D4ED8',
        },
        // Glassmorphism colors
        glass: {
          white: 'rgba(255, 255, 255, 0.7)',
          'white-strong': 'rgba(255, 255, 255, 0.85)',
          primary: 'rgba(46, 155, 184, 0.1)',
          accent: 'rgba(26, 182, 154, 0.1)',
        },
      },
      fontFamily: {
        heading: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Display sizes (Apple/Stripe level)
        'display-2xl': ['5rem', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-lg': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        // Standard sizes
        'hero': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'h2': ['2.25rem', { lineHeight: '1.25' }],
        'h3': ['1.875rem', { lineHeight: '1.3' }],
        'h4': ['1.5rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body': ['1rem', { lineHeight: '1.625' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.05em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        'button': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        // Glassmorphism shadows
        'glass': '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
        'glass-hover': '0 16px 48px rgba(0, 0, 0, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.6)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(255, 255, 255, 0.4)',
        // Glow effects
        'glow-primary': '0 0 40px -5px rgba(46, 155, 184, 0.4)',
        'glow-accent': '0 0 40px -5px rgba(26, 182, 154, 0.4)',
        'glow-primary-lg': '0 0 60px -10px rgba(46, 155, 184, 0.5)',
        // Bloom shadows (premium effect)
        'bloom': '0 0 80px -20px rgba(46, 155, 184, 0.3), 0 0 120px -40px rgba(26, 182, 154, 0.2)',
        'bloom-lg': '0 0 120px -30px rgba(46, 155, 184, 0.4), 0 0 180px -60px rgba(26, 182, 154, 0.3)',
        // Elevated shadows
        'elevated-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.1), 0 4px 12px -4px rgba(0, 0, 0, 0.05)',
        'elevated': '0 4px 16px -4px rgba(0, 0, 0, 0.12), 0 8px 24px -8px rgba(0, 0, 0, 0.08)',
        'elevated-lg': '0 8px 32px -8px rgba(0, 0, 0, 0.15), 0 16px 48px -16px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        // Premium gradient mesh
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(185, 60%, 65%, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(165, 60%, 52%, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(185, 60%, 65%, 0.08) 0px, transparent 50%)',
        'gradient-mesh-hero': 'radial-gradient(at 10% 90%, hsla(185, 60%, 65%, 0.12) 0px, transparent 40%), radial-gradient(at 90% 10%, hsla(165, 60%, 52%, 0.1) 0px, transparent 40%)',
        // Premium hero background
        'hero-premium': 'linear-gradient(135deg, rgba(46, 155, 184, 0.03) 0%, rgba(255, 255, 255, 0.98) 50%, rgba(26, 182, 154, 0.03) 100%)',
        // Button gradients
        'gradient-primary': 'linear-gradient(135deg, #2E9BB8 0%, #2581A0 100%)',
        'gradient-accent': 'linear-gradient(135deg, #1AB69A 0%, #159580 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #2581A0 0%, #1C6788 100%)',
        // Animated gradients
        'gradient-shine': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
        'gradient-glow': 'radial-gradient(circle at center, rgba(46, 155, 184, 0.15) 0%, transparent 70%)',
        // Text gradients
        'text-gradient-shine': 'linear-gradient(135deg, #2E9BB8 0%, #1AB69A 50%, #2E9BB8 100%)',
      },
      backdropBlur: {
        'glass': '20px',
        'glass-lg': '30px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        // Premium animations
        'gradient-shift': 'gradientShift 8s ease infinite',
        'ripple': 'ripple 0.6s linear forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'counter': 'counter 2s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-out-right': 'slideOutRight 0.3s ease-out',
        'toast-in': 'toastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'toast-out': 'toastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'progress': 'progress linear forwards',
        // Premium animations
        'shine': 'shine 0.8s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'gradient-x': 'gradientX 3s ease infinite',
        'text-shimmer': 'textShimmer 2.5s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-fast': 'floatFast 4s ease-in-out infinite',
        'scale-up': 'scaleUp 0.3s ease-out',
        'blur-in': 'blurIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // Premium keyframes
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px -5px rgba(46, 155, 184, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px -5px rgba(46, 155, 184, 0.6)' },
        },
        counter: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        toastIn: {
          '0%': { transform: 'translateX(calc(100% + 24px))', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        toastOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(calc(100% + 24px))', opacity: '0' },
        },
        progress: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
        // Premium keyframes
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px -5px rgba(46, 155, 184, 0.4)' },
          '50%': { boxShadow: '0 0 40px -5px rgba(46, 155, 184, 0.6)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        textShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        floatFast: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        blurIn: {
          '0%': { filter: 'blur(10px)', opacity: '0' },
          '100%': { filter: 'blur(0)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}

export default config
