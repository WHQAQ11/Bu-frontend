import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { HexagramInfo, YaoInfo } from "../utils/iChingUtils";
import Layout from "@/components/Layout";

// 扩展占卜结果接口
interface ResultData {
  benGuaInfo: HexagramInfo;
  bianGuaInfo?: HexagramInfo;
  changingLineIndexes: number[]; // 动爻的索引数组 (从0开始)
  originalHexagram: number[];
  transformedHexagram?: number[];
  question: string;
  category?: string;
  method: string;
}

const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // 从路由状态获取数据
    if (location.state) {
      const state = location.state as ResultData;
      setResultData(state);
    } else {
      setError("未找到占卜结果数据，请重新进行占卜。");
    }
  }, [location.state]);

  const handleBack = () => {
    navigate("/divination");
  };

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 3.161-3.197.461-2.986-1.56-5.23-3.378-5.69-5.621a1.5 1.5 0 0 1 .054.044l.195.01A1.5 1.5 0 0 1 13.972 14.8a1.5 1.5 0 0 1-1.054.044 1.417 1.401A1.5 1.5 0 0 1 14.206 15.045c-1.461 3.35-3.184 5.69-5.45 5.921-.626.62-1.295.1-2.002.17a3.375 3.375 0 0 1 1.15-1.222 3.018 3.018 0 0 1 1.756-.084 3.3.215 3.3 0 0 1 2.122-.484c.946-.652 1.737-1.463 2.313-2.348a3.375 3.375 0 0 1 .665-1.412c1.117.45 2.338.362 3.018.49a3.375 3.375 0 0 1 1.5.056c.826.1 1.66.054 2.3.163.162.17.86.326.52.655.1 1.328.255 1.954.409.1.25.207.244.377.475a3.375 3.375 0 0 1 .564-1.473 3.612 3.612 0 0 1 .545-2.628 4.5 4.5 0 0 1-1.347 3.294A75.757 75.757 0 0 0 5.256 7.21c.448.382.98.637 1.56.697l1.434-1.433c.615-.365 1.379-.71 2.306-.71 1.753 0 3.586.002 5.383.007.12.005.243.012.349.021a75.14 75.14 0 0 1 12.764-6.315c.586-.45 1.16-.88 1.734-1.33A69.48 69.48 0 0 0 21.75-36.76c.3-1.48.9-3.098 1.639-4.56l.749-.749a75.37 75.37 0 0 1 1.127-.33c1.348-.448 2.726-.846 4.062-1.231.13-.032.26-.06.377-.09.137a75.57 75.57 0 0 1 12.21-6.697c.345-.46.653-1.007-.92-1.175-.495a75.37 75.37 0 0 1 1.167.32A75.17 75.17 0 0 1 17.654 15.21c1.16.63 2.477 1.29 3.886 1.85a75.49 75.49 0 0 1 6.532 2.343c.777.18 1.554.4 2.334.6a75.53 75.53 0 0 1 3.23.06c.384.264.767.55 1.154.825l.157.009c.077.005.153.018.22.037A75.59 75.59 0 0 1 1.042 1.526 5.4 5.4 0 0 1-1.89 2.404c-.764.665-1.516 1.332-2.194 1.996a75.614 75.614 0 0 1-2.08 1.527 7.33 7.33 0 0 1-2.07 1.527c-.34.05-.68.072-1.35.206-2.001.572-1.311.467-2.61.894-3.881 1.324l-.218.084c-.426.166-.85.338-1.283.494a75.68 75.68 0 0 1-3.06 1.197 9.3 9.3 0 0 1-3.06 1.197 3.415 3.415 0 0 1-1.28-.494 3.876-1.123l.13-.012c-.764-.068-1.53-.14-2.298-.221a75.696 75.696 0 0 1-3.595-2.059 9.7 9.7 0 0 1-3.595 2.059c-.752.433-1.496.915-2.228 1.38a75.696 75.696 0 0 1-3.59 2.058c-.753.434-1.501.9-2.228 1.38-.326.148-.673.296-1.021.44l-.044.019c-.657.296-1.321.591-1.979.888a75.748 75.748 0 0 1 0-7.5 0 10.5 10.5 0 0 0 0 0 10.5 10.5 0 0 0 0 10.5 10.5 0 0 0 0-7.5 0 10.5-10.5 0 0 0 0-10.5-10.5 0 0 0 0-10.5-10.5 0 0 0 0-10.5 10.5 0 0 0 0 10.5 10.5 0 0 0 0 10.5-10.5 0 0 0 0 10.5-10.5 0 0 0 0-7.5 0 10.5-10.5 0 0 0 0-10.5-10.5 0 0 0 0-10.5 10.5 0 0 0 0 10.5 10.5 0 0 0 0 7.5 0 10.5 10.5 0 0 0 0 10.5-10.5"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              数据加载失败
            </h2>
            <p className="text-midnight-300 mb-6">{error}</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-midnight-700 hover:bg-midnight-600 text-midnight-100 rounded-lg border border-midnight-600 hover:border-midnight-500 transition-colors"
            >
              返回占卜页
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!resultData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-amber-400/20 rounded-full flex items-center justify-center animate-pulse">
              <svg
                className="w-8 h-8 text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-amber-400 mb-4">
              加载中...
            </h2>
            <p className="text-midnight-300">正在准备占卜结果...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const { benGuaInfo, bianGuaInfo, changingLineIndexes, question, category } =
    resultData;
  const primaryChangingLine =
    changingLineIndexes.length > 0 ? changingLineIndexes[0] : -1;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900">
        {/* 顶部导航 */}
        <div className="border-b border-midnight-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-midnight-300 hover:text-amber-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>返回</span>
              </button>
              <h1 className="text-xl font-bold text-midnight-100">
                占卜结果解读
              </h1>
            </div>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 用户问题显示 */}
          <div className="mb-8 text-center">
            <h2 className="text-lg font-medium text-amber-400 mb-2">
              您的问题
            </h2>
            <p className="text-xl text-midnight-200">{question}</p>
            {category && (
              <span className="inline-block px-3 py-1 bg-midnight-700 text-midnight-300 rounded-full text-sm">
                {category}
              </span>
            )}
          </div>

          {/* 主要解读内容 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧 - 本卦信息 */}
            <div className="space-y-6">
              <div className="bg-midnight-800/50 rounded-xl p-6 border border-amber-500/30">
                <h3 className="text-xl font-bold text-amber-400 mb-4 text-center">
                  {benGuaInfo.name}
                </h3>
                <div className="text-midnight-300 text-center mb-4">
                  <span className="text-sm">本卦</span>
                </div>

                {/* 本卦卦辞 */}
                <div className="bg-midnight-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-amber-300 mb-2">
                    【卦辞】
                  </h4>
                  <p className="text-midnight-100 leading-relaxed">
                    {benGuaInfo.guaCi}
                  </p>
                </div>

                {/* 爻图显示 */}
                <div className="flex flex-col-reverse items-center space-y-reverse space-y-2 py-4">
                  {resultData.originalHexagram.map((value, index) => {
                    const yaoInfo: YaoInfo = {
                      value,
                      isChanging: changingLineIndexes.includes(index),
                    };
                    const isYang = [7, 9].includes(value);
                    const symbolType = isYang ? "yang" : "yin";

                    return (
                      <div
                        key={index}
                        className="w-32 h-2 flex items-center justify-center"
                      >
                        <div
                          className={`w-full h-full rounded ${
                            symbolType === "yang"
                              ? "bg-gradient-to-r from-amber-500 to-amber-700"
                              : "bg-gradient-to-r from-midnight-600 to-midnight-800"
                          } ${
                            yaoInfo.isChanging
                              ? "ring-2 ring-red-500 ring-opacity-50"
                              : ""
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 动爻爻辞 */}
              {primaryChangingLine >= 0 && (
                <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30">
                  <h4 className="text-lg font-bold text-red-400 mb-3">
                    第 {primaryChangingLine + 1} 爻
                  </h4>
                  <div className="text-red-200">
                    <p className="text-sm leading-relaxed">
                      {benGuaInfo.yaoCi[primaryChangingLine]}
                    </p>
                  </div>
                  <p className="text-xs text-red-300 mt-2">
                    动爻预示着事物发展的关键转折点
                  </p>
                </div>
              )}
            </div>

            {/* 中间 - 核心启示 */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-900/50 to-midnight-800/50 rounded-xl p-6 border border-amber-500/30">
                <h3 className="text-2xl font-bold text-amber-400 mb-6 text-center">
                  核心启示
                </h3>

                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-amber-400/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>

                  {primaryChangingLine >= 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-lg font-medium text-amber-300">
                        动爻解读
                      </h4>
                      <p className="text-midnight-100 text-lg leading-relaxed">
                        {benGuaInfo.yaoCi[primaryChangingLine]}
                      </p>
                    </div>
                  ) : (
                    <p className="text-midnight-100 text-lg leading-relaxed">
                      本次占卜显示无动爻，意味着当前状况相对稳定，
                      建议保持现状，顺势而为。
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 右侧 - 变卦信息 */}
            {bianGuaInfo && (
              <div className="space-y-6">
                <div className="bg-midnight-800/50 rounded-xl p-6 border border-red-500/30">
                  <h3 className="text-xl font-bold text-red-400 mb-4 text-center">
                    {bianGuaInfo.name}
                  </h3>
                  <div className="text-midnight-300 text-center mb-4">
                    <span className="text-sm">变卦</span>
                  </div>

                  {/* 变卦卦辞 */}
                  <div className="bg-midnight-700/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-red-300 mb-2">
                      【卦辞】
                    </h4>
                    <p className="text-midnight-100 leading-relaxed">
                      {bianGuaInfo.guaCi}
                    </p>
                  </div>

                  {/* 变卦爻图显示 */}
                  <div className="flex flex-col-reverse items-center space-y-reverse space-y-2 py-4">
                    {resultData.transformedHexagram?.map((value, index) => {
                      const isYang = [7, 9].includes(value);
                      const symbolType = isYang ? "yang" : "yin";

                      return (
                        <div
                          key={index}
                          className="w-32 h-2 flex items-center justify-center"
                        >
                          <div
                            className={`w-full h-full rounded ${
                              symbolType === "yang"
                                ? "bg-gradient-to-r from-red-500 to-red-700"
                                : "bg-gradient-to-r from-midnight-600 to-midnight-800"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 变化说明 */}
                <div className="text-center">
                  <p className="text-sm text-midnight-400">
                    从
                    <span className="text-amber-400 font-medium">
                      {benGuaInfo.name}
                    </span>
                    到
                    <span className="text-red-400 font-medium">
                      {bianGuaInfo.name}
                    </span>
                    的转化
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 底部操作区域 */}
          <div className="mt-12 text-center space-y-4">
            <div className="text-midnight-400 text-sm">
              <p>
                本次占卜仅供参考，如需重要决策，建议结合实际情况和多方意见。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBack}
                className="px-8 py-3 bg-midnight-700 hover:bg-midnight-600 text-midnight-100 rounded-lg border border-midnight-600 hover:border-midnight-500 transition-colors"
              >
                重新占卜
              </button>

              <Link
                to="/"
                className="px-8 py-3 bg-midnight-700 hover:bg-midnight-600 text-midnight-100 rounded-lg border border-midnight-600 hover:border-midnight-500 transition-colors text-center"
              >
                返回首页
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultPage;
