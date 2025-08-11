"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Video, Upload, Scissors, Sparkles, Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { motion } from "framer-motion"

export default function VideoEditorPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState([0])
  const [volume, setVolume] = useState([80])
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null)

  const effects = [
    { id: "fade", name: "淡入淡出", icon: "🎭" },
    { id: "blur", name: "模糊效果", icon: "🌫️" },
    { id: "vintage", name: "复古滤镜", icon: "📸" },
    { id: "neon", name: "霓虹效果", icon: "🌈" },
    { id: "glitch", name: "故障艺术", icon: "⚡" },
    { id: "cinematic", name: "电影感", icon: "🎬" },
  ]

  const transitions = [
    { id: "cut", name: "直切", preview: "✂️" },
    { id: "fade", name: "淡化", preview: "🌅" },
    { id: "slide", name: "滑动", preview: "➡️" },
    { id: "zoom", name: "缩放", preview: "🔍" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">语枢视频</span>{" "}
            智能剪辑
          </h1>
          <p className="text-white/70">专业级视频编辑工具，让创作更简单</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧工具栏 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  编辑工具
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="effects" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/5">
                    <TabsTrigger value="effects" className="text-white">
                      特效
                    </TabsTrigger>
                    <TabsTrigger value="transitions" className="text-white">
                      转场
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="effects" className="space-y-2 mt-4">
                    {effects.map((effect) => (
                      <Button
                        key={effect.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                      >
                        <span className="mr-2">{effect.icon}</span>
                        {effect.name}
                      </Button>
                    ))}
                  </TabsContent>

                  <TabsContent value="transitions" className="space-y-2 mt-4">
                    {transitions.map((transition) => (
                      <Button
                        key={transition.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                      >
                        <span className="mr-2">{transition.preview}</span>
                        {transition.name}
                      </Button>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* 上传区域 */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-4">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  素材库
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                  <Upload className="w-4 h-4 mr-2" />
                  上传视频
                </Button>
                <div className="mt-4 space-y-2">
                  <div className="text-white/70 text-sm">支持格式：</div>
                  <div className="flex flex-wrap gap-1">
                    {["MP4", "AVI", "MOV", "MKV"].map((format) => (
                      <Badge key={format} variant="outline" className="border-white/30 text-white/70 text-xs">
                        {format}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 中间预览区域 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">预览窗口</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center mb-4">
                  {uploadedVideo ? (
                    <video className="w-full h-full rounded-lg" controls>
                      <source src={uploadedVideo} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="text-center text-white/50">
                      <Video className="w-16 h-16 mx-auto mb-4" />
                      <p>上传视频开始编辑</p>
                    </div>
                  )}
                </div>

                {/* 播放控制 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <Button size="sm" variant="outline" className="border-white/20 text-white bg-transparent">
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white bg-transparent">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* 时间轴 */}
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-white/70 text-sm">00:00</span>
                      <Slider
                        value={currentTime}
                        onValueChange={setCurrentTime}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-white/70 text-sm">02:30</span>
                    </div>
                  </div>

                  {/* 音量控制 */}
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-white/70" />
                    <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1" />
                    <span className="text-white/70 text-sm">{volume[0]}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 右侧属性面板 */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI助手
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  智能剪辑
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                >
                  🎵 自动配乐
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                >
                  🎙️ 智能配音
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                >
                  📝 自动字幕
                </Button>

                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-white/90 font-medium mb-2">快速操作</h4>
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                    >
                      <Scissors className="w-4 h-4 mr-2" />
                      分割片段
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                    >
                      🔄 旋转视频
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                    >
                      📏 调整尺寸
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 导出设置 */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-4">
              <CardHeader>
                <CardTitle className="text-white text-sm">导出设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-white/70 text-xs">分辨率</label>
                  <select className="w-full mt-1 bg-white/5 border border-white/20 rounded text-white text-sm p-2">
                    <option>1920x1080 (1080p)</option>
                    <option>1280x720 (720p)</option>
                    <option>3840x2160 (4K)</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/70 text-xs">格式</label>
                  <select className="w-full mt-1 bg-white/5 border border-white/20 rounded text-white text-sm p-2">
                    <option>MP4</option>
                    <option>AVI</option>
                    <option>MOV</option>
                  </select>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  开始导出
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 底部时间轴 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-sm">时间轴</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-black/30 rounded-lg flex items-center justify-center">
                <div className="text-white/50 text-sm">拖拽素材到此处开始编辑</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
