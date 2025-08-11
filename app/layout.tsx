import type React from "react"
import { initRateLimiter } from "@/lib/rate-limiter"
import { initCacheManager } from "@/lib/cache-manager"

// 在服务器端初始化限流器和缓存管理器
if (typeof window === "undefined") {
  initRateLimiter()
  initCacheManager()
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}


import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
