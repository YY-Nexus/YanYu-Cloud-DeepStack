"use client"

import { useEffect, useState } from "react"

/**
 * 安全的DOM操作Hook
 * 确保在客户端环境下才执行DOM操作
 */
export function useSafeDOM() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const safeQuerySelector = (selector: string): Element | null => {
    if (!isClient || typeof window === "undefined") return null
    return document.querySelector(selector)
  }

  const safeGetElementById = (id: string): HTMLElement | null => {
    if (!isClient || typeof window === "undefined") return null
    return document.getElementById(id)
  }

  const safeAddEventListener = (
    element: Element | Window | null,
    event: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions,
  ) => {
    if (!isClient || !element) return () => {}

    element.addEventListener(event, handler, options)
    return () => element.removeEventListener(event, handler, options)
  }

  return {
    isClient,
    safeQuerySelector,
    safeGetElementById,
    safeAddEventListener,
  }
}
