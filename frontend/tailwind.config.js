/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色调 - 深邃神秘的紫蓝色系
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d9fe',
          300: '#a5c4fe',
          400: '#7c9ff2',
          500: '#5b7fdb',
          600: '#4a5fb8',
          700: '#3e4a9f',
          800: '#363c7f',
          900: '#2f305f',
        },
        // 神秘金色系
        golden: {
          50: '#fffdf0',
          100: '#fefce8',
          200: '#fef9c3',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // 深邃夜空色系
        midnight: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // 卦象色彩 - 使用传统颜色
        trigram: {
          yang: '#000000', // 阳 - 黑色 (传统颜色)
          yin: '#ffffff',  // 阴 - 白色 (传统颜色)
          changing: '#dc2626', // 变爻 - 红色
        },
        // 占卜元素色系
        mystical: {
          purple: '#7c3aed',   // 神秘紫
          indigo: '#4f46e5',   // 靛蓝
          teal: '#14b8a6',     // 青绿
          rose: '#f43f5e',     // 玫瑰红
        }
      },
      fontFamily: {
        sans: ['"Microsoft YaHei"', '"PingFang SC"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['"Noto Serif SC"', '"SimSun"', 'serif'],
      },
      backgroundImage: {
        'cosmic-gradient': 'radial-gradient(ellipse at top, #1e3a8a 0%, #1e1b4b 50%, #0f172a 100%)',
        'mystical-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'golden-gradient': 'linear-gradient(135deg, #fde047 0%, #eab308 100%)',
        'divination-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a78bfa' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'rotate-slow': 'rotate 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'coin-flip-3d': 'coinFlip3D 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'coin-toss-arc': 'coinTossArc 2.5s ease-in-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
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
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(124, 58, 237, 0.8)',
            transform: 'scale(1.05)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // 增强版3D铜钱翻转动画 - 真实物理效果
        coinFlip3D: {
          '0%': {
            transform: 'translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)',
            opacity: '1'
          },
          '5%': {
            transform: 'translateY(-40px) translateZ(80px) rotateX(90deg) rotateY(60deg) rotateZ(45deg) scale(0.95)',
            opacity: '1'
          },
          '15%': {
            transform: 'translateY(-120px) translateZ(180px) rotateX(270deg) rotateY(180deg) rotateZ(135deg) scale(0.85)',
            opacity: '1'
          },
          '25%': {
            transform: 'translateY(-180px) translateZ(220px) rotateX(450deg) rotateY(300deg) rotateZ(225deg) scale(0.8)',
            opacity: '1'
          },
          '35%': {
            transform: 'translateY(-200px) translateZ(200px) rotateX(630deg) rotateY(420deg) rotateZ(315deg) scale(0.78)',
            opacity: '1'
          },
          '50%': {
            transform: 'translateY(-160px) translateZ(150px) rotateX(900deg) rotateY(540deg) rotateZ(405deg) scale(0.85)',
            opacity: '1'
          },
          '65%': {
            transform: 'translateY(-100px) translateZ(100px) rotateX(1170deg) rotateY(660deg) rotateZ(495deg) scale(0.92)',
            opacity: '1'
          },
          '80%': {
            transform: 'translateY(-40px) translateZ(40px) rotateX(1440deg) rotateY(780deg) rotateZ(585deg) scale(0.98)',
            opacity: '1'
          },
          '90%': {
            transform: 'translateY(-8px) translateZ(10px) rotateX(1620deg) rotateY(840deg) rotateZ(630deg) scale(0.99)',
            opacity: '1'
          },
          '95%': {
            transform: 'translateY(-2px) translateZ(3px) rotateX(1710deg) rotateY(870deg) rotateZ(645deg) scale(1)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(0px) translateZ(0px) rotateX(1800deg) rotateY(900deg) rotateZ(660deg) scale(1)',
            opacity: '1'
          }
        },
        // 真实抛物线轨迹 - 重力加速度
        coinTossArc: {
          '0%': {
            transform: 'translateY(0px) translateX(0px) scale(1)',
            opacity: '1'
          },
          '10%': {
            transform: 'translateY(-50px) translateX(15px) scale(0.95)',
            opacity: '1'
          },
          '20%': {
            transform: 'translateY(-90px) translateX(28px) scale(0.9)',
            opacity: '1'
          },
          '30%': {
            transform: 'translateY(-120px) translateX(40px) scale(0.85)',
            opacity: '1'
          },
          '40%': {
            transform: 'translateY(-135px) translateX(50px) scale(0.82)',
            opacity: '1'
          },
          '50%': {
            transform: 'translateY(-140px) translateX(58px) scale(0.8)',
            opacity: '1'
          },
          '60%': {
            transform: 'translateY(-130px) translateX(64px) scale(0.82)',
            opacity: '1'
          },
          '70%': {
            transform: 'translateY(-105px) translateX(67px) scale(0.86)',
            opacity: '1'
          },
          '80%': {
            transform: 'translateY(-65px) translateX(66px) scale(0.92)',
            opacity: '1'
          },
          '90%': {
            transform: 'translateY(-20px) translateX(58px) scale(0.97)',
            opacity: '1'
          },
          '95%': {
            transform: 'translateY(-5px) translateX(48px) scale(0.99)',
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(0px) translateX(0px) scale(1)',
            opacity: '1'
          }
        },
        // 落地弹跳效果
        coinBounce: {
          '0%': {
            transform: 'translateY(0px) scale(1)',
          },
          '20%': {
            transform: 'translateY(-8px) scale(1.02, 0.98)',
          },
          '40%': {
            transform: 'translateY(-12px) scale(1.01, 0.99)',
          },
          '60%': {
            transform: 'translateY(-6px) scale(1.005, 0.995)',
          },
          '80%': {
            transform: 'translateY(-2px) scale(1.002, 0.998)',
          },
          '100%': {
            transform: 'translateY(0px) scale(1)',
          }
        },
        // 动态光晕脉动
        glowPulse: {
          '0%, 100%': {
            filter: 'brightness(1) drop-shadow(0 0 20px rgba(217, 119, 6, 0.6))',
            transform: 'scale(1)'
          },
          '25%': {
            filter: 'brightness(1.2) drop-shadow(0 0 30px rgba(217, 119, 6, 0.8))',
            transform: 'scale(1.02)'
          },
          '50%': {
            filter: 'brightness(1.4) drop-shadow(0 0 40px rgba(217, 119, 6, 1))',
            transform: 'scale(1.05)'
          },
          '75%': {
            filter: 'brightness(1.2) drop-shadow(0 0 30px rgba(217, 119, 6, 0.8))',
            transform: 'scale(1.02)'
          }
        }
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-lg': '0 0 40px rgba(124, 58, 237, 0.5)',
        'mystical': '0 4px 20px rgba(79, 70, 229, 0.3)',
        'golden': '0 4px 20px rgba(234, 179, 8, 0.3)',
      },
    },
  },
  plugins: [],
}