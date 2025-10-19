import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimationComponentProps } from "./DivinationAnimation";
import YaoSymbol from "./YaoSymbol";
import {
  getHexagramInfo,
  calculateBianGuaLines,
} from "../../utils/iChingUtils";

// 铜钱结果接口
interface CoinResult {
  isHeads: boolean; // true为文字面(背)，false为图案面(正)
  rotation: number;
  x: number;
  y: number;
}

/*
传统六爻占卜铜钱卦法说明：
- 铜钱有文字面为"背"，图案面为"正"
- 三枚铜钱投掷结果：
  * 三背（零正三背）：老阳（9）- 动爻
  * 一正二背：少阴（8）- 静爻
  * 二正一背：少阳（7）- 静爻
  * 三正（三正零背）：老阴（6）- 动爻

此规则遵循京氏易传的传统占卜方法，与后世通行的规则一致。
*/

// 爻线信息接口
interface YaoInfo {
  value: number; // 6(老阴), 7(少阳), 8(少阴), 9(老阳)
  isChanging: boolean; // 是否为动爻
  coinResult: CoinResult[];
}

// 六爻动画阶段
enum LiuYaoStage {
  COIN_TOSS = "coin_toss", // 铜钱投掷
  YAO_BUILDING = "yao_building", // 爻线构建
  TRANSFORMATION = "transformation", // 变卦转换
  COMPLETED = "completed", // 完成
}

export const LiuYaoAnimation: React.FC<AnimationComponentProps> = ({
  question,
  category,
}) => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<LiuYaoStage>(LiuYaoStage.COIN_TOSS);
  const [currentRound, setCurrentRound] = useState(0);
  const [coins, setCoins] = useState<CoinResult[]>([]);
  const [yaoResults, setYaoResults] = useState<YaoInfo[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // 卦名状态
  const [benGuaName, setBenGuaName] = useState<string>("");
  const [bianGuaName, setBianGuaName] = useState<string>("");

  // 变卦数据状态
  const [bianGuaLines, setBianGuaLines] = useState<YaoInfo[]>([]);

  // 生成随机铜钱结果 - 恢复位置参数
  const generateCoinResult = useCallback((): CoinResult[] => {
    return Array.from({ length: 3 }, (_, i) => ({
      isHeads: Math.random() < 0.5,
      rotation: Math.random() * 360, // 恢复旋转参数
      x: (i - 1) * 120, // 恢复位置参数，让铜钱分开显示
      y: 0, // 垂直位置保持一致
    }));
  }, []);

  // 根据铜钱结果计算爻值（遵循传统六爻占卜古法）
  const calculateYaoValue = useCallback(
    (coinResult: CoinResult[]): { value: number; isChanging: boolean } => {
      const headsCount = coinResult.filter((coin) => coin.isHeads).length;

      switch (headsCount) {
        case 0: // 三背（零正三背）- 老阳（9）
          return { value: 9, isChanging: true };
        case 1: // 一正二背 - 少阴（8）
          return { value: 8, isChanging: false };
        case 2: // 二正一背 - 少阳（7）
          return { value: 7, isChanging: false };
        case 3: // 三正（三正零背）- 老阴（6）
          return { value: 6, isChanging: true };
        default:
          return { value: 7, isChanging: false };
      }
    },
    [],
  );

  // 执行铜钱投掷动画
  const performCoinToss = useCallback(async () => {
    setIsAnimating(true);

    // 生成新的铜钱结果
    const newCoins = generateCoinResult();
    setCoins(newCoins);

    // 模拟铜钱旋转动画时间
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // 计算爻值
    const yaoInfo = calculateYaoValue(newCoins);
    const newYaoResults = [...yaoResults, { ...yaoInfo, coinResult: newCoins }];
    setYaoResults(newYaoResults);

    // 动画间隔
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsAnimating(false);

    // 检查是否完成6次投掷
    if (currentRound < 5) {
      setCurrentRound((prev) => prev + 1);
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
      // 计算本卦和变卦的卦名
      if (yaoResults.length === 6) {
        // 计算本卦卦名
        const benGuaInfo = getHexagramInfo(yaoResults);
        setBenGuaName(benGuaInfo?.name || "未知卦");

        // 使用正确的变卦计算函数
        const calculatedBianGuaLines = calculateBianGuaLines(yaoResults);
        setBianGuaLines(
          calculatedBianGuaLines.map((yao) => ({
            ...yao,
            coinResult: [], // 为兼容性添加空的coinResult数组
          })),
        );

        // 计算变卦卦名
        const bianGuaInfo = getHexagramInfo(calculatedBianGuaLines);
        setBianGuaName(bianGuaInfo?.name || "未知卦");
      }

      const timer = setTimeout(() => {
        setStage(LiuYaoStage.COMPLETED);

        // 生成最终结果数据
        const originalHexagram = yaoResults.map((yao) => yao.value);
        const transformedHexagram = yaoResults.map((yao) => {
          if (yao.isChanging) {
            return yao.value === 6 ? 9 : 6; // 老阴变老阳，老阳变老阴
          }
          return yao.value;
        });

        const changingLineIndexes = yaoResults
          .map((yao, index) => (yao.isChanging ? index : -1))
          .filter((index) => index >= 0);

        // 导航到结果页面，传递完整数据
        setTimeout(() => {
          navigate("/divination/result-page", {
            state: {
              benGuaInfo: getHexagramInfo(yaoResults),
              bianGuaInfo: getHexagramInfo(bianGuaLines),
              changingLineIndexes,
              originalHexagram,
              transformedHexagram,
              question,
              category,
              method: "liuyao",
            },
          });
        }, 1000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage, yaoResults, navigate, question, category, bianGuaLines]);

  // 渲染铜钱组件 - 参考HTML代码结构
  const renderCoin = (coin: CoinResult, index: number) => {
    const animationDelay = index * 0.2;
    const animationDuration = 2.5 + Math.random() * 0.5;
    const rotations = 5 + Math.floor(Math.random() * 4);
    const finalSide = coin.isHeads;
    const finalRotationX = finalSide ? (rotations * 360) : (rotations * 360 + 180);

    return (
      <div
        key={index}
        className="coin"
        style={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          transform: `translate(${coin.x}px, ${coin.y}px)`,
          '--duration': `${animationDuration}s`,
          '--rx-end': `${finalRotationX}deg`,
        } as React.CSSProperties}
      >
        <div
          className="flipper"
          style={{
            animation: isAnimating
              ? `coin-flip-3d var(--duration) linear ${animationDelay}s forwards`
              : "none",
            transformStyle: "preserve-3d",
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
          {/* 铜钱正面 */}
          <div
            className="coin-face coin-front"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "radial-gradient(circle at center, #d4af37 0%, #b8860b 40%, #8b4513 100%)",
              boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 215, 0, 0.5)",
              border: "3px solid #8B6914",
            }}
          >
            {/* 方孔 */}
            <div
              style={{
                position: "absolute",
                width: "30%",
                height: "30%",
                background: "#1a1a2e",
                border: "2px solid #5a3d0c",
                boxShadow: "0 0 5px rgba(0,0,0,0.7) inset",
                zIndex: 2,
              }}
            />
            {/* 招财进宝文字 */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#6a4a0a",
                  fontFamily: "'KaiTi', 'STKaiti', serif",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                進
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "15px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#6a4a0a",
                  fontFamily: "'KaiTi', 'STKaiti', serif",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                寶
              </div>
              <div
                style={{
                  position: "absolute",
                  left: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6a4a0a",
                  fontFamily: "'KaiTi', 'STKaiti', serif",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                招
              </div>
              <div
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6a4a0a",
                  fontFamily: "'KaiTi', 'STKaiti', serif",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                財
              </div>
            </div>
          </div>

          {/* 铜钱背面 */}
          <div
            className="coin-face coin-back"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "radial-gradient(circle at center, #d4af37 0%, #b8860b 40%, #8b4513 100%)",
              boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 215, 0, 0.5)",
              border: "3px solid #8B6914",
              transform: "rotateX(180deg)",
            }}
          >
            {/* 方孔 */}
            <div
              style={{
                position: "absolute",
                width: "30%",
                height: "30%",
                background: "#1a1a2e",
                border: "2px solid #5a3d0c",
                boxShadow: "0 0 5px rgba(0,0,0,0.7) inset",
                zIndex: 2,
              }}
            />
            {/* 背面纹饰 - 简化版 */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                width: "80%",
                height: "80%",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "60%",
                    height: "60%",
                    border: "2px solid #6a4a0a",
                    borderRadius: "4px",
                    transform: "rotate(45deg)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 渲染爻线
  const renderYao = (
    yao: YaoInfo,
    index: number,
    isTransformed: boolean = false,
  ) => {
    // 步骤1: 状态计算逻辑 (完全保留，未作任何改动)
    const isChanging = yao.isChanging && stage === LiuYaoStage.TRANSFORMATION;
    let actualValue = yao.value;
    if (isTransformed && yao.isChanging) {
      actualValue = yao.value === 6 ? 9 : 6; // 老阴变老阳，老阳变老阴
    }

    // 步骤2: Props准备 (将计算结果转化为给新组件的清晰指令)
    const symbolType = [7, 9].includes(yao.value) ? "yang" : "yin";
    const symbolColor = [7, 8].includes(actualValue) ? "amber" : "red";

    // 步骤3: 渲染 (将指令传递给新组件，自身不再关心具体实现)
    // 注意：最外层的div容器及其样式完全保留，确保布局和动画间隔不受影响。
    return (
      <div key={index} className={`w-48 h-3 mb-2 transition-all duration-1000`}>
        <YaoSymbol
          type={symbolType}
          color={symbolColor}
          isChanging={isChanging}
          intensity={isChanging ? 1.2 : 1}
        />
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
            <p className="text-sm text-midnight-400">
              请静心观想，铜钱即将落下...
            </p>
          </div>

          {/* 铜钱显示区域 */}
          <div className="relative h-40 flex items-center justify-center">
            {coins.map((coin, index) => renderCoin(coin, index))}
          </div>

          {/* 当前结果显示 */}
          {yaoResults.length > currentRound && (
            <div className="space-y-2">
              <p className="text-golden-400 font-medium">
                第 {currentRound + 1} 爻：
                {yaoResults[currentRound].value === 6
                  ? "老阴（动爻）"
                  : yaoResults[currentRound].value === 7
                    ? "少阳"
                    : yaoResults[currentRound].value === 8
                      ? "少阴"
                      : "老阳（动爻）"}
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
              <div
                key={index}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 200}ms` }}
              >
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
              <div className="text-center">
                <h3 className="text-2xl font-bold text-amber-400 mb-2">
                  {benGuaName}
                </h3>
                <h4 className="text-lg font-medium text-amber-300">本卦</h4>
              </div>
              <div className="flex flex-col-reverse items-center space-y-reverse space-y-2">
                {yaoResults.map((yao, index) => (
                  <div key={index}>{renderYao(yao, index)}</div>
                ))}
              </div>
            </div>

            {/* 变卦 */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-red-400 mb-2">
                  {bianGuaName}
                </h3>
                <h4 className="text-lg font-medium text-red-300">变卦</h4>
              </div>
              <div className="flex flex-col-reverse items-center space-y-reverse space-y-2">
                {bianGuaLines.map((yao, index) => (
                  <div key={`bian-${index}`}>{renderYao(yao, index)}</div>
                ))}
              </div>
            </div>
          </div>

          {/* 动爻说明 */}
          {yaoResults.some((yao) => yao.isChanging) && (
            <div className="mt-6 p-4 bg-red-900/20 rounded-lg border border-red-500/30">
              <p className="text-red-300">
                动爻：第 {yaoResults.findIndex((yao) => yao.isChanging) + 1} 爻
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
