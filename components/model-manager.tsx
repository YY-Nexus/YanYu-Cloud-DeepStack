"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ollamaClient, type OllamaModel } from "@/lib/ollama-client"
import { Download, Trash2, RefreshCw, Search, AlertCircle, CheckCircle } from "lucide-react"

interface ModelManagerProps {
  onModelSelect?: (modelName: string) => void
  selectedModel?: string
}

const RECOMMENDED_MODELS = [
  {
    name: "llama3.2",
    description: "Meta的最新Llama模型，平衡性能和效率",
    size: "2.0GB",
    category: "通用",
  },
  {
    name: "qwen2.5",
    description: "阿里巴巴的Qwen模型，中文支持优秀",
    size: "4.4GB",
    category: "中文",
  },
  {
    name: "codellama",
    description: "专门用于代码生成的Llama模型",
    size: "3.8GB",
    category: "编程",
  },
  {
    name: "mistral",
    description: "高效的开源模型，适合快速推理",
    size: "4.1GB",
    category: "通用",
  },
  {
    name: "phi3",
    description: "微软的小型高效模型",
    size: "2.3GB",
    category: "轻量",
  },
]

export function ModelManager({ onModelSelect, selectedModel }: ModelManagerProps) {
  const [models, setModels] = useState<OllamaModel[]>([])
  const [loading, setLoading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [customModelName, setCustomModelName] = useState("")
  const [ollamaStatus, setOllamaStatus] = useState<"checking" | "online" | "offline">("checking")
  const { toast } = useToast()

  useEffect(() => {
    checkOllamaStatus()
  }, [])

  const checkOllamaStatus = async () => {
    setOllamaStatus("checking")
    const isHealthy = await ollamaClient.checkHealth()
    setOllamaStatus(isHealthy ? "online" : "offline")
    if (isHealthy) {
      loadModels()
    }
  }

  const loadModels = async () => {
    setLoading(true)
    try {
      const modelList = await ollamaClient.listModels()
      setModels(modelList)
    } catch (error) {
      toast({
        title: "加载失败",
        description: "无法获取模型列表，请检查Ollama服务状态",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadModel = async (modelName: string) => {
    try {
      setDownloadProgress({ ...downloadProgress, [modelName]: 0 })
      toast({
        title: "开始下载",
        description: `正在下载模型 ${modelName}...`,
      })

      await ollamaClient.pullModel(modelName, (progress) => {
        setDownloadProgress({ ...downloadProgress, [modelName]: progress })
      })

      setDownloadProgress({ ...downloadProgress, [modelName]: 100 })
      toast({
        title: "下载完成",
        description: `模型 ${modelName} 下载成功`,
      })

      // 重新加载模型列表
      loadModels()
    } catch (error) {
      toast({
        title: "下载失败",
        description: `模型 ${modelName} 下载失败，请重试`,
        variant: "destructive",
      })
      setDownloadProgress({ ...downloadProgress, [modelName]: 0 })
    }
  }

  const handleDeleteModel = async (modelName: string) => {
    try {
      await ollamaClient.deleteModel(modelName)
      toast({
        title: "删除成功",
        description: `模型 ${modelName} 已删除`,
      })
      loadModels()
    } catch (error) {
      toast({
        title: "删除失败",
        description: `无法删除模型 ${modelName}`,
        variant: "destructive",
      })
    }
  }

  const handleDownloadCustomModel = async () => {
    if (!customModelName.trim()) {
      toast({
        title: "请输入模型名称",
        description: "请输入要下载的模型名称",
        variant: "destructive",
      })
      return
    }

    await handleDownloadModel(customModelName.trim())
    setCustomModelName("")
  }

  const filteredRecommendedModels = RECOMMENDED_MODELS.filter(
    (model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const installedModelNames = models.map((m) => m.name)

  return (
    <div className="space-y-6">
      {/* Ollama状态 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Ollama服务状态
                {ollamaStatus === "online" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {ollamaStatus === "offline" && <AlertCircle className="h-5 w-5 text-red-500" />}
                {ollamaStatus === "checking" && <RefreshCw className="h-5 w-5 animate-spin" />}
              </CardTitle>
              <CardDescription>
                {ollamaStatus === "online" && "Ollama服务运行正常"}
                {ollamaStatus === "offline" && "Ollama服务未运行，请启动Ollama服务"}
                {ollamaStatus === "checking" && "正在检查服务状态..."}
              </CardDescription>
            </div>
            <Button onClick={checkOllamaStatus} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              刷新状态
            </Button>
          </div>
        </CardHeader>
      </Card>

      {ollamaStatus === "offline" && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Ollama服务未运行</h4>
                <p className="text-sm text-red-600 mt-1">
                  请确保已安装并启动Ollama服务。访问{" "}
                  <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="underline">
                    ollama.ai
                  </a>{" "}
                  获取安装指南。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {ollamaStatus === "online" && (
        <>
          {/* 已安装的模型 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>已安装的模型</CardTitle>
                  <CardDescription>管理您已下载的AI模型</CardDescription>
                </div>
                <Button onClick={loadModels} variant="outline" size="sm" disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  刷新
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {models.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>暂无已安装的模型</p>
                  <p className="text-sm mt-1">从下方推荐模型中选择一个开始使用</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {models.map((model) => (
                    <div key={model.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{model.name}</h4>
                          {selectedModel === model.name && <Badge variant="default">当前选择</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          大小: {(model.size / 1024 / 1024 / 1024).toFixed(1)}GB
                        </p>
                        <p className="text-xs text-muted-foreground">
                          修改时间: {new Date(model.modified_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {onModelSelect && (
                          <Button
                            onClick={() => onModelSelect(model.name)}
                            variant={selectedModel === model.name ? "default" : "outline"}
                            size="sm"
                          >
                            {selectedModel === model.name ? "已选择" : "选择"}
                          </Button>
                        )}
                        <Button onClick={() => handleDeleteModel(model.name)} variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 搜索 */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索推荐模型..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* 推荐模型 */}
          <Card>
            <CardHeader>
              <CardTitle>推荐模型</CardTitle>
              <CardDescription>精选的高质量AI模型，适合不同使用场景</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecommendedModels.map((model) => {
                  const isInstalled = installedModelNames.includes(model.name)
                  const isDownloading = downloadProgress[model.name] > 0 && downloadProgress[model.name] < 100

                  return (
                    <div key={model.name} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {model.name}
                            <Badge variant="outline">{model.category}</Badge>
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">大小: {model.size}</p>
                        </div>
                      </div>

                      {isDownloading && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>下载中...</span>
                            <span>{Math.round(downloadProgress[model.name])}%</span>
                          </div>
                          <Progress value={downloadProgress[model.name]} />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {isInstalled ? (
                          <>
                            <Badge variant="default" className="text-xs">
                              已安装
                            </Badge>
                            {onModelSelect && (
                              <Button
                                onClick={() => onModelSelect(model.name)}
                                variant={selectedModel === model.name ? "default" : "outline"}
                                size="sm"
                              >
                                {selectedModel === model.name ? "已选择" : "选择"}
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button onClick={() => handleDownloadModel(model.name)} disabled={isDownloading} size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            {isDownloading ? "下载中..." : "下载"}
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* 自定义模型下载 */}
          <Card>
            <CardHeader>
              <CardTitle>自定义模型</CardTitle>
              <CardDescription>下载其他Ollama支持的模型</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="输入模型名称，如: llama2, mistral:7b"
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleDownloadCustomModel()
                    }
                  }}
                />
                <Button onClick={handleDownloadCustomModel}>
                  <Download className="h-4 w-4 mr-2" />
                  下载
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                访问{" "}
                <a href="https://ollama.ai/library" target="_blank" rel="noopener noreferrer" className="underline">
                  Ollama模型库
                </a>{" "}
                查看所有可用模型
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
