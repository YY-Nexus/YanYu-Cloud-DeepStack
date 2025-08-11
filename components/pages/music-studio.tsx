"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Mic, Headphones, Download } from "lucide-react"
import { motion } from "framer-motion"

export default function MusicStudioPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [tempo, setTempo] = useState([120])
  const [volume, setVolume] = useState([80])

  const genres = [
    { id: "pop", name: "流行", emoji: "🎵", color: "from-pink-500 to-rose-500" },
    { id: "rock", name: "摇滚", emoji: "🎸", color: "from-red-500 to-orange-500" },
    { id: "jazz", name: "爵士", emoji: "🎷", color: "from-yellow-500 to-amber-500" },
    { id: "classical", name: "古典", emoji: "🎼", color: "from-blue-500 to-indigo-500" },
    { id: "electronic", name: "电子", emoji: "🎛️", color: "from-purple-500 to-violet-500" },
    { id: "ambient", name: "氛围", emoji: "🌙", color: "from-teal-500 to-cyan-500" },
  ]

  const instruments = [
    { id: "piano", name: "钢琴", icon: "🎹" },
    { id: "guitar", name: "吉他", icon: "🎸" },
    { id: "drums", name: "鼓组", icon: "🥁" },
    { id: "violin", name: "小提琴", icon: "🎻" },
    { id: "bass", name: "贝斯", icon: "🎸" },
    { id: "synth", name: "合成器", icon: "🎛️" },
  ]

  const generatedTracks = [
    { id: 1, name: "梦幻旋律", genre: "ambient", duration: "3:24", bpm: 85 },
    { id: 2, name: "节拍律动", genre: "electronic", duration: "4:12", bpm: 128 },
    { id: 3, name: "温柔时光", genre: "pop", duration: "3:45", bpm: 95 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              YYC³ Music
            </span>{" "}
            音乐工作室
          </h1>
          <p className="text-white/70">AI驱动的音乐创作平台，释放您的音乐天赋</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧创作面板 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  AI作曲
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 风格选择 */}
                <div>
                  <label className="text-white/90 text-sm font-medium mb-3 block">音乐风格</label>
                  <div className="grid grid-cols-2 gap-2">
                    {genres.map((genre) => (
                      <Button
                        key={genre.id}
                        variant="outline"
                        size="sm"
                        className={`h-16 border-white/20 text-white/90 hover:bg-gradient-to-r hover:${genre.color} hover:text-white transition-all`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{genre.emoji}</div>
                          <div className="text-xs">{genre.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 乐器选择 */}
                <div>
                  <label className="text-white/90 text-sm font-medium mb-3 block">主要乐器</label>
                  <div className="space-y-2">
                    {instruments.map((instrument) => (
                      <Button
                        key={instrument.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                      >
                        <span className="mr-2">{instrument.icon}</span>
                        {instrument.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 参数调节 */}
                <div className="space-y-4">
                  <div>
                    <label className="text-white/90 text-sm font-medium mb-2 block">节拍 (BPM): {tempo[0]}</label>
                    <Slider value={tempo} onValueChange={setTempo} max={200} min={60} step={1} className="w-full" />
                  </div>

                  <div>
                    <label className="text-white/90 text-sm font-medium mb-2 block">音量: {volume[0]}%</label>
                    <Slider value={volume} onValueChange={setVolume} max={100} min={0} step={1} className="w-full" />
                  </div>
                </div>

                {/* 生成按钮 */}
                <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white h-12">
                  <Music className="w-4 h-4 mr-2" />
                  生成音乐
                </Button>
              </CardContent>
            </Card>

            {/* 录音面板 */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-4">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mic className="w-5 h-5 mr-2" />
                  录音工具
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  开始录音
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                >
                  <Headphones className="w-4 h-4 mr-2" />
                  监听模式
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* 中间播放器 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">音乐播放器</CardTitle>
              </CardHeader>
              <CardContent>
                {/* 专辑封面区域 */}
                <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center text-white/50">
                    <Music className="w-16 h-16 mx-auto mb-4" />
                    <p>选择音乐开始播放</p>
                  </div>
                </div>

                {/* 播放控制 */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-white font-medium">当前播放</h3>
                    <p className="text-white/70 text-sm">{currentTrack || "未选择音乐"}</p>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <Button size="sm" variant="outline" className="border-white/20 text-white bg-transparent">
                      <SkipBack className="w-4 h-4" />
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full w-12 h-12"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white bg-transparent">
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* 进度条 */}
                  <div className="space-y-2">
                    <Slider value={[30]} max={100} step={1} className="w-full" />
                    <div className="flex justify-between text-white/70 text-xs">
                      <span>1:23</span>
                      <span>3:45</span>
                    </div>
                  </div>

                  {/* 音量控制 */}
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-white/70" />
                    <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 右侧音乐库 */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>我的音乐</span>
                  <Badge variant="outline" className="border-white/30 text-white">
                    {generatedTracks.length} 首
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {generatedTracks.map((track) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => setCurrentTrack(track.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{track.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="border-white/30 text-white/70 text-xs">
                              {track.genre}
                            </Badge>
                            <span className="text-white/50 text-xs">{track.duration}</span>
                            <span className="text-white/50 text-xs">{track.bpm} BPM</span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                            <Play className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4 border-white/20 text-white/90 hover:bg-white/10 bg-transparent"
                >
                  查看更多
                </Button>
              </CardContent>
            </Card>

            {/* 音效库 */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-4">
              <CardHeader>
                <CardTitle className="text-white text-sm">音效库</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {["鼓点", "贝斯", "和弦", "旋律", "氛围", "打击"].map((effect) => (
                    <Button
                      key={effect}
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white/90 hover:bg-white/10 text-xs bg-transparent"
                    >
                      {effect}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
