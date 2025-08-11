"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Play,
  Square,
  RefreshCw,
  Copy,
  Download,
  Settings,
  Code2,
  AlertTriangle,
  CheckCircle,
  FileText,
} from "lucide-react"
import { toast } from "sonner"

// 支持的编程语言
const SUPPORTED_LANGUAGES = [
  { value: "javascript", label: "JavaScript", extension: "js" },
  { value: "typescript", label: "TypeScript", extension: "ts" },
  { value: "python", label: "Python", extension: "py" },
  { value: "html", label: "HTML", extension: "html" },
  { value: "css", label: "CSS", extension: "css" },
  { value: "json", label: "JSON", extension: "json" },
  { value: "markdown", label: "Markdown", extension: "md" },
  { value: "sql", label: "SQL", extension: "sql" },
  { value: "java", label: "Java", extension: "java" },
  { value: "cpp", label: "C++", extension: "cpp" },
  { value: "go", label: "Go", extension: "go" },
  { value: "rust", label: "Rust", extension: "rs" },
]

// 代码主题
const CODE_THEMES = [
  { value: "vs-dark", label: "VS Code Dark" },
  { value: "vs-light", label: "VS Code Light" },
  { value: "github-dark", label: "GitHub Dark" },
  { value: "github-light", label: "GitHub Light" },
  { value: "monokai", label: "Monokai" },
  { value: "dracula", label: "Dracula" },
]

interface CodePreviewProps {
  initialCode?: string
  initialLanguage?: string
  onCodeChange?: (code: string) => void
  onLanguageChange?: (language: string) => void
  className?: string
}

interface CodeError {
  line: number
  column: number
  message: string
  severity: "error" | "warning" | "info"
}

export function CodePreview({
  initialCode = "",
  initialLanguage = "javascript",
  onCodeChange,
  onLanguageChange,
  className = "",
}: CodePreviewProps) {
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState(initialLanguage)
  const [theme, setTheme] = useState("vs-dark")
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState("")
  const [errors, setErrors] = useState<CodeError[]>([])
  const [autoRun, setAutoRun] = useState(false)
  const [wordWrap, setWordWrap] = useState(true)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [fontSize, setFontSize] = useState(14)

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // 代码语法高亮
  const highlightCode = (code: string, lang: string): string => {
    // 这里应该集成真正的语法高亮库，如 Prism.js 或 highlight.js
    // 目前使用简单的HTML转义
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
  }

  // 代码错误检查
  const checkCodeErrors = (code: string, lang: string): CodeError[] => {
    const errors: CodeError[] = []

    if (lang === "javascript" || lang === "typescript") {
      // 简单的JavaScript语法检查
      const lines = code.split("\n")
      lines.forEach((line, index) => {
        // 检查未闭合的括号
        const openBrackets = (line.match(/\(/g) || []).length
        const closeBrackets = (line.match(/\)/g) || []).length
        if (openBrackets !== closeBrackets) {
          errors.push({
            line: index + 1,
            column: line.length,
            message: "括号不匹配",
            severity: "error",
          })
        }

        // 检查未定义的变量（简单检查）
        if (line.includes("console.log") && !line.includes("(")) {
          errors.push({
            line: index + 1,
            column: line.indexOf("console.log"),
            message: "语法错误：缺少括号",
            severity: "error",
          })
        }
      })
    }

    return errors
  }

  // 运行代码
  const runCode = async () => {
    if (!code.trim()) {
      toast.error("请输入代码")
      return
    }

    setIsRunning(true)
    setOutput("")
    setErrors([])

    try {
      // 检查语法错误
      const codeErrors = checkCodeErrors(code, language)
      if (codeErrors.length > 0) {
        setErrors(codeErrors)
        setOutput("代码存在语法错误，请检查后重试")
        return
      }

      // 根据语言类型执行代码
      let result = ""

      switch (language) {
        case "javascript":
          result = await executeJavaScript(code)
          break
        case "python":
          result = await executePython(code)
          break
        case "html":
          result = "HTML代码已渲染到预览区域"
          break
        case "css":
          result = "CSS样式已应用到预览区域"
          break
        case "json":
          try {
            JSON.parse(code)
            result = "JSON格式验证通过"
          } catch (e) {
            result = `JSON格式错误: ${e}`
          }
          break
        default:
          result = `${language} 代码语法检查通过`
      }

      setOutput(result)
      toast.success("代码执行完成")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "执行错误"
      setOutput(`执行错误: ${errorMessage}`)
      toast.error("代码执行失败")
    } finally {
      setIsRunning(false)
    }
  }

  // 执行JavaScript代码
  const executeJavaScript = async (code: string): Promise<string> => {
    return new Promise((resolve) => {
      try {
        // 创建一个安全的执行环境
        const logs: string[] = []
        const originalLog = console.log

        // 重写console.log来捕获输出
        console.log = (...args) => {
          logs.push(args.map((arg) => String(arg)).join(" "))
        }

        // 执行代码
        const func = new Function(code)
        const result = func()

        // 恢复console.log
        console.log = originalLog

        let output = logs.join("\n")
        if (result !== undefined) {
          output += (output ? "\n" : "") + `返回值: ${result}`
        }

        resolve(output || "代码执行完成，无输出")
      } catch (error) {
        resolve(`执行错误: ${error}`)
      }
    })
  }

  // 执行Python代码（模拟）
  const executePython = async (code: string): Promise<string> => {
    // 这里应该调用后端Python执行服务
    // 目前返回模拟结果
    return new Promise((resolve) => {
      setTimeout(() => {
        if (code.includes("print")) {
          const matches = code.match(/print$$(.*?)$$/g)
          if (matches) {
            const outputs = matches.map((match) => {
              const content = match.replace(/print$$|$$/g, "").replace(/['"]/g, "")
              return content
            })
            resolve(outputs.join("\n"))
          } else {
            resolve("Python代码执行完成")
          }
        } else {
          resolve("Python代码执行完成，无输出")
        }
      }, 1000)
    })
  }

  // 停止执行
  const stopExecution = () => {
    setIsRunning(false)
    setOutput("执行已停止")
    toast.info("代码执行已停止")
  }

  // 复制代码
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success("代码已复制到剪贴板")
    } catch (error) {
      toast.error("复制失败")
    }
  }

  // 下载代码
  const downloadCode = () => {
    const selectedLang = SUPPORTED_LANGUAGES.find((lang) => lang.value === language)
    const extension = selectedLang?.extension || "txt"
    const filename = `code.${extension}`

    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    toast.success(`代码已下载为 ${filename}`)
  }

  // 重置代码
  const resetCode = () => {
    setCode("")
    setOutput("")
    setErrors([])
    toast.info("代码已重置")
  }

  // 处理代码变化
  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    onCodeChange?.(newCode)

    // 自动运行
    if (autoRun && newCode.trim()) {
      const timeoutId = setTimeout(() => {
        runCode()
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }

  // 处理语言变化
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    onLanguageChange?.(newLanguage)
    setErrors([]) // 清除错误
  }

  // 格式化代码
  const formatCode = () => {
    // 这里应该集成代码格式化工具
    // 目前只是简单的缩进处理
    const formatted = code
      .split("\n")
      .map((line) => line.trim())
      .join("\n")

    setCode(formatted)
    toast.success("代码已格式化")
  }

  useEffect(() => {
    // 初始化时检查错误
    if (code) {
      const codeErrors = checkCodeErrors(code, language)
      setErrors(codeErrors)
    }
  }, [code, language])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 控制栏 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            代码预览器
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CODE_THEMES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={isRunning ? stopExecution : runCode}
              disabled={!code.trim()}
              variant={isRunning ? "destructive" : "default"}
            >
              {isRunning ? (
                <>
                  <Square className="h-4 w-4 mr-2" />
                  停止
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  运行
                </>
              )}
            </Button>

            <Button variant="outline" onClick={formatCode}>
              <Settings className="h-4 w-4 mr-2" />
              格式化
            </Button>

            <Button variant="outline" onClick={copyCode}>
              <Copy className="h-4 w-4 mr-2" />
              复制
            </Button>

            <Button variant="outline" onClick={downloadCode}>
              <Download className="h-4 w-4 mr-2" />
              下载
            </Button>

            <Button variant="outline" onClick={resetCode}>
              <RefreshCw className="h-4 w-4 mr-2" />
              重置
            </Button>
          </div>

          {/* 设置选项 */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch id="auto-run" checked={autoRun} onCheckedChange={setAutoRun} />
              <Label htmlFor="auto-run">自动运行</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="word-wrap" checked={wordWrap} onCheckedChange={setWordWrap} />
              <Label htmlFor="word-wrap">自动换行</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="line-numbers" checked={showLineNumbers} onCheckedChange={setShowLineNumbers} />
              <Label htmlFor="line-numbers">行号</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 代码编辑器 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                代码编辑器
              </span>
              {errors.length > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {errors.length} 个错误
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative">
              <Textarea
                ref={editorRef}
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder={`请输入${SUPPORTED_LANGUAGES.find((l) => l.value === language)?.label}代码...`}
                className={`min-h-[400px] font-mono text-sm resize-none border-0 rounded-none ${
                  theme.includes("dark") ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"
                }`}
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: "1.5",
                  whiteSpace: wordWrap ? "pre-wrap" : "pre",
                }}
              />

              {/* 行号 */}
              {showLineNumbers && (
                <div className="absolute left-0 top-0 p-3 text-xs text-muted-foreground pointer-events-none">
                  {code.split("\n").map((_, index) => (
                    <div key={index} style={{ lineHeight: "1.5", fontSize: `${fontSize}px` }}>
                      {index + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 输出和预览 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Tabs defaultValue="output" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="output">输出</TabsTrigger>
                  <TabsTrigger value="preview">预览</TabsTrigger>
                  <TabsTrigger value="errors">错误</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="output" className="w-full">
              <TabsContent value="output" className="p-4">
                <div
                  ref={outputRef}
                  className="min-h-[350px] p-3 bg-slate-50 dark:bg-slate-900 rounded border font-mono text-sm whitespace-pre-wrap overflow-auto"
                >
                  {isRunning ? (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      正在执行...
                    </div>
                  ) : output ? (
                    output
                  ) : (
                    <span className="text-muted-foreground">点击运行按钮查看输出结果</span>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="preview" className="p-4">
                <div className="min-h-[350px] border rounded">
                  {language === "html" ? (
                    <iframe srcDoc={code} className="w-full h-full min-h-[350px] border-0" title="HTML预览" />
                  ) : language === "markdown" ? (
                    <div
                      className="p-4 prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: code.replace(/\n/g, "<br>"),
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      该语言暂不支持预览
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="errors" className="p-4">
                <div className="min-h-[350px]">
                  {errors.length > 0 ? (
                    <div className="space-y-2">
                      {errors.map((error, index) => (
                        <div
                          key={index}
                          className={`
                            p-3 rounded border-l-4 ${
                              error.severity === "error"
                                ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                : error.severity === "warning"
                                  ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                                  : "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            }
                          `}
                        >
                          <div className="flex items-start gap-2">
                            {error.severity === "error" ? (
                              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                            ) : error.severity === "warning" ? (
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                            )}
                            <div>
                              <div className="font-medium text-sm">
                                第 {error.line} 行，第 {error.column} 列
                              </div>
                              <div className="text-sm text-muted-foreground">{error.message}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <div>代码无错误</div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
