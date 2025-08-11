# YanYu-Cloud-DeepStack
YanYu Cloud³ DeepStack
# 言語云³ 深度堆栈全栈智创引擎

**YanYu Cloud³ DeepStack Full-Stack Intelligent Creation Engine**

> 言枢象限·语启未来 | YanShu Quadrant · YuQi Future  
> 万象归元于云枢，深栈智启新纪元 | All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era

## 📖 项目简介

言語云³ 深度堆栈全栈智创引擎是一个基于 Next.js 15 的现代化企业级智能开发平台，集成了 AI 代码生成、应用开发、实时预览、自动化生产、文件审查、评分分析与多环境部署等核心功能。

### 🎯 核心理念

- **智能化开发** - 基于 Ollama 本地 AI 模型的代码生成和智能助手
- **可视化设计** - 3D 立体视觉和响应式体验
- **模块化架构** - 每个功能实现自治单元，可独立运行
- **企业级品质** - 完整的错误处理、缓存策略、性能监控

## 🛠️ 技术栈

### 前端框架
- **Next.js 15** - React 全栈框架，支持 App Router
- **React 18.3** - 用户界面库，支持并发特性
- **TypeScript 5.2** - 类型安全的 JavaScript 超集

### UI 组件库
- **Tailwind CSS 3.3** - 原子化 CSS 框架
- **Radix UI** - 无障碍的原始 UI 组件
- **Framer Motion 10** - 动画和交互库
- **Lucide React** - 现代化图标库
- **Sonner** - 优雅的通知组件

### 3D 和可视化
- **Three.js** - 3D 图形库
- **@react-three/fiber** - React Three.js 渲染器
- **@react-three/drei** - Three.js 实用工具

### 状态管理和数据
- **Zustand** - 轻量级状态管理
- **TanStack Query** - 服务器状态管理
- **IndexedDB** - 浏览器本地数据库

### AI 和机器学习
- **Ollama** - 本地 AI 模型运行时
- **AI SDK** - Vercel AI 工具包
- **OpenAI SDK** - OpenAI API 集成

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git 钩子管理
- **Jest** - 单元测试框架

## ✨ 核心功能

### 🤖 AI 代码生成
- 支持多种编程语言代码生成
- 集成 Ollama 本地 AI 模型
- 实时代码质量评分和建议
- 代码历史记录和复用

### 🏗️ 应用开发
- 拖拽式界面搭建
- 实时代码编辑和预览
- 多框架支持（React、Vue、Angular）
- 组件库和模板系统

### 👁️ 实时预览
- Markdown 实时渲染
- 3D 模型预览（GLB/OBJ/GLTF）
- 代码语法高亮
- 多媒体内容支持

### 🚀 自动化生产
- 一键 GitHub 同步
- 多环境部署（本地/云端）
- CI/CD 流水线集成
- 任务进度可视化

### 📋 文件审查
- 多格式文件支持
- 自动错误检测
- 质量评分系统
- 优化建议生成

### 📊 数据分析
- 实时性能监控
- API 调用统计
- 用户行为分析
- 系统健康检查

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Ollama** (可选，用于本地 AI 功能)

### 安装步骤

1. **克隆项目**
\`\`\`bash
git clone https://github.com/your-org/yanyu-cloud3-deepstack.git
cd yanyu-cloud3-deepstack
\`\`\`

2. **安装依赖**
\`\`\`bash
npm install
\`\`\`

3. **配置环境变量**
\`\`\`bash
cp .env.example .env.local
# 编辑 .env.local 文件，配置必要的环境变量
\`\`\`

4. **启动开发服务器**
\`\`\`bash
npm run dev
\`\`\`

5. **访问应用**
\`\`\`
http://localhost:3000
\`\`\`

### Ollama 配置（可选）

1. **安装 Ollama**
\`\`\`bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# 下载并安装 Ollama for Windows
\`\`\`

2. **启动 Ollama 服务**
\`\`\`bash
ollama serve
\`\`\`

3. **下载模型**
\`\`\`bash
# 下载 Llama 3 模型
ollama pull llama3

# 下载 Code Llama 模型
ollama pull codellama

# 下载 Qwen2 模型
ollama pull qwen2
\`\`\`

## 📁 项目结构

\`\`\`
yanyu-cloud3-deepstack/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   ├── ai/                   # AI 相关 API
│   │   │   ├── chat/             # 聊天接口
│   │   │   ├── text/             # 文本处理
│   │   │   └── image/            # 图像处理
│   │   ├── files/                # 文件管理
│   │   ├── models/               # 模型管理
│   │   ├── weather/              # 天气查询
│   │   ├── news/                 # 新闻获取
│   │   ├── currency/             # 汇率转换
│   │   └── health/               # 健康检查
│   ├── globals.css               # 全局样式
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 主页面
│   └── loading.tsx               # 加载页面
├── components/                   # React 组件
│   ├── ui/                       # UI 基础组件
│   ├── pages/                    # 页面组件
│   ├── ai-code-generator.tsx     # AI 代码生成器
│   ├── model-manager.tsx         # 模型管理器
│   ├── file-upload.tsx           # 文件上传
│   ├── 3d-model-viewer.tsx       # 3D 模型查看器
│   └── sidebar-navigation.tsx    # 侧边栏导航
├── hooks/                        # React Hooks
│   ├── use-mobile.tsx            # 移动端检测
│   ├── use-local-storage.ts      # 本地存储
│   ├── use-toast.ts              # 消息提示
│   └── index.ts                  # Hook 导出
├── lib/                          # 工具库
│   ├── database.ts               # 数据库封装
│   ├── ollama-client.ts          # Ollama 客户端
│   ├── api-services.ts           # API 服务
│   ├── cache-manager.ts          # 缓存管理
│   ├── rate-limiter.ts           # 限流器
│   ├── error-handler.ts          # 错误处理
│   └── utils.ts                  # 通用工具
├── scripts/                      # 脚本文件
│   ├── cache-warmup.py           # 缓存预热
│   └── monitor-data-generator.py # 监控数据生成
├── public/                       # 静态资源
├── types/                        # TypeScript 类型定义
├── middleware/                   # 中间件
├── tests/                        # 测试文件
├── .env.example                  # 环境变量示例
├── .eslintrc.json               # ESLint 配置
├── tailwind.config.ts           # Tailwind 配置
├── next.config.mjs              # Next.js 配置
├── package.json                 # 项目依赖
└── README.md                    # 项目文档
\`\`\`

## 🔌 API 接口文档

### AI 相关接口

#### POST /api/ai/chat
AI 聊天对话接口

**请求参数：**
\`\`\`json
{
  "model": "llama3",
  "messages": [
    {
      "role": "user",
      "content": "生成一个 Python 冒泡排序函数"
    }
  ],
  "stream": false,
  "options": {
    "temperature": 0.7,
    "top_p": 0.9
  }
}
\`\`\`

**响应示例：**
\`\`\`json
{
  "model": "llama3",
  "message": {
    "role": "assistant",
    "content": "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr"
  },
  "done": true
}
\`\`\`

#### GET /api/models
获取可用 AI 模型列表

**响应示例：**
\`\`\`json
{
  "models": [
    {
      "name": "llama3:latest",
      "size": 4661224676,
      "digest": "365c0bd3c000a25d28ddbf732fe1c6add414de7275464c4e4d1c3b5fcb5d8ad1",
      "modified_at": "2024-01-15T10:30:00Z"
    }
  ]
}
\`\`\`

### 数据服务接口

#### POST /api/weather
天气查询接口

**请求参数：**
\`\`\`json
{
  "city": "北京"
}
\`\`\`

**响应示例：**
\`\`\`json
{
  "data": "# 🌤️ 北京天气预报\n\n## 📊 当前天气\n• **天气状况**：晴\n• **温度**：25°C\n• **湿度**：60%"
}
\`\`\`

#### POST /api/news
新闻获取接口

**请求参数：**
\`\`\`json
{
  "category": "technology"
}
\`\`\`

#### POST /api/currency
汇率转换接口

**请求参数：**
\`\`\`json
{
  "from": "USD",
  "to": "CNY",
  "amount": 100
}
\`\`\`

### 文件管理接口

#### POST /api/files/upload
文件上传接口

**请求格式：** `multipart/form-data`

**响应示例：**
\`\`\`json
{
  "success": true,
  "files": [
    {
      "id": "file_123",
      "name": "example.jpg",
      "originalName": "my-image.jpg",
      "size": 1024000,
      "type": "image/jpeg",
      "url": "/api/files/file_123.jpg"
    }
  ]
}
\`\`\`

#### GET /api/files
获取文件列表

**查询参数：**
- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：20）
- `type`: 文件类型过滤

### 系统监控接口

#### GET /api/health
系统健康检查

**响应示例：**
\`\`\`json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": "healthy",
    "ollama": "healthy",
    "cache": "healthy"
  }
}
\`\`\`

#### GET /api/monitor
系统监控数据

**响应示例：**
\`\`\`json
{
  "cpu": 45.2,
  "memory": 68.5,
  "disk": 32.1,
  "network": {
    "inbound": 1024,
    "outbound": 2048
  }
}
\`\`\`

## 🎨 UI 组件库

### 基础组件
- `Button` - 按钮组件
- `Input` - 输入框组件
- `Card` - 卡片组件
- `Dialog` - 对话框组件
- `Toast` - 消息提示组件

### 业务组件
- `AICodeGenerator` - AI 代码生成器
- `ModelManager` - 模型管理器
- `FileUpload` - 文件上传组件
- `3DModelViewer` - 3D 模型查看器
- `CodePreview` - 代码预览组件

### 使用示例

\`\`\`tsx
import { Button } from '@/components/ui/button'
import { AICodeGenerator } from '@/components/ai-code-generator'

export default function MyPage() {
  return (
    <div>
      <Button variant="primary">
        生成代码
      </Button>
      <AICodeGenerator 
        model="llama3"
        onGenerate={(code) => console.log(code)}
      />
    </div>
  )
}
\`\`\`

## 🔧 开发指南

### 代码规范

1. **TypeScript 优先** - 所有新代码必须使用 TypeScript
2. **组件命名** - 使用 PascalCase 命名组件
3. **文件命名** - 使用 kebab-case 命名文件
4. **注释规范** - 代码注释使用中文，接口注释使用英文

### 提交规范

\`\`\`bash
# 功能开发
git commit -m "feat: 添加AI代码生成功能"

# 问题修复
git commit -m "fix: 修复文件上传错误"

# 文档更新
git commit -m "docs: 更新API文档"

# 样式调整
git commit -m "style: 优化按钮样式"

# 重构代码
git commit -m "refactor: 重构数据库连接逻辑"
\`\`\`

### 测试指南

\`\`\`bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch
\`\`\`

### 性能优化

1. **代码分割** - 使用动态导入分割代码
2. **图片优化** - 使用 Next.js Image 组件
3. **缓存策略** - 合理使用 Redis 和浏览器缓存
4. **懒加载** - 非关键组件使用懒加载

## 🚀 部署指南

### 本地部署

\`\`\`bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
\`\`\`

### Docker 部署

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

\`\`\`bash
# 构建镜像
docker build -t yanyu-cloud3 .

# 运行容器
docker run -p 3000:3000 yanyu-cloud3
\`\`\`

### Vercel 部署

1. **连接 GitHub 仓库**
2. **配置环境变量**
3. **自动部署**

\`\`\`bash
# 使用 Vercel CLI 部署
npx vercel --prod
\`\`\`

### 环境变量配置

生产环境需要配置以下环境变量：

\`\`\`bash
# 基础配置
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# AI 服务
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
OPENAI_API_KEY=your_openai_key

# 外部 API
WEATHER_API_KEY=your_weather_key
NEWS_API_KEY=your_news_key
IPINFO_TOKEN=your_ipinfo_token

# 数据库和缓存
KV_REST_API_URL=your_redis_url
KV_REST_API_TOKEN=your_redis_token

# 监控和分析
SENTRY_DSN=your_sentry_dsn
GOOGLE_ANALYTICS_ID=your_ga_id
\`\`\`

## 📊 性能监控

### 关键指标

- **首屏加载时间** (FCP) < 1.5s
- **最大内容绘制** (LCP) < 2.5s
- **累积布局偏移** (CLS) < 0.1
- **首次输入延迟** (FID) < 100ms

### 监控工具

- **Vercel Analytics** - 性能分析
- **Sentry** - 错误监控
- **Google Analytics** - 用户行为分析
- **Lighthouse** - 性能审计

## 🔒 安全考虑

### 数据安全
- 所有 API 请求使用 HTTPS
- 敏感数据加密存储
- 定期安全审计

### 访问控制
- API 限流保护
- 输入验证和清理
- CORS 策略配置

### 隐私保护
- 用户数据本地存储
- 可选的数据收集
- GDPR 合规性

## 🤝 贡献指南

### 参与贡献

1. **Fork 项目**
2. **创建功能分支** (`git checkout -b feature/amazing-feature`)
3. **提交更改** (`git commit -m 'feat: 添加惊人功能'`)
4. **推送分支** (`git push origin feature/amazing-feature`)
5. **创建 Pull Request**

### 问题报告

使用 GitHub Issues 报告问题，请包含：

- 问题描述
- 复现步骤
- 期望行为
- 实际行为
- 环境信息

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目和社区：

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Radix UI](https://www.radix-ui.com/) - UI 组件库
- [Ollama](https://ollama.ai/) - 本地 AI 运行时
- [Vercel](https://vercel.com/) - 部署平台

## 📞 联系我们

- **项目主页**: https://github.com/YY-Nexus/YanYu-Cloud-DeepStack.git
- **问题反馈**: https://github.com/Y-Nexus/YanYu-Cloud-DeepStack/issues
- **邮箱**: deepstack@0379.email
- **官网**: https://deepstack.0379.pro

---

**言語云³ 深度堆栈全栈智创引擎** - 让 AI 赋能每一行代码 🚀
