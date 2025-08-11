"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Stethoscope,
  Brain,
  Heart,
  Eye,
  Zap,
  FileText,
  Upload,
  Activity,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Microscope,
  Pill,
  Shield,
  ArrowRight,
} from "lucide-react"
import { motion } from "framer-motion"

export default function MedicalCenterPage() {
  const [activeTab, setActiveTab] = useState("diagnosis")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  // 模拟AI诊断分析
  const handleDiagnosis = useCallback(async () => {
    setIsAnalyzing(true)

    // 模拟分析过程
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setAnalysisResult({
      confidence: 94.5,
      diagnosis: "轻度高血压",
      recommendations: [
        "建议低盐饮食，每日钠摄入量控制在2000mg以下",
        "增加有氧运动，每周至少150分钟中等强度运动",
        "定期监测血压，建议每日早晚各测量一次",
        "保持充足睡眠，每日7-8小时",
        "减少压力，可尝试冥想或瑜伽",
      ],
      riskFactors: ["家族史", "生活方式", "年龄因素"],
      followUp: "建议4周后复查",
    })

    setIsAnalyzing(false)
  }, [])

  // 医疗功能模块
  const medicalModules = [
    {
      id: "ai-diagnosis",
      title: "AI智能诊断",
      description: "基于症状和检查结果的智能诊断分析",
      icon: <Brain className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500",
      stats: { accuracy: "98.5%", cases: "50K+" },
    },
    {
      id: "image-analysis",
      title: "医学影像分析",
      description: "X光、CT、MRI等医学影像的AI辅助分析",
      icon: <Eye className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500",
      stats: { accuracy: "96.8%", images: "100K+" },
    },
    {
      id: "health-monitor",
      title: "健康监测",
      description: "实时健康数据监测和异常预警",
      icon: <Activity className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500",
      stats: { users: "25K+", alerts: "99.2%" },
    },
    {
      id: "drug-interaction",
      title: "药物相互作用",
      description: "药物配伍禁忌和相互作用分析",
      icon: <Pill className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      stats: { drugs: "10K+", safety: "99.9%" },
    },
  ]

  // 最近诊断案例
  const recentCases = [
    {
      id: 1,
      patient: "患者A",
      condition: "糖尿病筛查",
      confidence: 96.2,
      status: "已确诊",
      time: "2小时前",
    },
    {
      id: 2,
      patient: "患者B",
      condition: "心律不齐",
      confidence: 89.7,
      status: "待复查",
      time: "4小时前",
    },
    {
      id: 3,
      patient: "患者C",
      condition: "肺部结节",
      confidence: 92.1,
      status: "已确诊",
      time: "6小时前",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Stethoscope className="w-12 h-12 text-emerald-400 mr-4" />
            <h1 className="text-4xl font-bold text-white">云枢医疗</h1>
          </div>
          <p className="text-xl text-emerald-200 mb-2">悬壶济世显仁心，智慧医疗护苍生</p>
          <p className="text-emerald-300">AI驱动的智能医疗健康平台</p>
        </motion.div>

        {/* 核心统计数据 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-emerald-200 text-sm">服务患者</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">98.5%</div>
              <div className="text-emerald-200 text-sm">诊断准确率</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-emerald-200 text-sm">健康监护</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <Microscope className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100K+</div>
              <div className="text-emerald-200 text-sm">影像分析</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 主要功能区域 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-md">
              <TabsTrigger value="diagnosis" className="text-white data-[state=active]:bg-emerald-500">
                智能诊断
              </TabsTrigger>
              <TabsTrigger value="imaging" className="text-white data-[state=active]:bg-emerald-500">
                影像分析
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="text-white data-[state=active]:bg-emerald-500">
                健康监测
              </TabsTrigger>
              <TabsTrigger value="research" className="text-white data-[state=active]:bg-emerald-500">
                医学研究
              </TabsTrigger>
            </TabsList>

            {/* 智能诊断标签页 */}
            <TabsContent value="diagnosis" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 诊断输入区 */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-emerald-400" />
                      AI智能诊断
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-emerald-200 text-sm mb-2 block">症状描述</label>
                      <textarea
                        className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-emerald-400"
                        rows={4}
                        placeholder="请详细描述患者症状、病史和检查结果..."
                      />
                    </div>

                    <div>
                      <label className="text-emerald-200 text-sm mb-2 block">上传检查报告</label>
                      <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <p className="text-white/70 text-sm">点击上传或拖拽文件至此</p>
                        <p className="text-white/50 text-xs mt-1">支持 PDF, JPG, PNG 格式</p>
                      </div>
                    </div>

                    <Button
                      onClick={handleDiagnosis}
                      disabled={isAnalyzing}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          AI分析中...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          开始AI诊断
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* 诊断结果区 */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-emerald-400" />
                      诊断结果
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysisResult ? (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        {/* 诊断结果 */}
                        <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold">初步诊断</h3>
                            <Badge className="bg-emerald-500 text-white">置信度: {analysisResult.confidence}%</Badge>
                          </div>
                          <p className="text-emerald-200 text-lg">{analysisResult.diagnosis}</p>
                        </div>

                        {/* 建议措施 */}
                        <div>
                          <h4 className="text-white font-semibold mb-2 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
                            治疗建议
                          </h4>
                          <ul className="space-y-2">
                            {analysisResult.recommendations.map((rec: string, index: number) => (
                              <li key={index} className="text-emerald-200 text-sm flex items-start">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* 风险因素 */}
                        <div>
                          <h4 className="text-white font-semibold mb-2 flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
                            风险因素
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.riskFactors.map((factor: string, index: number) => (
                              <Badge key={index} variant="outline" className="border-yellow-400 text-yellow-400">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* 随访建议 */}
                        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
                          <div className="flex items-center text-blue-200">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="text-sm">{analysisResult.followUp}</span>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center py-8">
                        <Stethoscope className="w-12 h-12 text-emerald-400/50 mx-auto mb-4" />
                        <p className="text-white/70">请输入症状信息并开始AI诊断</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 最近诊断案例 */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 mt-6">
                <CardHeader>
                  <CardTitle className="text-white">最近诊断案例</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentCases.map((case_item) => (
                      <div key={case_item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-white font-medium">{case_item.patient}</div>
                            <div className="text-emerald-200 text-sm">{case_item.condition}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className={case_item.status === "已确诊" ? "bg-green-500" : "bg-yellow-500"}>
                              {case_item.status}
                            </Badge>
                            <span className="text-emerald-200 text-sm">{case_item.confidence}%</span>
                          </div>
                          <div className="text-emerald-300 text-xs">{case_item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 其他标签页内容 */}
            <TabsContent value="imaging" className="mt-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-8 text-center">
                  <Eye className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">医学影像分析</h3>
                  <p className="text-emerald-200">AI驱动的医学影像智能分析系统</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring" className="mt-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-8 text-center">
                  <Activity className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">健康监测</h3>
                  <p className="text-emerald-200">24/7实时健康数据监测和预警系统</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="research" className="mt-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-8 text-center">
                  <Microscope className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">医学研究</h3>
                  <p className="text-emerald-200">基于大数据的医学研究和药物发现平台</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* 医疗功能模块展示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">核心医疗功能</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {medicalModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card
                  className={`bg-gradient-to-br ${module.color} border-0 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">{module.icon}</div>
                      <div className="text-right">
                        {Object.entries(module.stats).map(([key, value]) => (
                          <div key={key} className="text-white/90 text-xs">
                            {key}: {value}
                          </div>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-white font-bold text-lg mb-2">{module.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{module.description}</p>

                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex items-center justify-center text-white/90 text-sm font-medium">
                        <span>点击了解更多</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
