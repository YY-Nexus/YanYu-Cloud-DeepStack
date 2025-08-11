// API服务函数 - 客户端调用 - 扩展版本

interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  code?: string
  retryAfter?: number
}

// 添加请求中断控制器
let weatherController: AbortController | null = null
let newsController: AbortController | null = null
let ipController: AbortController | null = null
let currencyController: AbortController | null = null
let stockController: AbortController | null = null
let geocodeController: AbortController | null = null
let translateController: AbortController | null = null
let qrcodeController: AbortController | null = null

// 客户端重试配置
const CLIENT_RETRY_CONFIG = {
  maxRetries: 2,
  initialDelay: 500,
  shouldRetry: (status: number) => [408, 429, 500, 502, 503, 504].includes(status),
}

/**
 * 带重试功能的API请求函数
 */
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  signal: AbortSignal,
  retryConfig = CLIENT_RETRY_CONFIG,
): Promise<T> {
  let retries = 0

  while (true) {
    try {
      const response = await fetch(url, {
        ...options,
        signal,
      })

      // 如果是429状态码，获取Retry-After头
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After")
        const waitTime = retryAfter ? Number.parseInt(retryAfter, 10) * 1000 : retryConfig.initialDelay

        if (retries < retryConfig.maxRetries) {
          retries++
          console.log(`请求限流，${waitTime}ms后重试 (${retries}/${retryConfig.maxRetries})...`)
          await new Promise((resolve) => setTimeout(resolve, waitTime))
          continue
        }
      }

      // 检查其他需要重试的状态码
      if (retryConfig.shouldRetry(response.status) && retries < retryConfig.maxRetries) {
        retries++
        const delay = retryConfig.initialDelay * Math.pow(2, retries - 1)
        console.log(`请求失败(${response.status})，${delay}ms后重试 (${retries}/${retryConfig.maxRetries})...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      // 解析JSON响应
      const result = await response.json()

      if (response.ok) {
        return result as T
      } else {
        throw {
          status: response.status,
          ...result,
        }
      }
    } catch (error) {
      // 如果是中断错误或已达到最大重试次数，直接抛出
      if ((error instanceof DOMException && error.name === "AbortError") || retries >= retryConfig.maxRetries) {
        throw error
      }

      // 其他错误尝试重试
      retries++
      const delay = retryConfig.initialDelay * Math.pow(2, retries - 1)
      console.log(`请求异常，${delay}ms后重试 (${retries}/${retryConfig.maxRetries})...`, error)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

// 天气查询服务
export async function fetchWeather(city: string): Promise<APIResponse<string>> {
  try {
    // 取消之前的请求
    if (weatherController) {
      weatherController.abort()
    }

    // 创建新的控制器
    weatherController = new AbortController()

    // 输入验证
    if (!city || city.trim().length === 0) {
      return { success: false, error: "请输入有效的城市名称", code: "INVALID_INPUT" }
    }

    // 城市名称长度验证
    if (city.trim().length > 50) {
      return { success: false, error: "城市名称过长，请输入有效的城市名称", code: "INVALID_INPUT" }
    }

    const result = await fetchWithRetry<{ data?: string; error?: string; code?: string; demo?: boolean }>(
      "/api/weather",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: city.trim() }),
      },
      weatherController.signal,
    )

    return { success: true, data: result.data, demo: result.demo }
  } catch (error: any) {
    // 检查是否是中断错误
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "请求已取消", code: "REQUEST_ABORTED" }
    }

    console.error("Weather fetch error:", error)

    // 处理限流错误
    if (error.status === 429) {
      return {
        success: false,
        error: "请求过于频繁，请稍后重试",
        code: "RATE_LIMITED",
        retryAfter: error.retryAfter || 60,
      }
    }

    // 网络错误处理
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return { success: false, error: "网络连接失败，请检查网络连接", code: "NETWORK_ERROR" }
    }

    // 处理API返回的错误
    if (error.error && error.code) {
      return {
        success: false,
        error: error.error,
        code: error.code,
      }
    }

    return { success: false, error: "网络连接错误，请稍后重试", code: "UNKNOWN_ERROR" }
  } finally {
    // 清理控制器
    weatherController = null
  }
}

// 新闻查询服务
export async function fetchNews(category: string): Promise<APIResponse<string>> {
  try {
    // 取消之前的请求
    if (newsController) {
      newsController.abort()
    }

    // 创建新的控制器
    newsController = new AbortController()

    const result = await fetchWithRetry<{ data?: string; error?: string; code?: string; demo?: boolean }>(
      "/api/news",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      },
      newsController.signal,
    )

    return { success: true, data: result.data, demo: result.demo }
  } catch (error: any) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "请求已取消", code: "REQUEST_ABORTED" }
    }

    if (error.status === 429) {
      return {
        success: false,
        error: "请求过于频繁，请稍后重试",
        code: "RATE_LIMITED",
        retryAfter: error.retryAfter || 60,
      }
    }

    return { success: false, error: "网络连接错误", code: "NETWORK_ERROR" }
  } finally {
    newsController = null
  }
}

// IP查询服务
export async function fetchIPInfo(ip: string): Promise<APIResponse<string>> {
  try {
    // 取消之前的请求
    if (ipController) {
      ipController.abort()
    }

    // 创建新的控制器
    ipController = new AbortController()

    const result = await fetchWithRetry<{ data?: string; error?: string; code?: string; demo?: boolean }>(
      "/api/ipinfo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ip }),
      },
      ipController.signal,
    )

    return { success: true, data: result.data, demo: result.demo }
  } catch (error: any) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "请求已取消", code: "REQUEST_ABORTED" }
    }

    if (error.status === 429) {
      return {
        success: false,
        error: "请求过于频繁，请稍后重试",
        code: "RATE_LIMITED",
        retryAfter: error.retryAfter || 60,
      }
    }

    return { success: false, error: "网络连接错误", code: "NETWORK_ERROR" }
  } finally {
    ipController = null
  }
}

// 汇率转换服务
export async function fetchCurrency(from: string, to: string, amount: number): Promise<APIResponse<string>> {
  try {
    // 取消之前的请求
    if (currencyController) {
      currencyController.abort()
    }

    // 创建新的控制器
    currencyController = new AbortController()

    const result = await fetchWithRetry<{ data?: string; error?: string; code?: string; demo?: boolean }>(
      "/api/currency",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, to, amount }),
      },
      currencyController.signal,
    )

    return { success: true, data: result.data, demo: result.demo }
  } catch (error: any) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "请求已取消", code: "REQUEST_ABORTED" }
    }

    if (error.status === 429) {
      return {
        success: false,
        error: "请求过于频繁，请稍后重试",
        code: "RATE_LIMITED",
        retryAfter: error.retryAfter || 60,
      }
    }

    return { success: false, error: "网络连接错误", code: "NETWORK_ERROR" }
  } finally {
    currencyController = null
  }
}

// 股票查询服务
export async function fetchStock(symbol: string): Promise<APIResponse<string>> {
  try {
    // 取消之前的请求
    if (stockController) {
      stockController.abort()
    }

    // 创建新的控制器
    stockController = new AbortController()

    // 输入验证
    if (!symbol || symbol.trim().length === 0) {
      return { success: false, error: "请输入有效的股票代码", code: "INVALID_INPUT" }
    }

    const result = await fetchWithRetry<{ data?: string; error?: string; code?: string; demo?: boolean }>(
      "/api/stock",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symbol: symbol.trim() }),
      },
      stockController.signal,
    )

    return { success: true, data: result.data, demo: result.demo }
  } catch (error: any) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "请求已取消", code: "REQUEST_ABORTED" }
    }

    if (error.status === 429) {
      return {
        success: false,
        error: "请求过于频繁，请稍后重试",
        code: "RATE_LIMITED",
        retryAfter: error.retryAfter || 60,
      }
    }

    return { success: false, error: "网络连接错误", code: "NETWORK_ERROR" }
  } finally {
    stockController = null
  }
}

// 地理编码服务
export async function fetchGeocode(address: string): Promise<APIResponse<string>> {
  try {
    // 取消之前的请求
    if (geocodeController) {
      geocodeController.abort()
    }

    // 创建新的控制器
    geocodeController = new AbortController()

    // 输入验证
    if (!address || address.trim().length === 0) {
      return { success: false, error: "请输入有效的地址", code: "INVALID_INPUT" }
    }

    const result = await fetchWithRetry<{ data?: string; error?: string; code?: string; demo?: boolean }>(
      "/api/geocode",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: address.trim() }),
      },
      geocodeController.signal,
    )

    return { success: true, data: result.data, demo: result.demo }
  } catch (error: any) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "请求已取消", code: "REQUEST_ABORTED" }
    }

    if (error.status === 429) {
      return {
        success: false,
        error: "请求过于频繁，请稍后重试",
        code: "RATE_LIMITED",
        retryAfter: error.retryAfter || 60,
      }
    }

    return { success: false, error: "网络连接错误", code: "NETWORK_ERROR" }
  } finally {
    geocodeController = null
  }
}

// 翻译服务
export async function fetchTranslation(
  text: string,
  sourceLang = "自动检测",
  targetLang = "英文",
): Promise<APIResponse<string>> {
  try {
    // 取消之前的请求
    if (translateController) {
      translateController.abort()
    }

    // 创建新的控制器
    translateController = new AbortController()

    // 输入验证
    if (!text || text.trim().length === 0) {
      return { success: false, error: "请输入要翻译的文本", code: "INVALID_INPUT" }
    }

    const result = await fetchWithRetry<{ data?: string; error?: string; code?: string; demo?: boolean }>(
      "/api/translate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
          sourceLang,
          targetLang,
        }),
      },
      translateController.signal,
    )

    return { success: true, data: result.data, demo: result.demo }
  } catch (error: any) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "请求已取消", code: "REQUEST_ABORTED" }
    }

    if (error.status === 429) {
      return {
        success: false,
        error: "请求过于频繁，请稍后重试",
        code: "RATE_LIMITED",
        retryAfter: error.retryAfter || 60,
      }
    }

    return { success: false, error: "网络连接错误", code: "NETWORK_ERROR" }
  } finally {
    translateController = null
  }
}

// 二维码生成服务
export async function generateQRCode(
  content: string,
  options: {
    format?: "svg" | "png" | "data-url"
    errorCorrectionLevel?: "L" | "M" | "Q" | "H"
    color?: string
    backgroundColor?: string
    margin?: number
    width?: number
  } = {},
): Promise<APIResponse<{ data: string; format: string; content: string; timestamp: string }>> {
  try {
    // 取消之前的请求
    if (qrcodeController) {
      qrcodeController.abort()
    }

    // 创建新的控制器
    qrcodeController = new AbortController()

    // 输入验证
    if (!content || content.trim().length === 0) {
      return { success: false, error: "请输入二维码内容", code: "INVALID_INPUT" }
    }

    const result = await fetchWithRetry<{
      data: string
      format: string
      content: string
      timestamp: string
      error?: string
      code?: string
    }>(
      "/api/qrcode",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          ...options,
        }),
      },
      qrcodeController.signal,
    )

    return { success: true, data: result }
  } catch (error: any) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "请求已取消", code: "REQUEST_ABORTED" }
    }

    if (error.status === 429) {
      return {
        success: false,
        error: "请求过于频繁，请稍后重试",
        code: "RATE_LIMITED",
        retryAfter: error.retryAfter || 60,
      }
    }

    return { success: false, error: "网络连接错误", code: "NETWORK_ERROR" }
  } finally {
    qrcodeController = null
  }
}

// 清理所有请求的函数
export function cancelAllRequests() {
  if (weatherController) {
    weatherController.abort()
    weatherController = null
  }
  if (newsController) {
    newsController.abort()
    newsController = null
  }
  if (ipController) {
    ipController.abort()
    ipController = null
  }
  if (currencyController) {
    currencyController.abort()
    currencyController = null
  }
  if (stockController) {
    stockController.abort()
    stockController = null
  }
  if (geocodeController) {
    geocodeController.abort()
    geocodeController = null
  }
  if (translateController) {
    translateController.abort()
    translateController = null
  }
  if (qrcodeController) {
    qrcodeController.abort()
    qrcodeController = null
  }
}
