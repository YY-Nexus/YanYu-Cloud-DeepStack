import { useState, useEffect } from 'react'
import { isMobile } from '../lib/utils'

/**
 * 响应式判断移动设备的Hooks
 * 包含窗口大小变化监听
 */
export function useMobile() {
  const [mobile, setMobile] = useState(isMobile())

  useEffect(() => {
    const handleResize = () => {
      setMobile(isMobile())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return mobile
}
