"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Cpu, Zap, Settings, Activity, MessageSquare, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

export default function AIEnginePage() {
  const [selectedModel, setSelectedModel] = useState("zhipu")
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const aiModels = [
    {
      id: "zhipu",
      name: "智谱AI",
      description: "GLM-4 大语言模型",
      status: "online",
      performance: 95,
      icon: <Brain className="w-5 h-5" />,
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "ollama",
      name: "Ollama",
      description: "本地部署模型",
      status: "online",
      performance: 88,
      icon: <Cpu className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      description: "深度推理模型",
      status: "online",
      performance: 92,
      icon: <Zap className="w-5 h-5" />,
      color: "from-purple-500 to-violet-500",
    },
    {
      id: "custom",
      name: "自定义模型",
      description: "用户训练模型",
      status: "offline",
      performance: 0,
      icon: <Settings className="w-5 h-5" />,
      color: "from-gray-500 to-slate-500",
    },
  ]

  const systemStats = {
    totalRequests: 12847,
    successRate: 98.5,
    avgResponseTime: 1.2,
    activeModels: 3,
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    setIsProcessing(true)
    setResponse("")

    // 模拟AI响应
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockResponse = `基于${aiModels.find((m) => m.id === selectedModel)?.name}的回答：

${prompt}

这是一个很好的问题。根据我的分析，我建议从以下几个方面来考虑：

1. 首先需要明确目标和需求
2. 分析现有资源和限制条件
3. 制定具体的实施方案
4. 建立评估和反馈机制

希望这个回答对您有帮助。如果您需要更详细的解释或有其他问题，请随时告诉我。`

    setResponse(mockResponse)
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">智能引擎</span>{" "}
            控制中心
          </h1>
          <p className="text-white/70">统一管理和调用多个AI大模型，释放人工智能的无限潜能</p>
        </motion.div>

        {/* 系统状态概览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">总请求数</p>
                  <p className="text-white text-2xl font-bold">{systemStats.totalRequests.toLocaleString()}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">成功率</p>
                  <p className="text-white text-2xl font-bold">{systemStats.successRate}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">平均响应时间</p>
                  <p className="text-white text-2xl font-bold">{systemStats.avgResponseTime}s</p>
                </div>
                <Activity className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">活跃模型</p>
                  <p className="text-white text-2xl font-bold">{systemStats.activeModels}</p>
                </div>
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧模型选择 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  AI模型选择
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiModels.map((model) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedModel === model.id
                        ? `bg-gradient-to-r ${model.color} border-white/50`
                        : "bg-white/5 border-white/20 hover:border-white/40"
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {model.icon}
                        <span className="text-white font-medium ml-2">{model.name}</span>
                      </div>
                      <Badge
                        variant={model.status === "online" ? "default" : "secondary"}
                        className={model.status === "online" ? "bg-green-500" : "bg-gray-500"}
                      >
                        {model.status === "online" ? "在线" : "离线"}
                      </Badge>
                    </div>
                    <p className="text-white/70 text-sm mb-3">{model.description}</p>
                    {model.status === "online" && (
                      <div>
                        <div className="flex justify-between text-sm text-white/70 mb-1">
                          <span>性能指标</span>
                          <span>{model.performance}%</span>
                        </div>
                        <Progress value={model.performance} className="h-2" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* 模型配置 */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-4">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  模型配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white/90 text-sm font-medium mb-2 block">温度参数</label>
                  <Input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    defaultValue="0.7"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-white/90 text-sm font-medium mb-2 block">最大令牌数</label>
                  <Input
                    type="number"
                    min="1"
                    max="4096"
                    defaultValue="2048"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                >
                  保存配置
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* 中间对话区域 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>AI对话测试</span>
                  <Badge variant="outline" className="border-white/30 text-white">
                    {aiModels.find((m) => m.id === selectedModel)?.name}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 输入区域 */}
                <div>
                  <label className="text-white/90 text-sm font-medium mb-2 block">输入您的问题</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="请输入您想要询问AI的问题..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!prompt.trim() || isProcessing}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-12"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      AI思考中...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      发送给AI
                    </>
                  )}
                </Button>

                {/* 响应区域 */}
                {(response || isProcessing) && (
                  <div className="mt-6">
                    <label className="text-white/90 text-sm font-medium mb-2 block">AI回答</label>
                    <div className="bg-black/30 rounded-lg p-4 min-h-[200px]">
                      {isProcessing ? (
                        <div className="flex items-center justify-center h-32 text-white/70">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mr-3"></div>
                          <span>AI正在分析您的问题...</span>
                        </div>
                      ) : (
                        <pre className="text-white/90 whitespace-pre-wrap font-sans">{response}</pre>
                      )}
                    </div>
                  </div>
                )}

                {/* 快速测试按钮 */}
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                    onClick={() => setPrompt("请介绍一下人工智能的发展历史")}
                  >
                    🤖 AI历史
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                    onClick={() => setPrompt("如何学习编程？")}
                  >
                    💻 编程学习
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                    onClick={() => setPrompt("写一首关于春天的诗")}
                  >
                    🌸 创意写作
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                    onClick={() => setPrompt("解释量子计算的基本原理")}
                  >
                    🔬 科学解释
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 底部性能监控 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">实时性能监控</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiModels
                  .filter((m) => m.status === "online")
                  .map((model) => (
                    <div key={model.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/90 font-medium">{model.name}</span>
                        <Badge variant="outline" className="border-white/30 text-white/70">
                          {model.performance}%
                        </Badge>
                      </div>
                      <Progress value={model.performance} className="h-2" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/70">延迟</span>
                          <div className="text-white font-medium">{Math.random() * 2 + 0.5}s</div>
                        </div>
                        <div>
                          <span className="text-white/70">吞吐量</span>
                          <div className="text-white font-medium">{Math.floor(Math.random() * 100 + 50)}/s</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
