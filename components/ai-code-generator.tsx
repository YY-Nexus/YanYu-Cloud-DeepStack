"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Code2, Copy, Download, Save, Star, Zap, Settings, History, FileCode, Sparkles } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"

// AI模型配置
const AI_MODELS = [
  {
    id: "llama3",
    name: "Llama 3",
    description: "强大的开源大语言模型",
    icon: "🦙",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "qwen2",
    name: "Qwen 2",
    description: "阿里云通义千问模型",
    icon: "🧠",
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "codellama",
    name: "CodeLlama",
    description: "专业代码生成模型",
    icon: "💻",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "gpt4",
    name: "GPT-4",
    description: "OpenAI最新模型",
    icon: "🤖",
    color: "from-orange-500 to-red-500",
  },
]

// 编程语言配置
const PROGRAMMING_LANGUAGES = [
  { id: "python", name: "Python", icon: "🐍", ext: "py" },
  { id: "javascript", name: "JavaScript", icon: "🟨", ext: "js" },
  { id: "typescript", name: "TypeScript", icon: "🔷", ext: "ts" },
  { id: "java", name: "Java", icon: "☕", ext: "java" },
  { id: "cpp", name: "C++", icon: "⚡", ext: "cpp" },
  { id: "go", name: "Go", icon: "🐹", ext: "go" },
  { id: "rust", name: "Rust", icon: "🦀", ext: "rs" },
  { id: "php", name: "PHP", icon: "🐘", ext: "php" },
]

// 代码模板
const CODE_TEMPLATES = [
  {
    id: "web-app",
    name: "Web应用",
    description: "React + Node.js全栈应用",
    prompt: "创建一个包含用户认证的React待办事项应用，使用Node.js后端和MongoDB数据库",
  },
  {
    id: "api",
    name: "REST API",
    description: "RESTful API服务",
    prompt: "创建一个用户管理的REST API，包含CRUD操作和JWT认证",
  },
  {
    id: "algorithm",
    name: "算法实现",
    description: "数据结构与算法",
    prompt: "实现快速排序算法，包含详细注释和时间复杂度分析",
  },
  {
    id: "ml",
    name: "机器学习",
    description: "AI模型训练代码",
    prompt: "创建一个图像分类的CNN模型，使用TensorFlow/PyTorch",
  },
]

// 历史记录类型
interface HistoryItem {
  id: string
  prompt: string
  model: string
  language: string
  code: string
  score: number
  timestamp: Date
}

interface AICodeGeneratorProps {
  className?: string
}

export function AICodeGenerator({ className }: AICodeGeneratorProps) {
  const { toast } = useToast()
  const [prompt, setPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState("llama3")
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [codeScore, setCodeScore] = useState<number | null>(null)
  const [history, setHistory] = useLocalStorage<HistoryItem[]>("code-generation-history", [])

  const codeRef = useRef<HTMLPreElement>(null)

  // 生成代码
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "请输入需求描述",
        description: "请描述您想要生成的代码功能",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setGeneratedCode("")
    setCodeScore(null)

    try {
      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 20
        })
      }, 200)

      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 3000))

      clearInterval(progressInterval)
      setGenerationProgress(100)

      // 模拟生成的代码
      const mockCode = generateMockCode(prompt, selectedLanguage)
      setGeneratedCode(mockCode)

      // 模拟代码评分
      const score = Math.floor(Math.random() * 30) + 70 // 70-100分
      setCodeScore(score)

      // 保存到历史记录
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        prompt,
        model: selectedModel,
        language: selectedLanguage,
        code: mockCode,
        score,
        timestamp: new Date(),
      }
      setHistory((prev) => [historyItem, ...prev.slice(0, 9)]) // 保留最近10条

      toast({
        title: "代码生成成功",
        description: `使用${AI_MODELS.find((m) => m.id === selectedModel)?.name}生成了${PROGRAMMING_LANGUAGES.find((l) => l.id === selectedLanguage)?.name}代码`,
      })
    } catch (error) {
      toast({
        title: "生成失败",
        description: "代码生成过程中出现错误，请重试",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  // 生成模拟代码
  const generateMockCode = (prompt: string, language: string): string => {
    const templates: Record<string, string> = {
      python: `# ${prompt}
# 生成的Python代码

def main():
    """
    根据您的需求生成的Python代码
    """
    print("Hello, World!")
    
    # 这里是根据您的描述生成的具体实现
    result = process_data()
    return result

def process_data():
    """
    数据处理函数
    """
    data = []
    for i in range(10):
        data.append(i * 2)
    return data

if __name__ == "__main__":
    main()`,

      javascript: `// ${prompt}
// 生成的JavaScript代码

function main() {
    console.log("Hello, World!");
    
    // 根据您的描述生成的具体实现
    const result = processData();
    return result;
}

function processData() {
    const data = [];
    for (let i = 0; i < 10; i++) {
        data.push(i * 2);
    }
    return data;
}

main();`,

      typescript: `// ${prompt}
// 生成的TypeScript代码

interface DataItem {
    id: number;
    value: number;
}

function main(): DataItem[] {
    console.log("Hello, World!");
    
    // 根据您的描述生成的具体实现
    const result = processData();
    return result;
}

function processData(): DataItem[] {
    const data: DataItem[] = [];
    for (let i = 0; i < 10; i++) {
        data.push({ id: i, value: i * 2 });
    }
    return data;
}

main();`,

      java: `// ${prompt}
// 生成的Java代码

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        // 根据您的描述生成的具体实现
        int[] result = processData();
        System.out.println("处理完成");
    }
    
    public static int[] processData() {
        int[] data = new int[10];
        for (int i = 0; i < 10; i++) {
            data[i] = i * 2;
        }
        return data;
    }
}`,

      cpp: `// ${prompt}
// 生成的C++代码

#include <iostream>
#include <vector>

std::vector<int> processData() {
    std::vector<int> data;
    for (int i = 0; i < 10; i++) {
        data.push_back(i * 2);
    }
    return data;
}

int main() {
    std::cout << "Hello, World!" << std::endl;
    
    // 根据您的描述生成的具体实现
    auto result = processData();
    std::cout << "处理完成" << std::endl;
    
    return 0;
}`,

      go: `// ${prompt}
// 生成的Go代码

package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
    
    // 根据您的描述生成的具体实现
    result := processData()
    fmt.Printf("处理了 %d 个数据项\\n", len(result))
}

func processData() []int {
    data := make([]int, 10)
    for i := 0; i < 10; i++ {
        data[i] = i * 2
    }
    return data
}`,
    }

    return templates[language] || templates.python
  }

  // 复制代码
  const handleCopy = async () => {
    if (!generatedCode) return

    try {
      await navigator.clipboard.writeText(generatedCode)
      toast({
        title: "复制成功",
        description: "代码已复制到剪贴板",
      })
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      })
    }
  }

  // 下载代码
  const handleDownload = () => {
    if (!generatedCode) return

    const language = PROGRAMMING_LANGUAGES.find((l) => l.id === selectedLanguage)
    const filename = `generated_code.${language?.ext || "txt"}`
    const blob = new Blob([generatedCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "下载成功",
      description: `代码已保存为 ${filename}`,
    })
  }

  // 保存代码
  const handleSave = () => {
    if (!generatedCode) return

    // 这里可以实现保存到服务器的逻辑
    toast({
      title: "保存成功",
      description: "代码已保存到您的项目中",
    })
  }

  // 使用模板
  const handleUseTemplate = (template: (typeof CODE_TEMPLATES)[0]) => {
    setPrompt(template.prompt)
  }

  // 使用历史记录
  const handleUseHistory = (item: HistoryItem) => {
    setPrompt(item.prompt)
    setSelectedModel(item.model)
    setSelectedLanguage(item.language)
    setGeneratedCode(item.code)
    setCodeScore(item.score)
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧控制面板 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 需求输入 */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                需求描述
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="描述您想要生成的代码功能，例如：实现一个用户登录系统、创建一个数据可视化图表..."
                className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[120px] resize-none"
                disabled={isGenerating}
              />

              {/* 快速模板 */}
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">快速模板</label>
                <div className="grid grid-cols-2 gap-2">
                  {CODE_TEMPLATES.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleUseTemplate(template)}
                      className="h-auto p-2 border-white/20 text-white/90 hover:bg-white/10 bg-transparent text-left"
                      disabled={isGenerating}
                    >
                      <div>
                        <div className="font-medium text-xs">{template.name}</div>
                        <div className="text-xs text-white/60">{template.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 模型和语言选择 */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                生成配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI模型选择 */}
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">AI模型</label>
                <Select value={selectedModel} onValueChange={setSelectedModel} disabled={isGenerating}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center gap-2">
                          <span>{model.icon}</span>
                          <div>
                            <div className="font-medium">{model.name}</div>
                            <div className="text-xs text-muted-foreground">{model.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 编程语言选择 */}
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">编程语言</label>
                <div className="grid grid-cols-2 gap-2">
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <Button
                      key={lang.id}
                      variant={selectedLanguage === lang.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`h-12 ${
                        selectedLanguage === lang.id
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : "border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                      }`}
                      disabled={isGenerating}
                    >
                      <span className="text-lg mr-2">{lang.icon}</span>
                      <span className="text-xs">{lang.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* 生成按钮 */}
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white h-12"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    生成中...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    生成代码
                  </>
                )}
              </Button>

              {/* 生成进度 */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/70">
                    <span>生成进度</span>
                    <span>{Math.round(generationProgress)}%</span>
                  </div>
                  <Progress value={generationProgress} className="bg-white/10" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* 历史记录 */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <History className="w-5 h-5 mr-2" />
                历史记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-white/50 text-sm text-center py-4">暂无历史记录</p>
                ) : (
                  history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => handleUseHistory(item)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="border-white/30 text-white/70 text-xs">
                          {PROGRAMMING_LANGUAGES.find((l) => l.id === item.language)?.name}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-white/70">{item.score}</span>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm line-clamp-2">{item.prompt}</p>
                      <p className="text-white/50 text-xs mt-1">{new Date(item.timestamp).toLocaleString()}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧代码展示区 */}
        <div className="lg:col-span-2">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <FileCode className="w-5 h-5 mr-2" />
                  生成的代码
                  {codeScore && (
                    <Badge className="ml-2 bg-gradient-to-r from-green-500 to-emerald-500">质量评分: {codeScore}</Badge>
                  )}
                </CardTitle>

                {generatedCode && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      className="border-white/20 text-white bg-transparent hover:bg-white/10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownload}
                      className="border-white/20 text-white bg-transparent hover:bg-white/10"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSave}
                      className="border-white/20 text-white bg-transparent hover:bg-white/10"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="h-full">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-96 text-white/70">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full mb-4"
                  />
                  <p className="text-lg mb-2">AI正在为您生成代码...</p>
                  <p className="text-sm">分析需求并编写最优解决方案</p>
                </div>
              ) : generatedCode ? (
                <Tabs defaultValue="code" className="h-full">
                  <TabsList className="bg-white/10 border-white/20">
                    <TabsTrigger value="code" className="text-white">
                      代码
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="text-white">
                      预览
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="text-white">
                      分析
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="code" className="h-full mt-4">
                    <div className="bg-black/50 rounded-lg p-4 h-full overflow-auto">
                      <pre ref={codeRef} className="text-green-400 text-sm whitespace-pre-wrap font-mono">
                        {generatedCode}
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="mt-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">运行结果</h4>
                      <div className="bg-black/50 rounded p-3 font-mono text-sm">
                        <div className="text-green-400">$ 运行代码...</div>
                        <div className="text-white mt-1">Hello, World!</div>
                        <div className="text-green-400 mt-1">✓ 代码执行成功</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analysis" className="mt-4">
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">代码质量分析</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-white/70">可读性</span>
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              优秀
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">性能</span>
                            <Badge variant="outline" className="border-blue-500 text-blue-400">
                              良好
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">安全性</span>
                            <Badge variant="outline" className="border-green-500 text-green-400">
                              优秀
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">优化建议</h4>
                        <ul className="text-white/70 text-sm space-y-1">
                          <li>• 代码结构清晰，符合最佳实践</li>
                          <li>• 建议添加更多错误处理机制</li>
                          <li>• 可以考虑添加单元测试</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-white/50">
                  <Code2 className="w-16 h-16 mb-4" />
                  <p className="text-lg mb-2">准备开始编码</p>
                  <p className="text-sm text-center">
                    在左侧描述您的需求，选择AI模型和编程语言
                    <br />
                    AI将为您生成高质量的代码
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
