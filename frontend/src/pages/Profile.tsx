import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { TaiJi, Stars, MysticalAura } from "@/components/ui/TrigramSymbol";

interface DivinationRecord {
  id: number;
  method: string;
  question: string;
  result: {
    name: string;
    number: number;
    upperTrigram: string;
    lowerTrigram: string;
  };
  aiInterpretation?: string;
  timestamp: string;
  category?: string;
}

interface UserStats {
  total: number;
  byMethod: { [key: string]: number };
  recentCount: number;
  favoriteMethod?: string;
  mostAskedCategory?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"overview" | "history" | "stats">(
    "overview",
  );
  const [divinationHistory, setDivinationHistory] = useState<
    DivinationRecord[]
  >([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<DivinationRecord | null>(
    null,
  );

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    loadUserData();
  }, [isAuthenticated, navigate]);

  // 加载用户数据
  const loadUserData = async () => {
    setIsLoading(true);

    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟占卜历史数据
      const mockHistory: DivinationRecord[] = [
        {
          id: 1,
          method: "liuyao",
          question: "我的事业发展会如何？",
          category: "career",
          result: {
            name: "乾",
            number: 1,
            upperTrigram: "乾",
            lowerTrigram: "乾",
          },
          aiInterpretation: "事业发展前景良好，宜积极进取...",
          timestamp: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 2,
          method: "meihua",
          question: "感情运势如何？",
          category: "relationship",
          result: {
            name: "坤",
            number: 2,
            upperTrigram: "坤",
            lowerTrigram: "坤",
          },
          timestamp: new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
        {
          id: 3,
          method: "ai",
          question: "投资理财建议？",
          category: "wealth",
          result: {
            name: "需",
            number: 5,
            upperTrigram: "坎",
            lowerTrigram: "乾",
          },
          aiInterpretation: "投资需谨慎等待时机...",
          timestamp: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ];

      // 模拟统计数据
      const mockStats: UserStats = {
        total: 15,
        byMethod: {
          liuyao: 8,
          meihua: 5,
          ai: 2,
        },
        recentCount: 3,
        favoriteMethod: "liuyao",
        mostAskedCategory: "career",
      };

      setDivinationHistory(mockHistory);
      setUserStats(mockStats);
    } catch (error) {
      console.error("加载用户数据失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理退出登录
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 获取方法名称
  const getMethodName = (methodId: string): string => {
    const methods: { [key: string]: string } = {
      liuyao: "六爻占卜",
      meihua: "梅花易数",
      ai: "AI智能解卦",
    };
    return methods[methodId] || "占卜";
  };

  // 获取分类名称
  const getCategoryName = (categoryId?: string): string => {
    const categories: { [key: string]: string } = {
      career: "事业发展",
      relationship: "感情婚姻",
      health: "健康养生",
      wealth: "财运投资",
      study: "学业考试",
      family: "家庭亲情",
    };
    return categories[categoryId || ""] || "生活问题";
  };

  // 获取分类图标
  const getCategoryIcon = (categoryId?: string): string => {
    const icons: { [key: string]: string } = {
      career: "💼",
      relationship: "💕",
      health: "🏥",
      wealth: "💰",
      study: "📚",
      family: "👨‍👩‍👧‍👦",
    };
    return icons[categoryId || ""] || "🔮";
  };

  // 渲染加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cosmic-gradient relative overflow-hidden">
        <Stars count={30} />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-golden-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-midnight-300">加载个人数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 渲染概览页面
  const renderOverview = () => (
    <div className="space-y-8">
      {/* 用户信息卡片 */}
      <MysticalAura className="bg-gradient-to-br from-mystical-purple/20 to-mystical-indigo/20 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/30">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-mystical-purple to-mystical-indigo rounded-full flex items-center justify-center shadow-glow">
              <span className="text-4xl text-white font-bold">
                {(user?.nickname || user?.email || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-golden-400 rounded-full flex items-center justify-center">
              <TaiJi size="sm" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-midnight-100 mb-2">
              {user?.nickname || "问卜者"}
            </h2>
            <p className="text-midnight-300 mb-4">{user?.email}</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="px-3 py-1 bg-golden-400/20 text-golden-400 rounded-full">
                VIP会员
              </span>
              <span className="px-3 py-1 bg-mystical-teal/20 text-mystical-teal rounded-full">
                活跃用户
              </span>
            </div>
          </div>
        </div>
      </MysticalAura>

      {/* 快速统计 */}
      <div className="grid md:grid-cols-4 gap-6">
        <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-golden-400 to-golden-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-golden-400">
              {userStats?.total || 0}
            </p>
            <p className="text-midnight-300">总占卜次数</p>
          </div>
        </MysticalAura>

        <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-mystical-purple to-mystical-indigo rounded-full flex items-center justify-center">
              <span className="text-2xl">🔮</span>
            </div>
            <p className="text-3xl font-bold text-mystical-purple">
              {getMethodName(userStats?.favoriteMethod || "liuyao")}
            </p>
            <p className="text-midnight-300">常用方法</p>
          </div>
        </MysticalAura>

        <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-mystical-teal to-mystical-rose rounded-full flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-3xl font-bold text-mystical-teal">
              {userStats?.recentCount || 0}
            </p>
            <p className="text-midnight-300">本月占卜</p>
          </div>
        </MysticalAura>

        <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">💚</span>
            </div>
            <p className="text-3xl font-bold text-green-400">7</p>
            <p className="text-midnight-300">连续签到</p>
          </div>
        </MysticalAura>
      </div>

      {/* 快捷操作 */}
      <div className="grid md:grid-cols-2 gap-6">
        <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20">
          <h3 className="text-xl font-bold text-midnight-100 mb-4">快捷操作</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/divination")}
              className="w-full px-4 py-3 bg-gradient-to-r from-mystical-purple to-mystical-indigo text-white rounded-lg font-medium hover:shadow-glow transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>🔮</span>
              <span>开始占卜</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className="w-full px-4 py-3 bg-midnight-700 hover:bg-midnight-600 text-midnight-100 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <span>📜</span>
              <span>查看历史</span>
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className="w-full px-4 py-3 bg-midnight-700 hover:bg-midnight-600 text-midnight-100 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <span>📊</span>
              <span>统计分析</span>
            </button>
          </div>
        </MysticalAura>

        <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20">
          <h3 className="text-xl font-bold text-midnight-100 mb-4">账户设置</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-midnight-700 hover:bg-midnight-600 text-midnight-100 rounded-lg font-medium transition-colors duration-300 text-left">
              📝 编辑个人信息
            </button>
            <button className="w-full px-4 py-3 bg-midnight-700 hover:bg-midnight-600 text-midnight-100 rounded-lg font-medium transition-colors duration-300 text-left">
              🔔 通知设置
            </button>
            <button className="w-full px-4 py-3 bg-midnight-700 hover:bg-midnight-600 text-midnight-100 rounded-lg font-medium transition-colors duration-300 text-left">
              🛡️ 隐私设置
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors duration-300 text-left"
            >
              🚪 退出登录
            </button>
          </div>
        </MysticalAura>
      </div>
    </div>
  );

  // 渲染占卜历史
  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-midnight-100">占卜历史</h2>
        <button
          onClick={() => navigate("/divination")}
          className="px-4 py-2 bg-gradient-to-r from-mystical-purple to-mystical-indigo text-white rounded-lg font-medium hover:shadow-glow transition-all duration-300"
        >
          新占卜
        </button>
      </div>

      {divinationHistory.length === 0 ? (
        <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-xl p-12 border border-primary-500/20 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-mystical-purple to-mystical-indigo rounded-full flex items-center justify-center">
              <span className="text-3xl">📜</span>
            </div>
            <h3 className="text-xl font-semibold text-midnight-100">
              暂无占卜记录
            </h3>
            <p className="text-midnight-300">开始您的第一次占卜之旅吧</p>
            <button
              onClick={() => navigate("/divination")}
              className="px-6 py-3 bg-gradient-to-r from-mystical-purple to-mystical-indigo text-white rounded-full font-medium hover:shadow-glow transition-all duration-300"
            >
              开始占卜
            </button>
          </div>
        </MysticalAura>
      ) : (
        <div className="space-y-4">
          {divinationHistory.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="cursor-pointer"
            >
              <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-xl p-6 border border-primary-500/20 hover:border-golden-400/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-mystical-purple to-mystical-indigo rounded-full flex items-center justify-center">
                      <span className="text-xl">{record.result.name}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 bg-mystical-purple/20 text-mystical-purple rounded text-xs font-medium">
                          {getMethodName(record.method)}
                        </span>
                        {record.category && (
                          <span className="flex items-center space-x-1 text-midnight-400 text-sm">
                            <span>{getCategoryIcon(record.category)}</span>
                            <span>{getCategoryName(record.category)}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-midnight-200">{record.question}</p>
                      <p className="text-sm text-midnight-500">
                        {new Date(record.timestamp).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {record.aiInterpretation && (
                      <span className="px-2 py-1 bg-mystical-teal/20 text-mystical-teal rounded text-xs font-medium">
                        AI解读
                      </span>
                    )}
                    <svg
                      className="w-5 h-5 text-midnight-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </MysticalAura>
            </div>
          ))}
        </div>
      )}

      {/* 记录详情弹窗 */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-midnight-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-primary-500/30">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-midnight-100 mb-2">
                    {selectedRecord.result.name}卦占卜
                  </h3>
                  <p className="text-midnight-300">{selectedRecord.question}</p>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-midnight-400 hover:text-midnight-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-mystical-purple/20 text-mystical-purple rounded-full text-sm font-medium">
                    {getMethodName(selectedRecord.method)}
                  </span>
                  <span className="text-midnight-400 text-sm">
                    {new Date(selectedRecord.timestamp).toLocaleString("zh-CN")}
                  </span>
                </div>

                <div className="bg-midnight-900/50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-mystical-purple to-mystical-indigo rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {selectedRecord.result.name}
                      </span>
                    </div>
                    <div>
                      <p className="text-midnight-200 font-medium">
                        第{selectedRecord.result.number}卦
                      </p>
                      <p className="text-midnight-400 text-sm">
                        {selectedRecord.result.upperTrigram}上
                        {selectedRecord.result.lowerTrigram}下
                      </p>
                    </div>
                  </div>
                </div>

                {selectedRecord.aiInterpretation && (
                  <div className="bg-mystical-teal/10 rounded-lg p-4 border border-mystical-teal/30">
                    <h4 className="text-mystical-teal font-medium mb-2">
                      AI解读
                    </h4>
                    <p className="text-midnight-200 text-sm leading-relaxed">
                      {selectedRecord.aiInterpretation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 渲染统计分析
  const renderStats = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-midnight-100">统计分析</h2>

      {/* 占卜方法分布 */}
      <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-xl p-8 border border-primary-500/20">
        <h3 className="text-xl font-semibold text-midnight-100 mb-6">
          占卜方法分布
        </h3>
        <div className="space-y-4">
          {Object.entries(userStats?.byMethod || {}).map(([method, count]) => (
            <div key={method} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-midnight-200">
                  {getMethodName(method)}
                </span>
                <span className="text-golden-400 font-medium">{count}次</span>
              </div>
              <div className="w-full bg-midnight-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-mystical-purple to-mystical-indigo h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${(count / (userStats?.total || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </MysticalAura>

      {/* 最近占卜趋势 */}
      <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-xl p-8 border border-primary-500/20">
        <h3 className="text-xl font-semibold text-midnight-100 mb-6">
          最近占卜趋势
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {["一", "二", "三", "四", "五", "六", "日"].map((day, _index) => (
            <div key={day} className="text-center space-y-2">
              <p className="text-xs text-midnight-400">{day}</p>
              <div className="h-20 bg-midnight-700 rounded-lg flex items-end justify-center">
                <div
                  className="w-full bg-gradient-to-t from-mystical-purple to-mystical-indigo rounded-lg transition-all duration-300"
                  style={{ height: `${Math.random() * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </MysticalAura>

      {/* 热门问题类型 */}
      <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-xl p-8 border border-primary-500/20">
        <h3 className="text-xl font-semibold text-midnight-100 mb-6">
          热门问题类型
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { category: "career", count: 8, icon: "💼" },
            { category: "relationship", count: 6, icon: "💕" },
            { category: "wealth", count: 4, icon: "💰" },
            { category: "health", count: 3, icon: "🏥" },
            { category: "study", count: 2, icon: "📚" },
            { category: "family", count: 1, icon: "👨‍👩‍👧‍👦" },
          ].map((item) => (
            <div
              key={item.category}
              className="flex items-center space-x-3 bg-midnight-700/50 rounded-lg p-3"
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="text-midnight-200">
                  {getCategoryName(item.category)}
                </p>
                <p className="text-sm text-midnight-400">{item.count}次</p>
              </div>
            </div>
          ))}
        </div>
      </MysticalAura>
    </div>
  );

  return (
    <div className="min-h-screen bg-cosmic-gradient relative overflow-hidden">
      <Stars count={30} />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-golden-400 to-golden-600 bg-clip-text text-transparent mb-4">
            个人中心
          </h1>
          <p className="text-midnight-300">管理您的占卜记录和个人信息</p>
        </div>

        {/* 标签页导航 */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-midnight-800/50 backdrop-blur-sm rounded-full p-1 border border-primary-500/20">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-mystical-purple to-mystical-indigo text-white shadow-glow"
                  : "text-midnight-300 hover:text-midnight-100"
              }`}
            >
              📊 概览
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-mystical-purple to-mystical-indigo text-white shadow-glow"
                  : "text-midnight-300 hover:text-midnight-100"
              }`}
            >
              📜 历史
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === "stats"
                  ? "bg-gradient-to-r from-mystical-purple to-mystical-indigo text-white shadow-glow"
                  : "text-midnight-300 hover:text-midnight-100"
              }`}
            >
              📈 统计
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="animate-fadeIn">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "history" && renderHistory()}
          {activeTab === "stats" && renderStats()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
