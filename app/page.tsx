"use client"

import { useCallback } from "react"

import { useRef } from "react"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Code,
  Eye,
  Cog,
  FileCheck,
  BarChart3,
  Cloud,
  Users,
  Activity,
  Zap,
  Database,
  Server,
  Cpu,
  Shield,
  Rocket,
  Globe,
} from "lucide-react"
import { ModelManager } from "@/components/model-manager"
import { FileUpload } from "@/components/file-upload"
import { database } from "@/lib/database"
import { ollamaClient } from "@/lib/ollama-client"
import { motion } from "framer-motion"
import {
  Code2,
  EyeIcon as EyeOriginal,
  Palette,
  CogIcon as CogOriginal,
  FileSearch,
  BarChart3Icon as BarChart3Original,
  CloudIcon as CloudOriginal,
  BrainIcon as BrainOriginal,
  ArrowRight,
  Star,
  UsersIcon as UsersOriginal,
  Video,
  Music,
  Terminal,
  BookOpen,
  Stethoscope,
  Settings,
  FileText,
  Heart,
} from "lucide-react"

import { useIsMobile } from "@/hooks"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import TextToImagePage from "@/components/pages/text-to-image"
import VideoEditorPage from "@/components/pages/video-editor"
import MusicStudioPage from "@/components/pages/music-studio"
import CodeStudioPage from "@/components/pages/code-studio"
import AIEnginePage from "@/components/pages/ai-engine"
import MedicalCenterPage from "@/components/pages/medical-center"

// 类型定义
interface Channel {
  id: string
  title: string
  subtitle: string
  description: string
  icon: React.ReactNode
  gradient: string
  page?: string
  type?: "creation" | "service" | "developer"
  stats?: Record<string, string>
  features?: string[]
  shortcut?: string
}

interface ChatMessage {
  type: "user" | "ai"
  content: string
  timestamp: Date
  id: string
}

interface AIInsight {
  type: "suggestion" | "optimization" | "insight"
  content: string
  priority: "high" | "medium" | "low"
  id: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onstart: () => void
  onend: () => void
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent {
  error: string
  message: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
  isFinal: boolean
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

// 统计数据接口
interface Stats {
  totalUsers: number
  activeProjects: number
  apiCalls: number
  successRate: number
}

// 工具卡片数据
const TOOL_CARDS = [
  {
    id: "ai-code-generation",
    title: "AI代码生成",
    description: "智能代码生成，支持多种编程语言和框架",
    icon: Code2,
    color: "from-blue-500 to-indigo-500",
    badge: "AI",
    stats: { users: "10K+", rating: 4.9 },
    href: "/code-generation",
  },
  {
    id: "app-development",
    title: "应用开发",
    description: "低代码可视化应用开发平台",
    icon: Palette,
    color: "from-purple-500 to-violet-500",
    badge: "HOT",
    stats: { users: "8K+", rating: 4.8 },
    href: "/app-development",
  },
  {
    id: "real-time-preview",
    title: "实时预览",
    description: "多格式内容实时预览和3D模型展示",
    icon: EyeOriginal,
    color: "from-green-500 to-emerald-500",
    badge: "NEW",
    stats: { users: "6K+", rating: 4.7 },
    href: "/preview",
  },
  {
    id: "automation",
    title: "自动化生产",
    description: "任务调度和自动化部署管理",
    icon: CogOriginal,
    color: "from-orange-500 to-red-500",
    stats: { users: "5K+", rating: 4.6 },
    href: "/automation",
  },
  {
    id: "file-review",
    title: "文件审查",
    description: "智能文件质量检测和错误分析",
    icon: FileSearch,
    color: "from-cyan-500 to-teal-500",
    stats: { users: "4K+", rating: 4.8 },
    href: "/file-review",
  },
  {
    id: "analytics",
    title: "评分分析",
    description: "数据分析和质量评分报告",
    icon: BarChart3Original,
    color: "from-pink-500 to-rose-500",
    stats: { users: "7K+", rating: 4.9 },
    href: "/analytics",
  },
  {
    id: "deployment",
    title: "部署管理",
    description: "多环境部署和版本管理",
    icon: CloudOriginal,
    color: "from-yellow-500 to-amber-500",
    stats: { users: "9K+", rating: 4.7 },
    href: "/deployment",
  },
  {
    id: "ai-engine",
    title: "AI引擎",
    description: "强大的AI助手和智能对话",
    icon: BrainOriginal,
    color: "from-indigo-500 to-purple-500",
    badge: "AI",
    stats: { users: "12K+", rating: 4.9 },
    href: "/ai-engine",
  },
]

// 统计数据
const PLATFORM_STATS = [
  { label: "活跃用户", value: "50K+", icon: UsersOriginal, color: "text-blue-400" },
  { label: "代码生成", value: "1M+", icon: Code2, color: "text-green-400" },
  { label: "项目部署", value: "100K+", icon: CloudOriginal, color: "text-purple-400" },
  { label: "满意度", value: "98%", icon: Star, color: "text-yellow-400" },
]

// 工具卡片数据
const toolCards = [
  {
    id: "weather",
    title: "天气查询",
    description: "实时天气信息查询",
    icon: Cloud,
    color: "from-blue-500 to-cyan-500",
    category: "数据服务",
  },
  {
    id: "ai-code",
    title: "AI代码生成",
    description: "智能代码生成与优化",
    icon: Code2,
    color: "from-green-500 to-emerald-500",
    category: "AI工具",
  },
  {
    id: "text-to-image",
    title: "文本转图像",
    description: "AI驱动的图像生成",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    category: "创意工具",
  },
  {
    id: "music-studio",
    title: "音乐工作室",
    description: "AI音乐创作与编辑",
    icon: Music,
    color: "from-orange-500 to-red-500",
    category: "创意工具",
  },
  {
    id: "video-editor",
    title: "视频编辑器",
    description: "智能视频处理与编辑",
    icon: Video,
    color: "from-indigo-500 to-purple-500",
    category: "创意工具",
  },
  {
    id: "ai-engine",
    title: "AI引擎",
    description: "多模态AI处理引擎",
    icon: Brain,
    color: "from-teal-500 to-blue-500",
    category: "AI工具",
  },
  {
    id: "medical-center",
    title: "医疗中心",
    description: "AI辅助医疗诊断",
    icon: Heart,
    color: "from-rose-500 to-pink-500",
    category: "专业工具",
  },
]

// 配置数据
const BROADCAST_MESSAGES = [
  "🎉 欢迎来到言语云³！万象归元于云枢，深栈智启新纪元！",
  "✨ 【言创图文】笔墨丹青绘世界，智能创作展风华 🎨",
  "🎬 【语枢视频】光影流转述故事，剪辑艺术铸经典 📽️",
  "🎵 【YYC³ Music】天籁之音谱华章，智慧旋律动心弦 🎼",
  "💻 【YYC³ CodeX】代码如诗逻辑美，程序世界任遨游 ⚡",
  "🧠 【智能引擎】群智汇聚启新元，算力无穷创未来 🚀",
  "🏥 【云枢医疗】悬壶济世显仁心，智慧医疗护苍生 💊",
  "🛠️ 【开发者工具】API文档、SDK下载，助力开发者创新 🔧",
  "💝 温馨提示：点击屏幕任意位置即可开始AI智能对话 🤖",
  "⚡ 快捷键：Ctrl+1~5 快速切换功能模块，提升效率300%",
  "🎯 新用户福利：免费体验所有AI创作工具，限时不限量 🎁",
]

const CREATION_CHANNELS: Channel[] = [
  {
    id: "image-creation",
    title: "言创图文",
    subtitle: "AI图像创作工作室",
    description: "笔墨丹青绘世界，智能创作展风华",
    icon: <Palette className="w-5 h-5" />,
    gradient: "from-pink-500 via-rose-500 to-red-500",
    page: "text-to-image",
    stats: { users: "12.5K", projects: "45.2K" },
    features: ["智能提示词", "多风格生成", "高清放大"],
    shortcut: "Ctrl+1",
  },
  {
    id: "video-hub",
    title: "语枢视频",
    subtitle: "智能视频编辑平台",
    description: "光影流转述故事，剪辑艺术铸经典",
    icon: <Video className="w-5 h-5" />,
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    page: "video-editor",
    stats: { users: "8.7K", projects: "23.1K" },
    features: ["AI智能剪辑", "实时预览", "语音合成"],
    shortcut: "Ctrl+2",
  },
  {
    id: "music-studio",
    title: "YYC³ Music",
    subtitle: "AI音乐创作工作室",
    description: "天籁之音谱华章，智慧旋律动心弦",
    icon: <Music className="w-5 h-5" />,
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    page: "music-studio",
    stats: { users: "6.3K", projects: "18.9K" },
    features: ["AI智能作曲", "多轨编辑", "音效库"],
    shortcut: "Ctrl+3",
  },
  {
    id: "code-studio",
    title: "YYC³ CodeX",
    subtitle: "智能编程开发平台",
    description: "代码如诗逻辑美，程序世界任遨游",
    icon: <Code2 className="w-5 h-5" />,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    page: "code-studio",
    stats: { users: "15.2K", projects: "67.8K" },
    features: ["多语言支持", "智能补全", "代码审查"],
    shortcut: "Ctrl+4",
  },
  {
    id: "ai-engine",
    title: "AI引擎",
    subtitle: "AI大模型管理中心",
    description: "群智汇聚启新元，算力无穷创未来",
    icon: <Brain className="w-5 h-5" />,
    gradient: "from-orange-500 via-red-500 to-pink-500",
    page: "ai-engine",
    stats: { users: "9.8K", projects: "34.5K" },
    features: ["多模型集成", "智能路由", "性能监控"],
    shortcut: "Ctrl+5",
  },
]

const SERVICE_CHANNELS: Channel[] = [
  {
    id: "medical-center",
    title: "云枢医疗",
    subtitle: "智能医疗健康平台",
    description: "悬壶济世显仁心，智慧医疗护苍生",
    icon: <Stethoscope className="w-5 h-5" />,
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    page: "medical-center",
    stats: { patients: "50K+", accuracy: "98.5%" },
    features: ["智能诊断", "病历分析", "健康监测"],
    shortcut: "Ctrl+6",
  },
  {
    id: "community-hub",
    title: "社区广场",
    subtitle: "创作者交流平台",
    description: "百家争鸣聚英才，思想碰撞启智慧",
    icon: <Users className="w-5 h-5" />,
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    page: "community",
    stats: { members: "28.7K", posts: "156K" },
    features: ["作品展示", "技术分享", "在线协作"],
    shortcut: "Ctrl+7",
  },
  {
    id: "learning-center",
    title: "学习中心",
    subtitle: "AI技能提升平台",
    description: "学而时习知识海，温故知新智慧开",
    icon: <BookOpen className="w-5 h-5" />,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    page: "learning",
    stats: { courses: "120+", students: "45.6K" },
    features: ["系统化课程", "实战项目", "专业认证"],
    shortcut: "Ctrl+8",
  },
]

const DEVELOPER_TOOLS: Channel[] = [
  {
    id: "api-docs",
    title: "API文档",
    subtitle: "完整的API接口文档",
    description: "开发者必备，接口文档详尽全",
    icon: <FileText className="w-5 h-5" />,
    gradient: "from-slate-600 via-gray-600 to-zinc-600",
    type: "developer",
    shortcut: "Ctrl+9",
  },
  {
    id: "sdk-download",
    title: "SDK下载",
    subtitle: "多语言SDK开发包",
    description: "多语言支持，开发包齐全备",
    icon: <Terminal className="w-5 h-5" />,
    gradient: "from-slate-600 via-gray-600 to-zinc-600",
    type: "developer",
    shortcut: "Ctrl+0",
  },
  {
    id: "dev-console",
    title: "开发者控制台",
    subtitle: "在线调试和测试工具",
    description: "在线调试，测试工具功能强",
    icon: <Settings className="w-5 h-5" />,
    gradient: "from-slate-600 via-gray-600 to-zinc-600",
    type: "developer",
    shortcut: "Ctrl+Shift+D",
  },
]

// AI回复模板优化
const AI_RESPONSE_TEMPLATES = {
  image: {
    keywords: ["图片", "图像", "画", "设计", "创作", "绘制"],
    response: `🎨 **图像创作专家为您服务**

我已分析您的需求，为您推荐最佳创作路径：

**🚀 立即开始：**
• 【言创图文】- 笔墨丹青绘世界，智能创作展风华
• 支持文生图、图生图、风格转换、高清修复

**💡 智能建议：**
• 如需批量处理，建议开启智能引擎的自动化工作流
• 可结合【数据分析】模块，获得设计趋势洞察
• 作品完成后，推荐到【社区广场】获得专业反馈

**⚡ 效率提升：**
快捷键 Ctrl+1 快速进入图文创作

是否需要我为您打开言创图文工作室？`,
    insights: [
      {
        type: "suggestion" as const,
        content: "检测到图像创作需求，已为您优化创作工作流程",
        priority: "high" as const,
      },
    ],
  },
  video: {
    keywords: ["视频", "剪辑", "编辑", "影片", "电影"],
    response: `🎬 **视频制作专家为您服务**

基于您的需求，我为您制定了专业的视频创作方案：

**🚀 核心功能：**
• 【语枢视频】- 光影流转述故事，剪辑艺术铸经典
• AI智能剪辑、实时特效预览、语音合成、自动字幕

**💡 创作建议：**
• 如需配乐，可无缝连接【YYC³ Music】音乐工作室
• 建议使用【智能引擎】进行批量视频处理
• 完成作品可在【社区广场】展示获得反馈

**⚡ 工作流优化：**
视频创作 → 音乐配乐 → 智能合成 → 社区分享

快捷键 Ctrl+2 快速进入视频编辑

准备好开始您的视频创作之旅了吗？`,
    insights: [
      {
        type: "optimization" as const,
        content: "视频+音乐组合创作可提升作品质量300%",
        priority: "high" as const,
      },
    ],
  },
  medical: {
    keywords: ["医疗", "健康", "诊断", "病症", "治疗"],
    response: `🏥 **云枢医疗专家为您服务**

基于您的医疗健康需求，我为您推荐专业的医疗AI解决方案：

**🚀 核心功能：**
• 【云枢医疗】- 悬壶济世显仁心，智慧医疗护苍生
• 智能诊断、病历分析、健康监测、医学影像分析

**💡 医疗建议：**
• 支持多种医学影像的AI辅助诊断
• 智能病历分析和健康风险评估
• 个性化健康管理和用药指导

**⚡ 专业优势：**
• 诊断准确率达98.5%，服务患者超50K+
• 24/7智能健康监测和预警
• 与权威医疗机构深度合作

快捷键 Ctrl+6 快速进入医疗中心

准备好体验智慧医疗的力量了吗？`,
    insights: [
      {
        type: "suggestion" as const,
        content: "检测到医疗健康需求，云枢医疗可提供专业AI辅助诊断",
        priority: "high" as const,
      },
    ],
  },
  code: {
    keywords: ["代码", "编程", "开发", "程序", "算法"],
    response: `💻 **编程开发专家为您服务**

我已分析您的编程需求，为您推荐最佳开发方案：

**🚀 核心功能：**
• 【YYC³ CodeX】- 代码如诗逻辑美，程序世界任遨游
• 多语言支持、智能补全、代码审查、自动化测试

**💡 开发建议：**
• 支持Python、JavaScript、Java、C++等主流语言
• AI智能代码生成和优化建议
• 集成开发者工具链，提升开发效率

**⚡ 效率提升：**
• 智能代码补全，减少50%编码时间
• 自动化测试和部署，保证代码质量
• 团队协作功能，支持多人开发

快捷键 Ctrl+4 快速进入代码工作室

准备好开始您的编程之旅了吗？`,
    insights: [
      {
        type: "optimization" as const,
        content: "AI辅助编程可提升开发效率200%，建议使用智能补全功能",
        priority: "high" as const,
      },
    ],
  },
  default: {
    keywords: [],
    response: `🤖 **全局智能助手为您服务**

我已对您的需求进行了全面分析：

**🎯 智能推荐：**
基于您的描述，我为您推荐以下解决方案：

• **创作需求** → 【言创图文】【语枢视频】【YYC³ Music】
• **开发需求** → 【YYC³ CodeX】【开发者工具】
• **医疗健康** → 【云枢医疗】【健康监测】
• **学习需求** → 【学习中心】【社区广场】
• **分析需求** → 【数据分析】【智能引擎】

**💡 智能洞察：**
• 建议您详细描述具体需求，我可以提供更精准的建议

**⚡ 效率优化：**
• 多功能协同使用可提升整体效率300%
• 建议开启智能工作流，实现自动化处理
• 使用数据分析跟踪和优化工作效果

**🚀 快捷键提示：**
• Ctrl+1~5：快速切换创作工具
• Ctrl+6~8：快速切换服务工具
• Ctrl+H：返回首页
• Ctrl+/：显示所有快捷键

请告诉我您的具体目标，我将为您制定详细的实施方案！`,
    insights: [
      {
        type: "insight" as const,
        content: "建议详细描述需求，以获得更精准的智能建议",
        priority: "medium" as const,
      },
    ],
  },
}

// 快捷键配置
const SHORTCUTS = {
  "Ctrl+1": "text-to-image",
  "Ctrl+2": "video-editor",
  "Ctrl+3": "music-studio",
  "Ctrl+4": "code-studio",
  "Ctrl+5": "ai-engine",
  "Ctrl+6": "medical-center",
  "Ctrl+7": "community",
  "Ctrl+8": "learning",
  "Ctrl+H": "home",
  "Ctrl+/": "help",
  "Ctrl+Space": "activate-ai",
  Escape: "close-all",
}

export default function HomePage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalFiles: 0,
    totalMessages: 0,
    ollamaStatus: false,
  })
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useLocalStorage("search-query", "")
  const [statsOriginal, setStatsOriginal] = useState({
    totalUsers: 0,
    activeProjects: 0,
    apiCalls: 0,
    successRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [isInitialized, setIsInitialized] = useState(false)
  const [systemStatus, setSystemStatus] = useState("正常")
  const [fileStats, setFileStats] = useState({
    totalProjects: 0,
    totalFiles: 0,
    totalChats: 0,
    systemStatus: "正常",
  })

  // 状态管理
  const [isActive, setIsActive] = useState(false)
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [showLeftPanel, setShowLeftPanel] = useState(false)
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [showNavDropdown, setShowNavDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [currentPage, setCurrentPage] = useState<string>("home")
  const [currentBroadcast, setCurrentBroadcast] = useState("")
  const [broadcastIndex, setBroadcastIndex] = useState(0)
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [showShortcutHelp, setShowShortcutHelp] = useState(false)

  // Refs
  const mountedRef = useRef(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const broadcastTimerRef = useRef<NodeJS.Timeout | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      icon: Brain,
      title: "AI代码生成",
      description: "通过自然语言描述生成多语言代码",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      status: "active",
    },
    {
      icon: Code,
      title: "应用开发",
      description: "低代码/零代码应用快速开发",
      color: "text-green-500",
      bgColor: "bg-green-50",
      status: "active",
    },
    {
      icon: Eye,
      title: "实时预览",
      description: "支持多种内容格式的实时预览",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      status: "active",
    },
    {
      icon: Cog,
      title: "自动化生产",
      description: "任务调度与自动化部署",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      status: "development",
    },
    {
      icon: FileCheck,
      title: "文件审查",
      description: "多格式文件错误检测与修复",
      color: "text-red-500",
      bgColor: "bg-red-50",
      status: "development",
    },
    {
      icon: BarChart3,
      title: "评分分析",
      description: "质量评分与优化建议",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      status: "development",
    },
  ]

  const systemInfo = [
    { label: "运行环境", value: "Next.js 15 + React 18", icon: <Rocket className="h-4 w-4" /> },
    { label: "AI引擎", value: "Ollama本地部署", icon: <Cpu className="h-4 w-4" /> },
    { label: "数据存储", value: "IndexedDB本地数据库", icon: <Database className="h-4 w-4" /> },
    { label: "网络状态", value: "本地优先", icon: <Globe className="h-4 w-4" /> },
    { label: "安全等级", value: "企业级", icon: <Shield className="h-4 w-4" /> },
    { label: "部署方式", value: "混合云", icon: <Cloud className="h-4 w-4" /> },
  ]

  // 初始化数据库和加载统计信息
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 初始化数据库
        await database.init()

        // 检查Ollama状态
        const ollamaHealthy = await ollamaClient.checkHealth()

        // 加载统计数据
        const dbStats = await database.getStats()

        setStats({
          ...dbStats,
          ollamaStatus: ollamaHealthy,
        })

        toast({
          title: "系统初始化完成",
          description: "言語云³深度堆栈全栈智创引擎已就绪",
        })
      } catch (error) {
        console.error("应用初始化失败:", error)
        toast({
          title: "初始化失败",
          description: "请刷新页面重试",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [toast])

  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName)
    toast({
      title: "模型选择成功",
      description: `已选择模型: ${modelName}`,
    })
  }

  const handleFileUploaded = (file: any) => {
    console.log("文件上传成功:", file)
    // 重新加载统计信息
    database.getStats().then((dbStats) => {
      setStats((prev) => ({ ...prev, ...dbStats }))
    })
  }

  // 懒加载机制
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // 广播系统
  useEffect(() => {
    setCurrentBroadcast(BROADCAST_MESSAGES[0])
    broadcastTimerRef.current = setInterval(() => {
      if (mountedRef.current) {
        setBroadcastIndex((prev) => {
          const next = (prev + 1) % BROADCAST_MESSAGES.length
          setCurrentBroadcast(BROADCAST_MESSAGES[next])
          return next
        })
      }
    }, 8000)

    return () => {
      if (broadcastTimerRef.current) clearInterval(broadcastTimerRef.current)
    }
  }, [])

  // 语音识别初始化
  useEffect(() => {
    if (typeof window !== "undefined" && !isMobile) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "zh-CN"

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = ""
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            }
          }
          if (finalTranscript) {
            setInputText((prev) => prev + finalTranscript)
          }
        }

        recognitionRef.current.onerror = () => setIsListening(false)
        recognitionRef.current.onend = () => setIsListening(false)
      }
    }
  }, [isMobile])

  // 模拟数据加载
  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true)
      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStatsOriginal({
        totalUsers: 12580,
        activeProjects: 3420,
        apiCalls: 156780,
        successRate: 99.2,
      })
      setIsLoading(false)
    }

    loadStats()
  }, [])

  // 清理函数
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (recognitionRef.current) recognitionRef.current.stop()
      if (broadcastTimerRef.current) clearInterval(broadcastTimerRef.current)
    }
  }, [])

  // 智能AI回复生成
  const generateAIResponse = useCallback((userInput: string) => {
    const input = userInput.toLowerCase()

    // 检查关键词匹配
    for (const [key, template] of Object.entries(AI_RESPONSE_TEMPLATES)) {
      if (key === "default") continue
      if (template.keywords.some((keyword) => input.includes(keyword))) {
        return {
          response: template.response.replace("${userInput}", userInput),
          insights: template.insights.map((insight) => ({
            ...insight,
            id: Math.random().toString(36).substr(2, 9),
          })),
        }
      }
    }

    // 默认回复
    return {
      response: AI_RESPONSE_TEMPLATES.default.response.replace("${userInput}", userInput),
      insights: AI_RESPONSE_TEMPLATES.default.insights.map((insight) => ({
        ...insight,
        id: Math.random().toString(36).substr(2, 9),
      })),
    }
  }, [])

  // 事件处理函数
  const handleScreenClick = useCallback(
    (e: React.MouseEvent) => {
      if (
        (e.target as HTMLElement).closest(".panel, .input-area, .nav-dropdown, button, .broadcast-system, .mobile-menu")
      )
        return
      if (!isMobile) {
        setIsActive(true)
      }
    },
    [isMobile],
  )

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current || isMobile) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }, [isListening, isMobile])

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim()) return

    const userMessage = inputText.trim()
    const messageId = Math.random().toString(36).substr(2, 9)
    setInputText("")
    setIsProcessing(true)

    setChatHistory((prev) => [...prev, { type: "user", content: userMessage, timestamp: new Date(), id: messageId }])

    try {
      // 模拟网络延迟，但优化响应速度
      await new Promise((resolve) => setTimeout(resolve, 800))

      const { response, insights } = generateAIResponse(userMessage)

      setAiResponse(response)
      setChatHistory((prev) => [
        ...prev,
        { type: "ai", content: response, timestamp: new Date(), id: messageId + "_ai" },
      ])

      setAiInsights(insights)

      // 自动滚动到底部
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
      }, 100)
    } catch (error) {
      setAiResponse("抱歉，处理您的请求时出现了问题。请稍后重试。")
    } finally {
      setIsProcessing(false)
    }
  }, [inputText, generateAIResponse])

  const handlePageNavigation = useCallback((page: string) => {
    setCurrentPage(page)
    setShowLeftPanel(false)
    setShowRightPanel(false)
    setShowNavDropdown(false)
    setShowMobileMenu(false)
  }, [])

  const handleBackToHome = useCallback(() => {
    setCurrentPage("home")
  }, [])

  // 快捷键处理
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // 基本快捷键
      if (e.key === "Enter" && inputText.trim() && isActive) {
        e.preventDefault()
        handleSendMessage()
        return
      }

      if (e.key === "Escape") {
        setIsActive(false)
        setInputText("")
        setAiInsights([])
        setShowLeftPanel(false)
        setShowRightPanel(false)
        setShowNavDropdown(false)
        setShowShortcutHelp(false)
        return
      }

      // 组合快捷键
      const shortcutKey = `${e.ctrlKey ? "Ctrl+" : ""}${e.shiftKey ? "Shift+" : ""}${e.key}`

      if (SHORTCUTS[shortcutKey as keyof typeof SHORTCUTS]) {
        e.preventDefault()
        const action = SHORTCUTS[shortcutKey as keyof typeof SHORTCUTS]

        switch (action) {
          case "home":
            handleBackToHome()
            break
          case "help":
            setShowShortcutHelp(!showShortcutHelp)
            break
          case "activate-ai":
            setIsActive(true)
            break
          case "close-all":
            setIsActive(false)
            setShowLeftPanel(false)
            setShowRightPanel(false)
            setShowNavDropdown(false)
            break
          default:
            handlePageNavigation(action)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [inputText, isActive, showShortcutHelp, handleSendMessage, handlePageNavigation, handleBackToHome])

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 虚拟滚动组件
  const VirtualizedChatHistory = useCallback(() => {
    const itemHeight = 80
    const containerHeight = 300
    const visibleItems = Math.ceil(containerHeight / itemHeight)

    return (
      <div
        ref={chatContainerRef}
        className="chat-history max-h-[300px] overflow-y-auto pr-2 mb-4"
        style={{ height: containerHeight }}
      >
        {chatHistory.slice(-visibleItems * 2).map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} mb-4`}
          >
            <div className={`max-w-[80%] ${message.type === "user" ? "order-2" : "order-1"}`}>
              <div
                className={`bg-gradient-to-r ${
                  message.type === "user" ? "from-blue-600 to-purple-600" : "from-slate-700 to-slate-600"
                } rounded-lg p-3 shadow-lg`}
              >
                <p className="text-white text-sm leading-relaxed">{message.content}</p>
              </div>
              <div className={`text-white/50 text-xs mt-1 ${message.type === "user" ? "text-right" : "text-left"}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }, [chatHistory])

  // 渲染频道卡片
  const renderChannelCard = (channel: Channel, index: number) => (
    <motion.div
      key={channel.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className={`bg-gradient-to-br ${channel.gradient} border-0 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
        onClick={() => channel.page && handlePageNavigation(channel.page)}
      >
        <CardContent className={`${isMobile ? "p-3" : "p-4"}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">{channel.icon}</div>
              <div>
                <h3 className={`text-white font-bold ${isMobile ? "text-xs" : "text-sm"}`}>{channel.title}</h3>
                <p className={`text-white/80 ${isMobile ? "text-xs" : "text-xs"}`}>{channel.subtitle}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
          <p className={`text-white/90 ${isMobile ? "text-xs" : "text-xs"} mb-3 leading-relaxed font-medium`}>
            {channel.description}
          </p>
          {channel.stats && !isMobile && (
            <div className="flex items-center space-x-3 mb-3">
              {Object.entries(channel.stats).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-white/70" />
                  <span className="text-white/80 text-xs">{value}</span>
                </div>
              ))}
            </div>
          )}
          {channel.features && (
            <div className="grid grid-cols-1 gap-1">
              {channel.features.slice(0, isMobile ? 2 : 3).map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-md px-2 py-1 text-white/80 text-xs text-center"
                >
                  {feature}
                </div>
              ))}
            </div>
          )}
          {channel.shortcut && !isMobile && (
            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-white/60">
              <p>快捷键: {channel.shortcut}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  // 过滤工具卡片
  const filteredTools = toolCards.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "全部" || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["全部", ...Array.from(new Set(toolCards.map((tool) => tool.category)))]

  const handleToolClick = (toolId: string) => {
    toast({
      title: "功能启动中",
      description: `正在启动 ${toolCards.find((t) => t.id === toolId)?.title}...`,
    })
  }

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <h2 className="text-xl font-semibold">正在初始化系统...</h2>
          <p className="text-muted-foreground">言語云³深度堆栈全栈智创引擎启动中</p>
        </div>
      </div>
    )
  }

  // 页面路由
  if (currentPage !== "home") {
    const pageComponents = {
      "text-to-image": TextToImagePage,
      "video-editor": VideoEditorPage,
      "music-studio": MusicStudioPage,
      "code-studio": CodeStudioPage,
      "ai-engine": AIEnginePage,
      "medical-center": MedicalCenterPage,
    }

    const PageComponent = pageComponents[currentPage]
    if (!PageComponent) return null

    return <PageComponent onBack={handleBackToHome} />
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <h2 className="text-xl font-semibold">正在初始化系统...</h2>
          <p className="text-muted-foreground">言語云³深度堆栈全栈智创引擎启动中</p>
        </div>
      </div>
    )
  }

  // 主页渲染
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* 头部欢迎区域 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            言語云³ 深度堆栈全栈智创引擎
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            YanYu Cloud³ DeepStack Full-Stack Intelligent Creation Engine
          </p>
          <p className="text-lg font-medium text-primary">言枢象限·语启未来 | 万象归元于云枢，深栈智启新纪元</p>
        </div>

        {/* 系统状态卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">项目总数</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">文件总数</p>
                  <p className="text-2xl font-bold">{stats.totalFiles}</p>
                </div>
                <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Database className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">对话消息</p>
                  <p className="text-2xl font-bold">{stats.totalMessages}</p>
                </div>
                <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI服务</p>
                  <p className="text-2xl font-bold">
                    <Badge variant={stats.ollamaStatus ? "default" : "destructive"}>
                      {stats.ollamaStatus ? "运行中" : "离线"}
                    </Badge>
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Server className="h-6 w-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要功能区域 */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">功能概览</TabsTrigger>
            <TabsTrigger value="models">模型管理</TabsTrigger>
            <TabsTrigger value="files">文件管理</TabsTrigger>
            <TabsTrigger value="settings">系统设置</TabsTrigger>
          </TabsList>

          {/* 功能概览 */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`h-12 w-12 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <Badge variant={feature.status === "active" ? "default" : "secondary"}>
                        {feature.status === "active" ? "可用" : "开发中"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant={feature.status === "active" ? "default" : "outline"}
                      disabled={feature.status !== "active"}
                    >
                      {feature.status === "active" ? "立即使用" : "即将推出"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 快速开始指南 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  快速开始
                </CardTitle>
                <CardDescription>按照以下步骤快速上手言語云³平台</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">配置AI模型</h4>
                      <p className="text-sm text-muted-foreground">在模型管理中下载并配置您需要的AI模型</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">创建项目</h4>
                      <p className="text-sm text-muted-foreground">使用AI代码生成功能创建您的第一个项目</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">实时预览</h4>
                      <p className="text-sm text-muted-foreground">使用实时预览功能查看和调试您的代码</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 模型管理 */}
          <TabsContent value="models">
            <ModelManager onModelSelect={handleModelSelect} selectedModel={selectedModel} />
          </TabsContent>

          {/* 文件管理 */}
          <TabsContent value="files">
            <FileUpload
              userId="demo-user"
              projectId="demo-project"
              acceptedTypes={["*"]}
              maxSize={50}
              multiple={true}
              onFileUploaded={handleFileUploaded}
            />
          </TabsContent>

          {/* 系统设置 */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>系统配置</CardTitle>
                <CardDescription>配置系统参数和偏好设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ollama服务地址</label>
                    <input
                      className="w-full px-3 py-2 border rounded-md"
                      defaultValue={process.env.NEXT_PUBLIC_OLLAMA_URL || "http://localhost:11434"}
                      placeholder="http://localhost:11434"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">默认模型</label>
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option value="llama3.2">Llama 3.2</option>
                      <option value="qwen2.5">Qwen 2.5</option>
                      <option value="codellama">CodeLlama</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">主题设置</label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      浅色
                    </Button>
                    <Button variant="outline" size="sm">
                      深色
                    </Button>
                    <Button variant="outline" size="sm">
                      自动
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">语言设置</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option value="zh-CN">简体中文</option>
                    <option value="en-US">English</option>
                  </select>
                </div>

                <div className="pt-4">
                  <Button>保存设置</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>系统信息</CardTitle>
                <CardDescription>查看系统运行状态和技术信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {systemInfo.map((info, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        {info.icon}
                        <span className="font-medium">{info.label}</span>
                      </div>
                      <span className="text-muted-foreground">{info.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>数据管理</CardTitle>
                <CardDescription>管理本地数据和缓存</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">清除缓存</h4>
                    <p className="text-sm text-muted-foreground">清除所有缓存数据以释放存储空间</p>
                  </div>
                  <Button variant="outline">清除缓存</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">导出数据</h4>
                    <p className="text-sm text-muted-foreground">导出项目和聊天记录数据</p>
                  </div>
                  <Button variant="outline">导出数据</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-600">重置应用</h4>
                    <p className="text-sm text-muted-foreground">删除所有本地数据，恢复到初始状态</p>
                  </div>
                  <Button variant="destructive">重置应用</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 底部信息 */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>© 2024 言語云³ 深度堆栈全栈智创引擎 - 技术驱动创新，智能引领未来</p>
          <p className="mt-1">基于 Next.js + Tailwind CSS + Three.js + Radix UI + Framer Motion 构建</p>
        </div>
      </div>
    </div>
  )
}
