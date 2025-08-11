"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Code, Play, Download, Copy, Settings, Zap, Terminal, FileCode } from "lucide-react"
import { motion } from "framer-motion"

export default function CodeStudioPage() {
  const [prompt, setPrompt] = useState("")
  const [language, setLanguage] = useState("python")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const languages = [
    { id: "python", name: "Python", icon: "🐍", color: "from-green-500 to-emerald-500" },
    { id: "javascript", name: "JavaScript", icon: "🟨", color: "from-yellow-500 to-amber-500" },
    { id: "typescript", name: "TypeScript", icon: "🔷", color: "from-blue-500 to-indigo-500" },
    { id: "java", name: "Java", icon: "☕", color: "from-orange-500 to-red-500" },
    { id: "cpp", name: "C++", icon: "⚡", color: "from-purple-500 to-violet-500" },
    { id: "go", name: "Go", icon: "🐹", color: "from-cyan-500 to-teal-500" },
  ]

  const templates = [
    { id: "web-app", name: "Web应用", desc: "React + Node.js全栈应用" },
    { id: "api", name: "API接口", desc: "RESTful API服务" },
    { id: "algorithm", name: "算法实现", desc: "数据结构与算法" },
    { id: "ml", name: "机器学习", desc: "AI模型训练代码" },
    { id: "automation", name: "自动化脚本", desc: "任务自动化工具" },
    { id: "game", name: "游戏开发", desc: "简单游戏逻辑" },
  ]

  const codeExamples = [
    {
      id: 1,
      title: "快速排序算法",
      language: "python",
      code: `def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`,
      description: "高效的排序算法实现",
    },
    {
      id: 2,
      title: "React组件",
      language: "javascript",
      code: `function TodoList({ todos, onToggle }) {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id} onClick={() => onToggle(todo.id)}>
          <span className={todo.completed ? 'completed' : ''}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}`,
      description: "可复用的待办事项组件",
    },
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    // 模拟代码生成
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockCode = `# ${prompt}
# 生成的${languages.find((l) => l.id === language)?.name}代码

def main():
    """
    根据您的需求生成的代码
    """
    print("Hello, World!")
    # 这里是根据您的描述生成的具体实现
    
if __name__ == "__main__":
    main()`

    setGeneratedCode(mockCode)
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              YYC³ CodeX
            </span>{" "}
            代码工作室
          </h1>
          <p className="text-white/70">AI驱动的智能编程助手，让编码更高效</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧控制面板 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  代码生成
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 需求描述 */}
                <div>
                  <label className="text-white/90 text-sm font-medium mb-2 block">需求描述</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="描述您想要实现的功能，例如：实现一个计算器、创建一个待办事项应用..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                  />
                </div>

                {/* 编程语言选择 */}
                <div>
                  <label className="text-white/90 text-sm font-medium mb-2 block">编程语言</label>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <Button
                        key={lang.id}
                        variant={language === lang.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLanguage(lang.id)}
                        className={`h-12 ${
                          language === lang.id
                            ? `bg-gradient-to-r ${lang.color} text-white`
                            : "border-white/20 text-white/90 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-lg mr-2">{lang.icon}</span>
                        <span className="text-xs">{lang.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 模板选择 */}
                <div>
                  <label className="text-white/90 text-sm font-medium mb-2 block">项目模板</label>
                  <div className="space-y-2">
                    {templates.map((template) => (
                      <Button
                        key={template.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-white/20 text-white/90 hover:bg-white/10 h-auto p-3 bg-transparent"
                        onClick={() => setPrompt(template.desc)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{template.name}</div>
                          <div className="text-xs text-white/60">{template.desc}</div>
                        </div>
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
              </CardContent>
            </Card>

            {/* 工具面板 */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-4">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Terminal className="w-5 h-5 mr-2" />
                  开发工具
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/90 hover:bg-white/10 justify-start bg-transparent"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  代码优化
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/90 hover:bg-white/10 justify-start bg-transparent"
                >
                  <FileCode className="w-4 h-4 mr-2" />
                  代码审查
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/90 hover:bg-white/10 justify-start bg-transparent"
                >
                  🐛 调试助手
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/90 hover:bg-white/10 justify-start bg-transparent"
                >
                  📝 添加注释
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* 中间代码编辑器 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>代码编辑器</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-white/20 text-white bg-transparent">
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white bg-transparent">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white bg-transparent">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-96 text-white/70">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mb-4"></div>
                    <p>AI正在为您生成代码...</p>
                    <p className="text-sm mt-2">分析需求并编写最优解决方案</p>
                  </div>
                ) : generatedCode ? (
                  <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                    <pre className="text-green-400 whitespace-pre-wrap overflow-x-auto">{generatedCode}</pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-white/50">
                    <Code className="w-16 h-16 mb-4" />
                    <p className="text-lg mb-2">准备开始编码</p>
                    <p className="text-sm">在左侧描述您的需求，AI将为您生成代码</p>
                  </div>
                )}

                {/* 代码执行结果 */}
                {generatedCode && (
                  <div className="mt-4 p-4 bg-black/30 rounded-lg">
                    <h4 className="text-white/90 font-medium mb-2">执行结果</h4>
                    <div className="text-green-400 font-mono text-sm">
                      Hello, World!
                      <br />
                      代码执行成功 ✓
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 底部代码示例 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">代码示例</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {codeExamples.map((example) => (
                  <motion.div
                    key={example.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setGeneratedCode(example.code)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{example.title}</h4>
                      <Badge variant="outline" className="border-white/30 text-white/70">
                        {example.language}
                      </Badge>
                    </div>
                    <p className="text-white/60 text-sm mb-3">{example.description}</p>
                    <div className="bg-black/50 rounded p-2 font-mono text-xs text-green-400 overflow-x-auto">
                      <pre>{example.code.substring(0, 100)}...</pre>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
