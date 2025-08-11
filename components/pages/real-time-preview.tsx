"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Eye,
  Code2,
  FileText,
  Image,
  Video,
  Music,
  CuboidIcon as Cube,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Save,
  Copy,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/file-upload"
import { CodePreview } from "@/components/code-preview"
import { ModelViewer3D } from "@/components/3d-model-viewer"

interface PreviewFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  content?: string
  metadata?: Record<string, any>
  uploadedAt: Date
}

interface PreviewSettings {
  theme: "light" | "dark" | "auto"
  fontSize: number
  lineNumbers: boolean
  wordWrap: boolean
  minimap: boolean
  autoRefresh: boolean
  refreshInterval: number
}

interface ViewportSize {
  name: string
  width: number
  height: number
  icon: React.ReactNode
}

const VIEWPORT_SIZES: ViewportSize[] = [
  { name: "桌面", width: 1920, height: 1080, icon: <Monitor className="w-4 h-4" /> },
  { name: "笔记本", width: 1366, height: 768, icon: <Monitor className="w-4 h-4" /> },
  { name: "平板", width: 768, height: 1024, icon: <Tablet className="w-4 h-4" /> },
  { name: "手机", width: 375, height: 667, icon: <Smartphone className="w-4 h-4" /> },
]

const SUPPORTED_FORMATS = {
  code: [".js", ".ts", ".jsx", ".tsx", ".html", ".css", ".scss", ".json", ".xml", ".yaml", ".yml"],
  image: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"],
  video: [".mp4", ".webm", ".ogg", ".avi", ".mov"],
  audio: [".mp3", ".wav", ".ogg", ".aac", ".flac"],
  model3d: [".glb", ".gltf", ".obj", ".fbx", ".dae"],
  document: [".md", ".txt", ".pdf", ".doc", ".docx"],
}

interface RealTimePreviewPageProps {
  onBack?: () => void
}

export default function RealTimePreviewPage({ onBack }: RealTimePreviewPageProps) {
  const { toast } = useToast()
  const [files, setFiles] = useState<PreviewFile[]>([])
  const [activeFile, setActiveFile] = useState<PreviewFile | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedViewport, setSelectedViewport] = useState<ViewportSize>(VIEWPORT_SIZES[0])
  const [zoom, setZoom] = useState(100)
  const [settings, setSettings] = useState<PreviewSettings>({
    theme: "dark",
    fontSize: 14,
    lineNumbers: true,
    wordWrap: true,
    minimap: true,
    autoRefresh: true,
    refreshInterval: 1000,
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)

  const previewRef = useRef<HTMLDivElement>(null)
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 文件上传处理
  const handleFileUpload = useCallback(
    async (uploadedFiles: File[]) => {
      const newFiles: PreviewFile[] = []

      for (const file of uploadedFiles) {
        const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
        const fileType = getFileType(fileExtension)

        if (fileType === "unsupported") {
          toast({
            title: "不支持的文件格式",
            description: `文件 ${file.name} 的格式不受支持`,
            variant: "destructive",
          })
          continue
        }

        const url = URL.createObjectURL(file)
        let content = ""

        // 读取文本文件内容
        if (fileType === "code" || fileType === "document") {
          try {
            content = await file.text()
          } catch (error) {
            console.error("读取文件内容失败:", error)
          }
        }

        const previewFile: PreviewFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: fileType,
          size: file.size,
          url,
          content,
          metadata: {
            lastModified: file.lastModified,
            mimeType: file.type,
          },
          uploadedAt: new Date(),
        }

        newFiles.push(previewFile)
      }

      setFiles((prev) => [...prev, ...newFiles])

      if (newFiles.length > 0 && !activeFile) {
        setActiveFile(newFiles[0])
      }

      toast({
        title: "文件上传成功",
        description: `成功上传 ${newFiles.length} 个文件`,
      })
    },
    [activeFile, toast],
  )

  // 获取文件类型
  const getFileType = (extension: string): string => {
    for (const [type, extensions] of Object.entries(SUPPORTED_FORMATS)) {
      if (extensions.includes(extension)) {
        return type
      }
    }
    return "unsupported"
  }

  // 删除文件
  const handleDeleteFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => {
        const newFiles = prev.filter((f) => f.id !== fileId)
        if (activeFile?.id === fileId) {
          setActiveFile(newFiles.length > 0 ? newFiles[0] : null)
        }
        return newFiles
      })
    },
    [activeFile],
  )

  // 下载文件
  const handleDownloadFile = useCallback((file: PreviewFile) => {
    const a = document.createElement("a")
    a.href = file.url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [])

  // 复制内容
  const handleCopyContent = useCallback(
    async (file: PreviewFile) => {
      if (file.content) {
        try {
          await navigator.clipboard.writeText(file.content)
          toast({
            title: "复制成功",
            description: "文件内容已复制到剪贴板",
          })
        } catch (error) {
          toast({
            title: "复制失败",
            description: "无法复制到剪贴板",
            variant: "destructive",
          })
        }
      }
    },
    [toast],
  )

  // 分享文件
  const handleShareFile = useCallback(
    async (file: PreviewFile) => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: file.name,
            text: `查看文件: ${file.name}`,
            url: file.url,
          })
        } catch (error) {
          console.error("分享失败:", error)
        }
      } else {
        // 复制链接到剪贴板
        try {
          await navigator.clipboard.writeText(file.url)
          toast({
            title: "链接已复制",
            description: "文件链接已复制到剪贴板",
          })
        } catch (error) {
          toast({
            title: "分享失败",
            description: "无法复制链接",
            variant: "destructive",
          })
        }
      }
    },
    [toast],
  )

  // 切换全屏
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      previewRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // 缩放控制
  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 25, 300))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 25, 25))
  }, [])

  const handleZoomReset = useCallback(() => {
    setZoom(100)
  }, [])

  // 自动刷新
  useEffect(() => {
    if (settings.autoRefresh && activeFile?.type === "code") {
      refreshTimerRef.current = setInterval(() => {
        // 这里可以实现文件内容的自动刷新逻辑
        console.log("自动刷新预览")
      }, settings.refreshInterval)
    } else {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
        refreshTimerRef.current = null
      }
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }
    }
  }, [settings.autoRefresh, settings.refreshInterval, activeFile])

  // 渲染预览内容
  const renderPreviewContent = () => {
    if (!activeFile) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white/50">
          <Eye className="w-16 h-16 mb-4" />
          <h3 className="text-xl font-medium mb-2">选择文件开始预览</h3>
          <p className="text-sm">支持代码、图片、视频、音频、3D模型等多种格式</p>
        </div>
      )
    }

    const commonProps = {
      file: activeFile,
      settings,
      zoom: zoom / 100,
      viewport: selectedViewport,
    }

    switch (activeFile.type) {
      case "code":
      case "document":
        return <CodePreview {...commonProps} />

      case "image":
        return (
          <div className="flex items-center justify-center h-full">
            <img
              src={activeFile.url || "/placeholder.svg"}
              alt={activeFile.name}
              className="max-w-full max-h-full object-contain"
              style={{ transform: `scale(${zoom / 100})` }}
            />
          </div>
        )

      case "video":
        return (
          <div className="flex items-center justify-center h-full">
            <video
              src={activeFile.url}
              controls
              className="max-w-full max-h-full"
              style={{ transform: `scale(${zoom / 100})` }}
            />
          </div>
        )

      case "audio":
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Music className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-white text-xl font-medium">{activeFile.name}</h3>
            <audio src={activeFile.url} controls className="w-full max-w-md" />
          </div>
        )

      case "model3d":
        return <ModelViewer3D {...commonProps} />

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-white/50">
            <FileText className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-medium mb-2">无法预览此文件</h3>
            <p className="text-sm">不支持的文件格式</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* 顶部导航 */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={onBack} variant="ghost" className="text-white">
              ← 返回
            </Button>
            <h1 className="text-2xl font-bold text-white">实时预览</h1>
            <Badge className="bg-green-500">{files.length} 个文件</Badge>
          </div>

          <div className="flex items-center space-x-2">
            {/* 视口选择 */}
            <Select
              value={selectedViewport.name}
              onValueChange={(value) => {
                const viewport = VIEWPORT_SIZES.find((v) => v.name === value)
                if (viewport) setSelectedViewport(viewport)
              }}
            >
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VIEWPORT_SIZES.map((viewport) => (
                  <SelectItem key={viewport.name} value={viewport.name}>
                    <div className="flex items-center space-x-2">
                      {viewport.icon}
                      <span>{viewport.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 缩放控制 */}
            <div className="flex items-center space-x-1 bg-white/10 rounded-lg px-2 py-1">
              <Button size="sm" variant="ghost" onClick={handleZoomOut} className="text-white p-1">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-white text-sm min-w-[3rem] text-center">{zoom}%</span>
              <Button size="sm" variant="ghost" onClick={handleZoomIn} className="text-white p-1">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleZoomReset} className="text-white p-1">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* 全屏切换 */}
            <Button onClick={toggleFullscreen} variant="ghost" className="text-white">
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 左侧文件列表 */}
        <div className="w-80 bg-black/20 backdrop-blur-md border-r border-white/10 flex flex-col">
          {/* 文件上传区域 */}
          <div className="p-4 border-b border-white/10">
            <FileUpload
              onUpload={handleFileUpload}
              accept={Object.values(SUPPORTED_FORMATS).flat().join(",")}
              multiple
              className="w-full"
            />
          </div>

          {/* 文件列表 */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-white font-medium mb-3">文件列表</h3>
            <div className="space-y-2">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    activeFile?.id === file.id
                      ? "bg-blue-500/20 border border-blue-500/50"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => setActiveFile(file)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {getFileIcon(file.type)}
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-medium truncate">{file.name}</p>
                        <p className="text-white/50 text-xs">
                          {formatFileSize(file.size)} • {file.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyContent(file)
                        }}
                        className="text-white/70 hover:text-white p-1"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShareFile(file)
                        }}
                        className="text-white/70 hover:text-white p-1"
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadFile(file)
                        }}
                        className="text-white/70 hover:text-white p-1"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 设置面板 */}
          <div className="p-4 border-t border-white/10">
            <Tabs defaultValue="display" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="display" className="text-white">
                  显示
                </TabsTrigger>
                <TabsTrigger value="behavior" className="text-white">
                  行为
                </TabsTrigger>
              </TabsList>

              <TabsContent value="display" className="space-y-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">主题</span>
                  <Select
                    value={settings.theme}
                    onValueChange={(value: "light" | "dark" | "auto") =>
                      setSettings((prev) => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger className="w-20 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">浅色</SelectItem>
                      <SelectItem value="dark">深色</SelectItem>
                      <SelectItem value="auto">自动</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">字体大小</span>
                    <span className="text-white/70 text-sm">{settings.fontSize}px</span>
                  </div>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={([value]) => setSettings((prev) => ({ ...prev, fontSize: value }))}
                    min={10}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">行号</span>
                  <Switch
                    checked={settings.lineNumbers}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, lineNumbers: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">自动换行</span>
                  <Switch
                    checked={settings.wordWrap}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, wordWrap: checked }))}
                  />
                </div>
              </TabsContent>

              <TabsContent value="behavior" className="space-y-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">自动刷新</span>
                  <Switch
                    checked={settings.autoRefresh}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoRefresh: checked }))}
                  />
                </div>

                {settings.autoRefresh && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">刷新间隔</span>
                      <span className="text-white/70 text-sm">{settings.refreshInterval}ms</span>
                    </div>
                    <Slider
                      value={[settings.refreshInterval]}
                      onValueChange={([value]) => setSettings((prev) => ({ ...prev, refreshInterval: value }))}
                      min={500}
                      max={5000}
                      step={500}
                      className="w-full"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* 右侧预览区域 */}
        <div className="flex-1 flex flex-col">
          {/* 预览工具栏 */}
          {activeFile && (
            <div className="bg-black/20 backdrop-blur-md border-b border-white/10 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(activeFile.type)}
                  <div>
                    <h3 className="text-white font-medium">{activeFile.name}</h3>
                    <p className="text-white/50 text-sm">
                      {formatFileSize(activeFile.size)} • 上传于 {activeFile.uploadedAt.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="text-white">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    刷新
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white">
                    <Save className="w-4 h-4 mr-1" />
                    保存
                  </Button>
                  <Button size="sm" variant="ghost" className="text-white">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    新窗口
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 预览内容 */}
          <div
            ref={previewRef}
            className="flex-1 bg-black/10 backdrop-blur-sm overflow-auto"
            style={{
              width: selectedViewport.width,
              height: selectedViewport.height,
              maxWidth: "100%",
              maxHeight: "100%",
              margin: "0 auto",
            }}
          >
            {renderPreviewContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

// 辅助函数
function getFileIcon(type: string) {
  const iconMap = {
    code: <Code2 className="w-4 h-4 text-green-400" />,
    image: <Image className="w-4 h-4 text-blue-400" />,
    video: <Video className="w-4 h-4 text-red-400" />,
    audio: <Music className="w-4 h-4 text-purple-400" />,
    model3d: <Cube className="w-4 h-4 text-orange-400" />,
    document: <FileText className="w-4 h-4 text-gray-400" />,
  }
  return iconMap[type as keyof typeof iconMap] || <FileText className="w-4 h-4 text-gray-400" />
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
