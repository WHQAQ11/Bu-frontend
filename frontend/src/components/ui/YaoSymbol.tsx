import React from 'react';

// 定义组件清晰的Props接口
interface YaoSymbolProps {
  type: 'yang' | 'yin';
  color: 'amber' | 'red';
  isChanging: boolean;
  size?: 'sm' | 'md' | 'lg';
  intensity?: number;
}

// 传统阴爻断口比例常量
const YIN_PROPORTIONS = {
  leftSegment: 0.375,  // 3/8
  break: 0.25,         // 2/8
  rightSegment: 0.375  // 3/8
};

// SVG尺寸常量
const SVG_DIMENSIONS = {
  width: 192,
  height: 12
};

// 计算阴爻断口位置
const calculateYinSegments = () => {
  const { width } = SVG_DIMENSIONS;
  const { leftSegment } = YIN_PROPORTIONS;

  const segmentWidth = width * leftSegment;
  const breakStart = segmentWidth;
  const breakEnd = width - segmentWidth;

  return {
    leftEnd: breakStart,
    rightStart: breakEnd
  };
};

const YaoSymbol: React.FC<YaoSymbolProps> = ({
  type,
  color,
  isChanging,
  size: _size = 'md', // 标记为未使用但保留接口
  intensity = 1
}) => {
  const { leftEnd, rightStart } = calculateYinSegments();
  const { width, height } = SVG_DIMENSIONS;

  // 动画强度调整
  const animationIntensity = isChanging ? intensity : 0;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`
        w-full h-full overflow-visible
        ${isChanging ? 'animate-pulse' : ''}
        transition-all duration-1000
      `}
      style={{
        filter: animationIntensity > 0
          ? `drop-shadow(0 0 ${8 * animationIntensity}px rgba(251, 191, 36, ${0.8 * animationIntensity}))`
          : 'none'
      }}
    >
      <defs>
        {/* 琥珀色渐变 */}
        <linearGradient id="amber-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* 红色渐变 */}
        <linearGradient id="red-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>

        {/* 添加细微的纹理效果 */}
        <filter id="texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" seed="1" />
          <feDiffuseLighting in="noise" lighting-color="white" surfaceScale="1">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
        </filter>
      </defs>

      {/* 阳爻：完整的实线 */}
      {type === 'yang' && (
        <g>
          <line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke={`url(#${color}-gradient)`}
            strokeWidth={height}
            strokeLinecap="round"
            filter="url(#texture)"
            opacity="0.95"
          />
          {/* 添加细微的高光效果 */}
          <line
            x1="2"
            y1={height / 2 - 2}
            x2={width - 2}
            y2={height / 2 - 2}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      )}

      {/* 阴爻：两条断线 */}
      {type === 'yin' && (
        <g>
          {/* 左段 */}
          <line
            x1="0"
            y1={height / 2}
            x2={leftEnd}
            y2={height / 2}
            stroke={`url(#${color}-gradient)`}
            strokeWidth={height}
            strokeLinecap="round"
            filter="url(#texture)"
            opacity="0.95"
          />

          {/* 右段 */}
          <line
            x1={rightStart}
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke={`url(#${color}-gradient)`}
            strokeWidth={height}
            strokeLinecap="round"
            filter="url(#texture)"
            opacity="0.95"
          />

          {/* 左段高光 */}
          <line
            x1="2"
            y1={height / 2 - 2}
            x2={leftEnd - 2}
            y2={height / 2 - 2}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={2}
            strokeLinecap="round"
          />

          {/* 右段高光 */}
          <line
            x1={rightStart + 2}
            y1={height / 2 - 2}
            x2={width - 2}
            y2={height / 2 - 2}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      )}
    </svg>
  );
};

export default YaoSymbol;