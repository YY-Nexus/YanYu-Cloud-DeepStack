"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Code2,
  Palette,
  Eye,
  Cog,
  FileSearch,
  BarChart3,
  Cloud,
  Home,
  Zap,
  Brain,
  ImageIcon,
  Music,
  Video,
  FileCode,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// 导航菜单项类型
interface NavigationItem {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  badge?: string
  description?: string
  category: "main" | "tools" | "ai" | "settings"
}

// 导航菜单数据
const navigationItems: NavigationItem[] = [
  // 主要功能
  {
    id: "home",
    title: "首页",
    icon: Home,
    href: "/",
    description: "返回主页面",
    category: "main",
  },
  {
    id: "code-generation",
    title: "AI代码生成",
    icon: Code2,
    href: "/code-generation",
    badge: "AI",
    description: "智能代码生成工具",
    category: "main",
  },
  {
    id: "app-development",
    title: "应用开发",
    icon: Palette,
    href: "/app-development",
    description: "低代码应用开发",
    category: "main",
  },
  {
    id: "preview",
    title: "实时预览",
    icon: Eye,
    href: "/preview",
    description: "多格式内容预览",
    category: "main",
  },
  {
    id: "automation",
    title: "自动化生产",
    icon: Cog,
    href: "/automation",
    description: "任务自动化管理",
    category: "main",
  },
  {
    id: "file-review",
    title: "文件审查",
    icon: FileSearch,
    href: "/file-review",
    description: "文件质量检测",
    category: "main",
  },
  {
    id: "analytics",
    title: "评分分析",
    icon: BarChart3,
    href: "/analytics",
    description: "数据分析报告",
    category: "main",
  },
  {
    id: "deployment",
    title: "部署管理",
    icon: Cloud,
    href: "/deployment",
    description: "多环境部署",
    category: "main",
  },

  // AI工具
  {
    id: "ai-engine",
    title: "AI引擎",
    icon: Brain,
    href: "/ai-engine",
    badge: "NEW",
    description: "智能AI助手",
    category: "ai",
  },
  {
    id: "text-to-image",
    title: "文本生图",
    icon: ImageIcon,
    href: "/text-to-image",
    badge: "AI",
    description: "AI图像生成",
    category: "ai",
  },
  {
    id: "video-editor",
    title: "视频编辑",
    icon: Video,
    href: "/video-editor",
    description: "AI视频处理",
    category: "ai",
  },
  {
    id: "music-studio",
    title: "音乐工作室",
    icon: Music,
    href: "/music-studio",
    description: "AI音乐创作",
    category: "ai",
  },
  {
    id: "code-studio",
    title: "代码工作室",
    icon: FileCode,
    href: "/code-studio",
    badge: "HOT",
    description: "智能编程助手",
    category: "ai",
  },

  // 专业工具
  {
    id: "medical-center",
    title: "医疗中心",
    icon: Stethoscope,
    href: "/medical-center",
    description: "医疗AI助手",
    category: "tools",
  },
]

// 设置菜单项
const settingsItems: NavigationItem[] = [
  {
    id: "settings",
    title: "系统设置",
    icon: Settings,
    href: "/settings",
    description: "系统配置管理",
    category: "settings",
  },
  {
    id: "profile",
    title: "个人资料",
    icon: User,
    href: "/profile",
    description: "用户信息管理",
    category: "settings",
  },
  {
    id: "help",
    title: "帮助中心",
    icon: HelpCircle,
    href: "/help",
    description: "使用帮助文档",
    category: "settings",
  },
]

interface SidebarNavigationProps {
  className?: string
}

export function SidebarNavigation({ className }: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  // 按类别分组菜单项
  const mainItems = navigationItems.filter((item) => item.category === "main")
  const aiItems = navigationItems.filter((item) => item.category === "ai")
  const toolItems = navigationItems.filter((item) => item.category === "tools")

  // 渲染导航项
  const renderNavigationItem = (item: NavigationItem) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    const content = (
      <Link href={item.href} className="block w-full">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
            "hover:bg-white/10 hover:text-white",
            isActive
              ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-r-2 border-green-400"
              : "text-white/70",
            isCollapsed && "justify-center px-2",
          )}
        >
          <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-green-400")} />

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center justify-between flex-1 overflow-hidden"
              >
                <span className="truncate">{item.title}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-2 text-xs",
                      item.badge === "AI" && "bg-blue-500/20 text-blue-400",
                      item.badge === "NEW" && "bg-green-500/20 text-green-400",
                      item.badge === "HOT" && "bg-red-500/20 text-red-400",
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    )

    if (isCollapsed && item.description) {
      return (
        <TooltipProvider key={item.id}>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return <div key={item.id}>{content}</div>
  }

  // 渲染菜单组
  const renderMenuGroup = (
    title: string,
    items: NavigationItem[],
    icon?: React.ComponentType<{ className?: string }>,
  ) => {
    if (items.length === 0) return null

    return (
      <div className="space-y-1">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white/50 uppercase tracking-wider"
            >
              {icon && <icon className="h-4 w-4" />}
              {title}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1">{items.map(renderNavigationItem)}</div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ width: isCollapsed ? 80 : 280 }}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900",
          "border-r border-white/10 backdrop-blur-md",
          className,
        )}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">YYC³</h2>
                  <p className="text-xs text-white/60">DeepStack</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white/70 hover:text-white hover:bg-white/10 p-1.5"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* 导航菜单 */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {renderMenuGroup("主要功能", mainItems, Home)}
          <Separator className="mx-4 bg-white/10" />
          {renderMenuGroup("AI工具", aiItems, Brain)}
          <Separator className="mx-4 bg-white/10" />
          {renderMenuGroup("专业工具", toolItems, Stethoscope)}
        </div>

        {/* 底部设置 */}
        <div className="border-t border-white/10 p-4 space-y-2">
          {settingsItems.map(renderNavigationItem)}

          <Separator className="my-2 bg-white/10" />

          {/* 退出登录 */}
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-white/70 hover:text-white hover:bg-red-500/20",
              isCollapsed && "justify-center px-2",
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3"
                >
                  退出登录
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}
