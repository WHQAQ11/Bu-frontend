import React, { useState, useEffect, useCallback } from 'react';
import { AnimationComponentProps, DivinationResult } from './DivinationAnimation';

// 铜钱结果接口
interface CoinResult {
  isHeads: boolean; // true为文字面(背)，false为图案面(正)
  rotation: number;
  x: number;
  y: number;
}

// 爻线信息接口
interface YaoInfo {
  value: number; // 6(老阴), 7(少阳), 8(少阴), 9(老阳)
  isChanging: boolean; // 是否为动爻
  coinResult: CoinResult[];
}

// 六爻动画阶段
enum LiuYaoStage {
  COIN_TOSS = 'coin_toss', // 铜钱投掷
  YAO_BUILDING = 'yao_building', // 爻线构建
  TRANSFORMATION = 'transformation', // 变卦转换
  COMPLETED = 'completed' // 完成
}

export const LiuYaoAnimation: React.FC<AnimationComponentProps> = ({
  onComplete,
  question,
  method,
  category
}) => {
  const [stage, setStage] = useState<LiuYaoStage>(LiuYaoStage.COIN_TOSS);
  const [currentRound, setCurrentRound] = useState(0);
  const [coins, setCoins] = useState<CoinResult[]>([]);
  const [yaoResults, setYaoResults] = useState<YaoInfo[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // 生成随机铜钱结果
  const generateCoinResult = useCallback((): CoinResult[] => {
    return Array.from({ length: 3 }, (_, i) => ({
      isHeads: Math.random() < 0.5,
      rotation: Math.random() * 360,
      x: (i - 1) * 120,
      y: 0
    }));
  }, []);

  // 根据铜钱结果计算爻值
  const calculateYaoValue = useCallback((coinResult: CoinResult[]): { value: number; isChanging: boolean } => {
    const headsCount = coinResult.filter(coin => coin.isHeads).length;

    switch (headsCount) {
      case 0: // 三正 - 老阴
        return { value: 6, isChanging: true };
      case 1: // 一背二正 - 少阳
        return { value: 7, isChanging: false };
      case 2: // 二背一正 - 少阴
        return { value: 8, isChanging: false };
      case 3: // 三背 - 老阳
        return { value: 9, isChanging: true };
      default:
        return { value: 7, isChanging: false };
    }
  }, []);

  // 执行铜钱投掷动画
  const performCoinToss = useCallback(async () => {
    setIsAnimating(true);

    // 生成新的铜钱结果
    const newCoins = generateCoinResult();
    setCoins(newCoins);

    // 模拟铜钱旋转动画时间
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 计算爻值
    const yaoInfo = calculateYaoValue(newCoins);
    const newYaoResults = [...yaoResults, { ...yaoInfo, coinResult: newCoins }];
    setYaoResults(newYaoResults);

    // 动画间隔
    await new Promise(resolve => setTimeout(resolve, 800));

    setIsAnimating(false);

    // 检查是否完成6次投掷
    if (currentRound < 5) {
      setCurrentRound(prev => prev + 1);
    } else {
      // 所有爻线构建完成，进入变卦阶段
      setStage(LiuYaoStage.YAO_BUILDING);
      setTimeout(() => {
        setStage(LiuYaoStage.TRANSFORMATION);
      }, 2000);
    }
  }, [currentRound, generateCoinResult, calculateYaoValue, yaoResults]);

  // 自动开始投掷
  useEffect(() => {
    if (stage === LiuYaoStage.COIN_TOSS && !isAnimating) {
      const timer = setTimeout(() => {
        performCoinToss();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage, currentRound, isAnimating, performCoinToss]);

  // 处理变卦完成
  useEffect(() => {
    if (stage === LiuYaoStage.TRANSFORMATION) {
      const timer = setTimeout(() => {
        setStage(LiuYaoStage.COMPLETED);

        // 生成最终结果
        const originalHexagram = yaoResults.map(yao => yao.value);
        const transformedHexagram = yaoResults.map(yao => {
          if (yao.isChanging) {
            return yao.value === 6 ? 9 : 6; // 老阴变老阳，老阳变老阴
          }
          return yao.value;
        });

        const changingLineIndex = yaoResults.findIndex(yao => yao.isChanging);

        const result: DivinationResult = {
          method: 'liuyao',
          originalHexagram,
          transformedHexagram,
          changingLine: changingLineIndex >= 0 ? changingLineIndex + 1 : undefined,
          question,
          category
        };

        setTimeout(() => onComplete(result), 1000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage, yaoResults, onComplete, question, category]);

  // 渲染铜钱组件
  const renderCoin = (coin: CoinResult, index: number) => {
    return (
      <div
        key={index}
        className="absolute transition-all duration-1000"
        style={{
          transform: `translate(${coin.x}px, ${coin.y}px) rotateZ(${coin.rotation}deg)`,
          animation: isAnimating ? 'coinFlip 2.5s ease-in-out' : 'none'
        }}
      >
        <div className="relative w-20 h-20">
          {/* 铜钱主体 */}
          <div className={`w-full h-full rounded-full border-4 border-amber-900 shadow-lg flex items-center justify-center text-2xl font-bold transition-colors duration-500 ${
            coin.isHeads ? 'bg-amber-100 text-amber-900' : 'bg-amber-800 text-amber-100'
          }`}>
            {coin.isHeads ? (
              <span className="text-4xl">⚪</span> // 文字面（简化为圆圈）
            ) : (
              <span className="text-4xl">🟢</span> // 图案面（简化为方块）
            )}
          </div>

          {/* 金属光泽效果 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-amber-400/20 to-transparent pointer-events-none" />
        </div>
      </div>
    );
  };

  // 渲染爻线
  const renderYao = (yao: YaoInfo, index: number, isTransformed: boolean = false) => {
    const isSolid = [7, 9].includes(yao.value);
    const isChanging = yao.isChanging && stage === LiuYaoStage.TRANSFORMATION;

    let actualValue = yao.value;
    if (isTransformed && yao.isChanging) {
      actualValue = yao.value === 6 ? 9 : 6;
    }

    return (
      <div
        key={index}
        className={`w-48 h-3 mb-2 transition-all duration-1000 ${
          isChanging ? 'animate-pulse' : ''
        }`}
      >
        {isSolid ? (
          <div className={`w-full h-full rounded ${
            [7, 8].includes(actualValue)
              ? 'bg-gradient-to-r from-amber-600 to-amber-700'
              : 'bg-gradient-to-r from-red-600 to-red-700 shadow-lg'
          }`} />
        ) : (
          <div className="w-full h-full flex justify-center">
            <div className={`w-20 h-full rounded ${
              [7, 8].includes(actualValue)
                ? 'bg-gradient-to-r from-amber-600 to-amber-700'
                : 'bg-gradient-to-r from-red-600 to-red-700 shadow-lg'
            }`} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="text-center space-y-8">
      {/* 标题 */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          六爻占卜
        </h2>
        <p className="text-midnight-300">三枚铜钱定乾坤，六次投揭示天机</p>
      </div>

      {/* 铜钱投掷阶段 */}
      {stage === LiuYaoStage.COIN_TOSS && (
        <div className="space-y-8">
          <div className="text-midnight-200">
            <p className="text-lg">第 {currentRound + 1} 次投掷</p>
            <p className="text-sm text-midnight-400">请静心观想，铜钱即将落下...</p>
          </div>

          {/* 铜钱显示区域 */}
          <div className="relative h-40 flex items-center justify-center">
            {coins.map((coin, index) => renderCoin(coin, index))}
          </div>

          {/* 当前结果显示 */}
          {yaoResults.length > currentRound && (
            <div className="space-y-2">
              <p className="text-golden-400 font-medium">
                第 {currentRound + 1} 爻：{yaoResults[currentRound].value === 6 ? '老阴（动爻）' :
                       yaoResults[currentRound].value === 7 ? '少阳' :
                       yaoResults[currentRound].value === 8 ? '少阴' : '老阳（动爻）'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 爻线构建阶段 */}
      {stage === LiuYaoStage.YAO_BUILDING && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-amber-400">本卦生成</h3>
          <div className="flex flex-col-reverse items-center space-y-reverse space-y-2">
            {yaoResults.map((yao, index) => (
              <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 200}ms` }}>
                <p className="text-sm text-midnight-400 mb-1">
                  第 {index + 1} 爻（从下到上）
                </p>
                {renderYao(yao, index)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 变卦转换阶段 */}
      {stage === LiuYaoStage.TRANSFORMATION && (
        <div className="space-y-8">
          <h3 className="text-xl font-semibold text-red-400">动爻变卦</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 本卦 */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-amber-400">本卦</h4>
              <div className="flex flex-col-reverse items-center space-y-reverse space-y-2">
                {yaoResults.map((yao, index) => (
                  <div key={index}>
                    {renderYao(yao, index)}
                  </div>
                ))}
              </div>
            </div>

            {/* 变卦 */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-red-400">变卦</h4>
              <div className="flex flex-col-reverse items-center space-y-reverse space-y-2">
                {yaoResults.map((yao, index) => (
                  <div key={index}>
                    {renderYao(yao, index, true)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 动爻说明 */}
          {yaoResults.some(yao => yao.isChanging) && (
            <div className="mt-6 p-4 bg-red-900/20 rounded-lg border border-red-500/30">
              <p className="text-red-300">
                动爻：第 {yaoResults.findIndex(yao => yao.isChanging) + 1} 爻
              </p>
              <p className="text-sm text-midnight-400 mt-1">
                变爻预示着事物发展中的关键转折点
              </p>
            </div>
          )}
        </div>
      )}

      {/* 完成阶段 */}
      {stage === LiuYaoStage.COMPLETED && (
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center animate-pulse-glow">
            <span className="text-3xl">✨</span>
          </div>
          <p className="text-xl text-amber-400 font-medium">六爻占卜已完成</p>
          <p className="text-midnight-300">正在为您解读卦象含义...</p>
        </div>
      )}
    </div>
  );
};

export default LiuYaoAnimation;