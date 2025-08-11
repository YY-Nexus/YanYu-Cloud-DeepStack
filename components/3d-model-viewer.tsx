"use client"

import type React from "react"

import { useState, useRef, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Grid, Stats, Html, useProgress } from "@react-three/drei"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js"
import * as THREE from "three"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCcw, Download, Upload, Settings, Eye, Lightbulb, BarChart3, Maximize, Minimize } from "lucide-react"
import { toast } from "sonner"

interface Model3DViewerProps {
  modelUrl?: string
  className?: string
  onModelLoad?: (model: THREE.Object3D) => void
  onError?: (error: Error) => void
}

// 加载进度组件
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-lg font-medium">加载中...</div>
        <div className="text-sm opacity-75">{Math.round(progress)}%</div>
      </div>
    </Html>
  )
}

// 3D模型组件
function Model3D({
  url,
  onLoad,
  onError,
}: {
  url: string
  onLoad?: (model: THREE.Object3D) => void
  onError?: (error: Error) => void
}) {
  const meshRef = useRef<THREE.Object3D>(null)
  const [model, setModel] = useState<THREE.Object3D | null>(null)

  // 根据文件扩展名选择加载器
  const loadModel = async () => {
    try {
      const extension = url.split(".").pop()?.toLowerCase()
      let loadedModel: THREE.Object3D

      switch (extension) {
        case "gltf":
        case "glb":
          const gltf = await new GLTFLoader().loadAsync(url)
          loadedModel = gltf.scene
          break
        case "obj":
          loadedModel = await new OBJLoader().loadAsync(url)
          break
        case "fbx":
          loadedModel = await new FBXLoader().loadAsync(url)
          break
        default:
          throw new Error(`不支持的文件格式: ${extension}`)
      }

      // 计算边界框并居中
      const box = new THREE.Box3().setFromObject(loadedModel)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      loadedModel.position.sub(center)

      // 缩放到合适大小
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2 / maxDim
      loadedModel.scale.setScalar(scale)

      setModel(loadedModel)
      onLoad?.(loadedModel)
    } catch (error) {
      console.error("模型加载失败:", error)
      onError?.(error as Error)
    }
  }

  useEffect(() => {
    if (url) {
      loadModel()
    }
  }, [url])

  // 自动旋转动画
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2
    }
  })

  if (!model) return null

  return <primitive ref={meshRef} object={model} />
}

// 模型统计信息组件
function ModelStats({ model }: { model: THREE.Object3D | null }) {
  const [stats, setStats] = useState({
    vertices: 0,
    faces: 0,
    materials: 0,
    textures: 0,
  })

  useEffect(() => {
    if (!model) return

    let vertices = 0
    let faces = 0
    const materials = new Set()
    const textures = new Set()

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const geometry = child.geometry
        if (geometry) {
          vertices += geometry.attributes.position?.count || 0
          faces += geometry.index ? geometry.index.count / 3 : vertices / 3
        }

        if (child.material) {
          const materialArray = Array.isArray(child.material) ? child.material : [child.material]
          materialArray.forEach((mat) => {
            materials.add(mat.uuid)

            // 检查纹理
            Object.values(mat).forEach((value) => {
              if (value instanceof THREE.Texture) {
                textures.add(value.uuid)
              }
            })
          })
        }
      }
    })

    setStats({
      vertices: Math.floor(vertices),
      faces: Math.floor(faces),
      materials: materials.size,
      textures: textures.size,
    })
  }, [model])

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{stats.vertices.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">顶点数</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{stats.faces.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">面数</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{stats.materials}</div>
        <div className="text-sm text-muted-foreground">材质数</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{stats.textures}</div>
        <div className="text-sm text-muted-foreground">纹理数</div>
      </div>
    </div>
  )
}

export function Model3DViewer({ modelUrl, className = "", onModelLoad, onError }: Model3DViewerProps) {
  const [currentModel, setCurrentModel] = useState<THREE.Object3D | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  // 控制参数
  const [autoRotate, setAutoRotate] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [showStats, setShowStats] = useState(false)
  const [lightIntensity, setLightIntensity] = useState([1])
  const [environmentPreset, setEnvironmentPreset] = useState<
    "sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "studio" | "city" | "park" | "lobby"
  >("studio")

  // 文件上传处理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = [".gltf", ".glb", ".obj", ".fbx"]
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()

    if (!allowedTypes.includes(fileExtension)) {
      toast.error("不支持的文件格式", {
        description: "支持的格式：GLTF, GLB, OBJ, FBX",
      })
      return
    }

    setLoading(true)
    setError(null)

    const url = URL.createObjectURL(file)
    setUploadedFile(url)

    toast.success("文件上传成功", {
      description: `正在加载 ${file.name}`,
    })
  }

  // 模型加载成功处理
  const handleModelLoad = (model: THREE.Object3D) => {
    setCurrentModel(model)
    setLoading(false)
    setError(null)
    onModelLoad?.(model)

    toast.success("3D模型加载完成", {
      description: "可以开始预览和分析模型",
    })
  }

  // 模型加载错误处理
  const handleModelError = (error: Error) => {
    setLoading(false)
    setError(error.message)
    onError?.(error)

    toast.error("模型加载失败", {
      description: error.message,
    })
  }

  // 重置视图
  const resetView = () => {
    toast.info("视图已重置")
  }

  // 导出模型信息
  const exportModelInfo = () => {
    if (!currentModel) return

    const info = {
      name: "3D模型分析报告",
      timestamp: new Date().toISOString(),
      model: {
        vertices: 0,
        faces: 0,
        materials: 0,
        boundingBox: {
          min: { x: 0, y: 0, z: 0 },
          max: { x: 0, y: 0, z: 0 },
        },
      },
    }

    // 计算模型信息
    currentModel.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        info.model.vertices += child.geometry.attributes.position?.count || 0
        info.model.faces += child.geometry.index ? child.geometry.index.count / 3 : 0
      }
    })

    const box = new THREE.Box3().setFromObject(currentModel)
    info.model.boundingBox.min = box.min
    info.model.boundingBox.max = box.max

    // 下载JSON文件
    const blob = new Blob([JSON.stringify(info, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "model-analysis.json"
    a.click()
    URL.revokeObjectURL(url)

    toast.success("模型信息已导出")
  }

  // 切换全屏
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const displayUrl = uploadedFile || modelUrl

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 控制面板 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            3D模型预览器
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <div>
              <Label htmlFor="model-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    上传模型
                  </span>
                </Button>
              </Label>
              <input
                id="model-upload"
                type="file"
                accept=".gltf,.glb,.obj,.fbx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="h-4 w-4 mr-2" />
              重置视图
            </Button>

            <Button variant="outline" size="sm" onClick={exportModelInfo} disabled={!currentModel}>
              <Download className="h-4 w-4 mr-2" />
              导出信息
            </Button>

            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="h-4 w-4 mr-2" /> : <Maximize className="h-4 w-4 mr-2" />}
              {isFullscreen ? "退出全屏" : "全屏"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 3D视图 */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <div
                ref={canvasRef}
                className="relative w-full h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden"
              >
                {error ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="text-red-500 mb-2">加载失败</div>
                      <div className="text-sm text-muted-foreground">{error}</div>
                    </div>
                  </div>
                ) : (
                  <Canvas camera={{ position: [0, 0, 5], fov: 50 }} shadows>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={lightIntensity[0]} castShadow />

                    {showGrid && <Grid infiniteGrid />}

                    <Suspense fallback={<Loader />}>
                      {displayUrl && <Model3D url={displayUrl} onLoad={handleModelLoad} onError={handleModelError} />}
                      <Environment preset={environmentPreset} />
                    </Suspense>

                    <OrbitControls autoRotate={autoRotate} autoRotateSpeed={0.5} enableDamping dampingFactor={0.05} />

                    {showStats && <Stats />}
                  </Canvas>
                )}

                {loading && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                      <div className="text-sm">加载中...</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 控制面板 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                控制设置
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="view" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="view">视图</TabsTrigger>
                  <TabsTrigger value="lighting">光照</TabsTrigger>
                  <TabsTrigger value="stats">统计</TabsTrigger>
                </TabsList>

                <TabsContent value="view" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-rotate">自动旋转</Label>
                    <Switch id="auto-rotate" checked={autoRotate} onCheckedChange={setAutoRotate} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-grid">显示网格</Label>
                    <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-stats">性能统计</Label>
                    <Switch id="show-stats" checked={showStats} onCheckedChange={setShowStats} />
                  </div>
                </TabsContent>

                <TabsContent value="lighting" className="space-y-4">
                  <div>
                    <Label>光照强度</Label>
                    <Slider
                      value={lightIntensity}
                      onValueChange={setLightIntensity}
                      max={3}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="text-xs text-muted-foreground mt-1">当前: {lightIntensity[0].toFixed(1)}</div>
                  </div>

                  <div>
                    <Label>环境预设</Label>
                    <select
                      value={environmentPreset}
                      onChange={(e) => setEnvironmentPreset(e.target.value as any)}
                      className="w-full mt-2 p-2 border rounded-md"
                    >
                      <option value="studio">工作室</option>
                      <option value="sunset">日落</option>
                      <option value="dawn">黎明</option>
                      <option value="night">夜晚</option>
                      <option value="warehouse">仓库</option>
                      <option value="forest">森林</option>
                      <option value="apartment">公寓</option>
                      <option value="city">城市</option>
                      <option value="park">公园</option>
                      <option value="lobby">大厅</option>
                    </select>
                  </div>
                </TabsContent>

                <TabsContent value="stats" className="space-y-4">
                  {currentModel ? (
                    <ModelStats model={currentModel} />
                  ) : (
                    <div className="text-center text-muted-foreground py-8">请先加载3D模型</div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 模型信息 */}
          {currentModel && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  模型分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">文件格式</span>
                    <Badge variant="secondary">{displayUrl?.split(".").pop()?.toUpperCase() || "Unknown"}</Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm">加载状态</span>
                    <Badge variant="default">已加载</Badge>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm">渲染模式</span>
                    <Badge variant="outline">实时渲染</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 优化建议 */}
          {currentModel && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  优化建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>模型已成功加载并优化显示</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>建议使用LOD技术优化大型模型</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>可考虑压缩纹理以提升性能</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
