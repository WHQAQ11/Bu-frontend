# CLAUDE.md

本文件为Claude Code (claude.ai/code)在此代码仓库中工作时提供指导。

## 项目概述

**每日一卦 (Bu-frontend)** 是一个基于React的占卜/易经前端应用，采用现代Web技术构建。

### 技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式系统**: Tailwind CSS 定制设计系统
- **状态管理**: Zustand 带持久化
- **路由系统**: React Router v6
- **HTTP客户端**: Axios
- **部署平台**: Vercel

### 项目结构
```
Bu-frontend/frontend/
├── src/
│   ├── components/
│   │   ├── Layout.tsx          # 主应用布局容器
│   │   └── ui/                 # UI组件
│   │       ├── ClassicBagua.tsx        # 传统八卦图组件
│   │       ├── DivinationAnimation.tsx # 占卜动画容器
│   │       ├── LiuYaoAnimation.tsx     # 六爻占卜动画
│   │       ├── MeiHuaAnimation.tsx     # 梅花易数动画
│   │       └── TrigramSymbol.tsx       # 单独卦象符号
│   ├── pages/                  # 页面组件
│   │   ├── Home.tsx           # 首页
│   │   ├── Divination.tsx     # 占卜选择页
│   │   ├── DivinationResult.tsx # 占卜结果展示页
│   │   ├── BaguaPage.tsx      # 专用八卦图页面
│   │   ├── AnimationDemo.tsx  # 动画演示页面
│   │   └── auth/              # 认证相关页面
│   ├── services/              # API服务
│   │   └── auth.ts           # 认证服务
│   ├── store/                 # Zustand状态存储
│   │   └── authStore.ts      # 认证状态管理
│   ├── types/                 # TypeScript类型定义
│   │   └── auth.ts           # 认证相关类型
│   └── utils/                 # 工具函数
├── public/                    # 静态资源
└── dist/                      # 构建输出
```

## 开发命令

### 核心开发
```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 代码质量
```bash
# 运行ESLint检查问题
npm run lint

# 自动修复ESLint问题
npm run lint:fix

# 使用Prettier格式化代码
npm run format
```

### 类型检查
```bash
# TypeScript编译检查（包含在构建中）
npm run build
```

## 架构与关键模式

### 状态管理
- **Zustand** 配合localStorage持久化认证状态
- 认证存储 (`src/store/authStore.ts`) 处理用户认证、令牌管理和持久化会话
- 使用 `createJSONStorage` 中间件自动同步localStorage

### 路由结构
- 主应用使用嵌套路由配合Layout容器
- 特例：`/bagua` 路由独立渲染，不使用Layout
- 支持认证的路由保护机制

### 组件架构
- **UI组件**: 位于 `src/components/ui/` 用于可复用UI元素
- **页面组件**: 位于 `src/pages/` 的路由级组件
- **布局系统**: 单个Layout组件包装大部分路由（除`/bagua`外）

### 动画系统
- **DivinationAnimation.tsx**: 占卜动画的全屏模态容器
- **LiuYaoAnimation.tsx**: 带铜钱投掷效果的六爻占卜
- **MeiHuaAnimation.tsx**: 基于时间计算的梅花易数占卜
- 动画使用CSS关键帧配合Tailwind自定义动画

### 样式系统
- **Tailwind CSS** 配合广泛的自定义主题扩展
- **自定义色彩方案**: 主蓝紫色调、金色点缀、午夜深色主题
- **自定义动画**: 20+个占卜效果的关键帧动画
- **中文字体**: 针对中文字符优化的字体堆栈

### 认证流程
- 基于JWT的认证配合持久化会话
- AuthService处理API调用和令牌存储
- 应用启动时自动初始化认证
- 带认证状态验证的路由保护

## 关键配置

### 路径别名 (tsconfig.json)
```typescript
"@/*": ["src/*"]
"@/components/*": ["src/components/*"]
"@/pages/*": ["src/pages/*"]
"@/store/*": ["src/store/*"]
"@/services/*": ["src/services/*"]
"@/types/*": ["src/types/*"]
```

### Vite配置
- React插件配合Fast Refresh
- 路径解析别名匹配tsconfig
- 开发服务器运行在3000端口
- 启用源码映射用于调试

### Tailwind配置
- 扩展色彩系统配合神秘主题（主色、金色、午夜色、卦象色彩）
- 占卜效果的自定义动画
- 中文字体优化字体族
- 响应式设计工具

## 开发工作流程

### GitHub协作工作流程原则

**重要原则：所有项目改动都必须遵循以下标准化流程**

#### 1. Issue创建标准
- **标题格式**: `类型(范围): 简短描述` (遵循语义化命名)
- **描述结构**:
  ```
  **目标**
  [清晰的改动目标说明]

  **验收标准**
  - [ ] 具体的验收条件1
  - [ ] 具体的验收条件2
  - [ ] 代码质量要求
  - [ ] 测试要求
  ```

#### 2. 分支管理策略
- **主分支**: `main` (生产环境，Vercel部署源)
- **功能分支**: `类型/issue编号-简短描述`
- **分支命名示例**: `refactor/issue1-standard-yao-symbols`

#### 3. 标准工作流程
1. **创建Issue** → 标准化的标题和描述
2. **创建专用分支** → `git checkout -b 类型/issue编号-简短描述`
3. **制定修改计划** → 详细的技术实施方案
4. **执行代码修改** → 符合Issue验收标准
5. **创建Pull Request** → 关联Issue (`Closes #编号`)
6. **代码审查** → 验证所有验收标准
7. **合并到主分支** → Issue自动关闭

#### 4. Pull Request规范
- **标题**: 与Issue标题保持一致
- **描述**: 包含修改内容和测试结果
- **关联**: 必须使用 `Closes #编号` 关联Issue
- **自动化**: PR合并后对应Issue自动关闭

#### 5. 代码质量要求
- 运行 `npm run lint` 检查代码质量
- 运行 `npm run build` 确保编译通过
- 手动测试核心功能
- 使用 `npm run format` 格式化代码

### 分支策略
- `main`: 生产分支 (Vercel部署源)
- `类型/issue编号-描述`: 遵循GitHub工作流程的功能/修复分支

### 提交前检查
1. 确保分支基于最新的 `main` 分支
2. 运行 `npm run lint` 检查代码问题
3. 运行 `npm run build` 确保TypeScript编译
4. 手动测试核心功能
5. 使用 `npm run format` 格式化代码

### 部署
- Vercel自动部署 `main` 分支
- PR可使用预览部署
- 构建输出到 `dist/` 目录

## 八卦系统实现

### 八卦类型
- **后天八卦**: 应用中统一使用以保持一致性
- **ClassicBagua.tsx**: 主要八卦图组件
- **TrigramSymbol.tsx**: 单独卦象渲染

### 一致性说明
所有八卦图都使用后天八卦序列，以保持页面间的一致性（首页、八卦页面、占卜页面）。

## 动画系统详情

### 六爻占卜动画
- 3枚铜钱投掷 × 6条爻线 = 总计18次铜钱动画
- 从下到上的渐进式爻线构建
- 变爻（老阳/老阴）配合发光效果
- 时长：约15-20秒

### 梅花易数动画
- 基于时间的计算显示
- 数字处理和公式可视化
- 卦象组合效果
- 时长：约10-15秒

### 动画容器
- 带深色遮罩的全屏模态
- 3秒后显示跳过按钮
- 完成后自动导航到结果页面
- 移动端/桌面端响应式设计

## API集成

### 认证服务
- 登录/注册端点
- JWT令牌管理
- 自动令牌刷新（如果实现）
- 用户资料管理

### API基础URL
在环境变量或AuthService实现中配置（检查 `src/services/auth.ts` 获取当前设置）。

## 测试注意事项

### 手动测试清单
- [ ] 认证流程（登录/登出/注册）
- [ ] 八卦图显示一致性
- [ ] 动画播放和完成
- [ ] 页面间导航
- [ ] 移动端响应式设计
- [ ] 控制台无错误运行

### 动画测试
- 测试六爻和梅花易数两种动画
- 验证跳过功能正常工作
- 检查到结果页面的导航
- 测试动画中断和恢复

## 常见开发任务

### 添加新动画类型
1. 在 `src/components/ui/` 中创建新组件
2. 遵循现有动画模式（LiuYaoAnimation/MeiHuaAnimation）
3. 添加到DivinationAnimation.tsx路由
4. 更新类型和接口

### 新组件样式
- 使用现有的Tailwind自定义色彩（主色、金色、午夜色）
- 遵循神秘/占卜主题指导原则
- 使用Tailwind断点实现响应式设计
- 使用tailwind.config.js中的自定义动画

### 状态管理
- 在 `src/store/` 中创建新的Zustand存储
- 遵循现有authStore模式配合持久化
- 在 `src/types/` 中添加TypeScript类型

## 部署注意事项

### 环境变量
确保为API端点和任何服务密钥配置适当的环境变量。

### 构建过程
```bash
npm run build  # TypeScript编译 + Vite构建
```
输出到 `dist/` 目录，准备Vercel部署。

### Vercel配置
- 构建命令: `npm run build`
- 输出目录: `dist`
- Node版本: 使用最新LTS版本