import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { TaiJi, Stars, MysticalAura } from '@/components/ui/TrigramSymbol';
import DivinationAnimation, { DivinationResult } from '@/components/ui/DivinationAnimation';

interface QuestionCategory {
  id: string;
  name: string;
  icon: string;
  examples: string[];
  gradient: string;
}

interface DivinationMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  gradient: string;
  timeRequired: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const Divination: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  // 状态管理
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // 从URL参数获取预设的占卜方法
  useEffect(() => {
    const method = searchParams.get('method');
    if (method) {
      setSelectedMethod(method);
      setCurrentStep(2); // 直接跳到问题输入步骤
    }
  }, [searchParams]);

  // 问题分类
  const questionCategories: QuestionCategory[] = [
    {
      id: 'career',
      name: '事业发展',
      icon: '💼',
      examples: ['工作发展前景如何？', '是否应该跳槽？', '项目能否成功？'],
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'relationship',
      name: '感情婚姻',
      icon: '💕',
      examples: ['感情发展如何？', '何时能遇到正缘？', '婚姻是否美满？'],
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: 'health',
      name: '健康养生',
      icon: '🏥',
      examples: ['身体状况如何？', '疾病能否康复？', '如何改善健康？'],
      gradient: 'from-green-500 to-teal-600'
    },
    {
      id: 'wealth',
      name: '财运投资',
      icon: '💰',
      examples: ['财运如何？', '投资是否有利？', '如何增加收入？'],
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: 'study',
      name: '学业考试',
      icon: '📚',
      examples: ['考试能否通过？', '学习进展如何？', '适合什么专业？'],
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      id: 'family',
      name: '家庭亲情',
      icon: '👨‍👩‍👧‍👦',
      examples: ['家庭关系如何？', '子女教育问题？', '长辈健康如何？'],
      gradient: 'from-cyan-500 to-blue-600'
    }
  ];

  // 占卜方法
  const divinationMethods: DivinationMethod[] = [
    {
      id: 'liuyao',
      name: '六爻占卜',
      icon: '🔮',
      description: '传统六爻掷币占卜，细致入微，适合复杂问题',
      gradient: 'from-mystical-purple to-mystical-indigo',
      timeRequired: '10-15分钟',
      difficulty: 'medium'
    },
    {
      id: 'meihua',
      name: '梅花易数',
      icon: '✨',
      description: '快速数字起卦，简单直观，适合日常决策',
      gradient: 'from-golden-400 to-golden-600',
      timeRequired: '3-5分钟',
      difficulty: 'easy'
    },
    {
      id: 'ai',
      name: 'AI智能解卦',
      icon: '🧠',
      description: '结合传统智慧与AI技术，深度个性化分析',
      gradient: 'from-mystical-teal to-mystical-rose',
      timeRequired: '5-8分钟',
      difficulty: 'easy'
    }
  ];

  // 处理分类选择
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep(2);
  };

  // 处理方法选择
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setCurrentStep(3);
  };

  // 处理问题提交
  const handleQuestionSubmit = async () => {
    if (!question.trim() || !selectedMethod) return;

    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          message: '请先登录后再进行占卜',
          redirectTo: `/divination?method=${selectedMethod}`,
          question: question.trim()
        }
      });
      return;
    }

    // 显示动画而不是简单的loading
    setShowAnimation(true);
  };

  // 处理动画完成
  const handleAnimationComplete = (result: DivinationResult) => {
    setShowAnimation(false);

    // 跳转到占卜结果页面，传递动画结果
    navigate('/divination/result', {
      state: {
        method: result.method,
        question: result.question,
        category: result.category,
        divinationResult: result // 传递完整的占卜结果
      }
    });
  };

  // 关闭动画
  const handleCloseAnimation = () => {
    setShowAnimation(false);
  };

  // 渲染步骤指示器
  const renderStepIndicator = () => (
    <div className="flex justify-center items-center space-x-4 mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
            step <= currentStep
              ? 'bg-gradient-to-r from-mystical-purple to-mystical-indigo text-white shadow-glow'
              : 'bg-midnight-700 text-midnight-400'
          }`}>
            {step < currentStep ? '✓' : step}
          </div>
          {step < 3 && (
            <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
              step < currentStep ? 'bg-gradient-to-r from-mystical-purple to-mystical-indigo' : 'bg-midnight-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  // 渲染分类选择
  const renderCategorySelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-midnight-100 mb-4">选择问题类型</h2>
        <p className="text-midnight-300">选择最符合您问题的分类，有助于获得更准确的解读</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questionCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className="cursor-pointer group"
          >
            <MysticalAura className={`h-full bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 ${
              selectedCategory === category.id
                ? 'border-golden-400 shadow-glow-lg'
                : 'border-primary-500/20 hover:border-primary-500/40 transform hover:scale-105'
            }`}>
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${category.gradient} rounded-full flex items-center justify-center text-3xl shadow-lg`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-midnight-100">{category.name}</h3>
                <div className="space-y-2">
                  {category.examples.slice(0, 2).map((example, index) => (
                    <p key={index} className="text-sm text-midnight-400 italic">"{example}"</p>
                  ))}
                </div>
              </div>
            </MysticalAura>
          </div>
        ))}
      </div>
    </div>
  );

  // 渲染方法选择
  const renderMethodSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-midnight-100 mb-4">选择占卜方法</h2>
        <p className="text-midnight-300">不同的方法适合不同的问题和需求</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {divinationMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => handleMethodSelect(method.id)}
            className="cursor-pointer"
          >
            <MysticalAura className={`h-full bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all duration-300 ${
              selectedMethod === method.id
                ? 'border-golden-400 shadow-glow-lg transform scale-105'
                : 'border-primary-500/20 hover:border-primary-500/40 transform hover:scale-102'
            }`}>
              <div className="text-center space-y-6">
                <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${method.gradient} rounded-full flex items-center justify-center text-4xl shadow-lg`}>
                  {method.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-midnight-100">{method.name}</h3>
                  <p className="text-midnight-300 leading-relaxed">{method.description}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-midnight-400">时间:</span>
                    <span className="text-golden-400 font-medium">{method.timeRequired}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-midnight-400">难度:</span>
                    <div className="flex space-x-1">
                      {['easy', 'medium', 'hard'].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-2 rounded-full ${
                            method.difficulty === level ? 'bg-golden-400' : 'bg-midnight-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <div className="flex items-center justify-center text-golden-400">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">已选择</span>
                  </div>
                )}
              </div>
            </MysticalAura>
          </div>
        ))}
      </div>
    </div>
  );

  // 渲染问题输入
  const renderQuestionInput = () => (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-midnight-100 mb-4">输入您的问题</h2>
        <p className="text-midnight-300">请详细描述您想要了解的问题，保持内心平静专注</p>
      </div>

      <MysticalAura className="bg-midnight-800/40 backdrop-blur-sm rounded-2xl p-8 border border-primary-500/20">
        <div className="space-y-6">
          {/* 选中的信息展示 */}
          {(selectedCategory || selectedMethod) && (
            <div className="flex flex-wrap justify-center gap-4 pb-6 border-b border-midnight-700">
              {selectedCategory && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-primary-500/20 rounded-full">
                  <span>{questionCategories.find(c => c.id === selectedCategory)?.icon}</span>
                  <span className="text-sm text-midnight-200">
                    {questionCategories.find(c => c.id === selectedCategory)?.name}
                  </span>
                </div>
              )}
              {selectedMethod && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-mystical-purple/20 rounded-full">
                  <span>{divinationMethods.find(m => m.id === selectedMethod)?.icon}</span>
                  <span className="text-sm text-midnight-200">
                    {divinationMethods.find(m => m.id === selectedMethod)?.name}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 问题输入框 */}
          <div className="space-y-4">
            <label htmlFor="question" className="block text-lg font-medium text-midnight-100">
              您的问题
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="请详细描述您想要占卜的问题..."
              className="w-full h-32 px-4 py-3 bg-midnight-900/50 border border-primary-500/30 rounded-xl text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-golden-400 focus:ring-2 focus:ring-golden-400/20 transition-all duration-300 resize-none"
              maxLength={500}
            />
            <div className="text-right">
              <span className="text-sm text-midnight-400">{question.length}/500</span>
            </div>
          </div>

          {/* 问题建议 */}
          {selectedCategory && (
            <div className="space-y-3">
              <p className="text-sm text-midnight-400">相关问题示例：</p>
              <div className="flex flex-wrap gap-2">
                {questionCategories.find(c => c.id === selectedCategory)?.examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(example)}
                    className="px-3 py-2 bg-midnight-700/50 hover:bg-midnight-700 text-midnight-300 hover:text-golden-400 rounded-lg text-sm transition-colors duration-300 border border-midnight-600 hover:border-golden-400/30"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 提交按钮 */}
          <div className="flex justify-center pt-6">
            <button
              onClick={handleQuestionSubmit}
              disabled={!question.trim() || isSubmitting}
              className="px-8 py-4 bg-gradient-to-r from-mystical-purple to-mystical-indigo text-white font-semibold rounded-full shadow-glow-lg hover:shadow-glow transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>正在占卜中...</span>
                </>
              ) : (
                <>
                  <span>开始占卜</span>
                  <TaiJi size="sm" className="animate-spin-slow" />
                </>
              )}
            </button>
          </div>
        </div>
      </MysticalAura>

      {/* 占卜须知 */}
      <div className="text-center space-y-2 text-sm text-midnight-400">
        <p>占卜前请保持内心平静，专注思考您的问题</p>
        <p>占卜结果仅供参考，重要决策请理性思考</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cosmic-gradient relative overflow-hidden">
      {/* 星空背景 */}
      <Stars count={40} />

      {/* 主要内容 */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 步骤指示器 */}
        {renderStepIndicator()}

        {/* 根据当前步骤渲染不同内容 */}
        <div className="animate-fadeIn">
          {currentStep === 1 && renderCategorySelection()}
          {currentStep === 2 && renderMethodSelection()}
          {currentStep === 3 && renderQuestionInput()}
        </div>

        {/* 返回按钮 */}
        {currentStep > 1 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-midnight-400 hover:text-golden-400 transition-colors duration-300 flex items-center space-x-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>返回上一步</span>
            </button>
          </div>
        )}
      </div>

      {/* 占卜动画 */}
      {showAnimation && selectedMethod && (
        <DivinationAnimation
          isOpen={showAnimation}
          onClose={handleCloseAnimation}
          onComplete={handleAnimationComplete}
          question={question.trim()}
          method={selectedMethod as 'liuyao' | 'meihua' | 'ai'}
          category={selectedCategory}
        />
      )}
    </div>
  );
};


export default Divination;
