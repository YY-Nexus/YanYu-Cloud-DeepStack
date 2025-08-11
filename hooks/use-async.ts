"use client"

import { useState, useEffect, useCallback } from "react"

// 异步状态类型
export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

// 异步Hook
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = [],
): AsyncState<T> & { refetch: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const data = await asyncFunction()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error })
    }
  }, dependencies)

  useEffect(() => {
    execute()
  }, [execute])

  const refetch = useCallback(() => {
    execute()
  }, [execute])

  return { ...state, refetch }
}

// 异步回调Hook
export function useAsyncCallback<T extends any[], R>(
  asyncFunction: (...args: T) => Promise<R>,
): [(...args: T) => Promise<void>, AsyncState<R>] {
  const [state, setState] = useState<AsyncState<R>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (...args: T) => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const data = await asyncFunction(...args)
        setState({ data, loading: false, error: null })
      } catch (error) {
        setState({ data: null, loading: false, error: error as Error })
      }
    },
    [asyncFunction],
  )

  return [execute, state]
}
