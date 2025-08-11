"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Wand2, Download, Share2, Settings, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function TextToImagePage() {
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState("realistic")
  const [imageSize, setImageSize] = useState("1024x1024")
  const [steps, setSteps] = useState([20])
  const [cfgScale, setCfgScale] = useState([7])

  const styles = [
    { id: "realistic", name: "写实风格", preview: "🎨" },
    { id: "anime", name: "动漫风格", preview: "🎭" },
    { id: "oil-painting", name: "油画风格", preview: "🖼️" },
    { id: "watercolor", name: "水彩风格", preview: "🎨" },
    { id: "sketch", name: "素描风格", preview: "✏️" },
    { id: "cyberpunk", name: "赛博朋克", preview: "🌆" },
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    // 模拟图片生成
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // 模拟生成的图片
    const mockImages = [
      "/abstract-geometric-shapes.png",
      "/abstract-geometric-shapes.png",
      "/abstract-geometric-shapes.png",
      "/abstract-geometric-shapes.png",
    ]

    setGeneratedImages(mockImages)
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">言创图文</span>{" "}
            文生图
          </h1>
          <p className="text-white/70">通过文字描述生成精美图片，释放您的创意想象</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧控制面板 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Wand2 className="w-5 h-5 mr-2" />
                  创作参数
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 提示词输入 */}
                <div>
                  <label className="text-white/90 text-sm font-medium mb-2 block">描述提示词</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="描述您想要生成的图片，例如：一只可爱的小猫坐在花园里，阳光明媚，高清摄影..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                  />
                </div>

                {/* 负面提示词 */}
                <div>
                  <label className="text-white/90 text-sm font-medium mb-2 block">负面提示词（可选）</label>
                  <Textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="描述您不想要的元素，例如：模糊、低质量、变形..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                {/* 风格选择 */}
                <div>
                  <label className="text-white/90 text-sm font-medium mb-2 block">艺术风格</label>
                  <div className="grid grid-cols-2 gap-2">
                    {styles.map((style) => (
                      <Button
                        key={style.id}
                        variant={selectedStyle === style.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedStyle(style.id)}
                        className={`h-12 ${
                          selectedStyle === style.id
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                            : "border-white/20 text-white/90 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-lg mr-2">{style.preview}</span>
                        <span className="text-xs">{style.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 图片尺寸 */}
                <div>
                  <label className="text-white/90 text-sm font-medium mb-2 block">图片尺寸</label>
                  <Select value={imageSize} onValueChange={setImageSize}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512x512">512×512 (正方形)</SelectItem>
                      <SelectItem value="768x512">768×512 (横向)</SelectItem>
                      <SelectItem value="512x768">512×768 (纵向)</SelectItem>
                      <SelectItem value="1024x1024">1024×1024 (高清正方形)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 高级参数 */}
                <div className="space-y-4">
                  <div>
                    <label className="text-white/90 text-sm font-medium mb-2 block">生成步数: {steps[0]}</label>
                    <Slider value={steps} onValueChange={setSteps} max={50} min={10} step={1} className="w-full" />
                  </div>

                  <div>
                    <label className="text-white/90 text-sm font-medium mb-2 block">引导强度: {cfgScale[0]}</label>
                    <Slider
                      value={cfgScale}
                      onValueChange={setCfgScale}
                      max={20}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* 生成按钮 */}
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white h-12"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      开始创作
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* 右侧结果展示 */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>生成结果</span>
                  {generatedImages.length > 0 && (
                    <Badge variant="outline" className="border-white/30 text-white">
                      {generatedImages.length} 张图片
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-96 text-white/70">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mb-4"></div>
                    <p>AI正在为您创作精美图片...</p>
                    <p className="text-sm mt-2">预计需要 30-60 秒</p>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {generatedImages.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Generated image ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                          <Button size="sm" variant="outline" className="text-white border-white/30 bg-transparent">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-white border-white/30 bg-transparent">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-white border-white/30 bg-transparent">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-white/50">
                    <Wand2 className="w-16 h-16 mb-4" />
                    <p className="text-lg mb-2">等待您的创意描述</p>
                    <p className="text-sm">在左侧输入提示词，开始AI图片创作之旅</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
