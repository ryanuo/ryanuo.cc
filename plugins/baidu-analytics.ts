import type { Router } from 'vue-router'

declare global {
  interface Window {
    _hmt?: any[]
  }
}

export function useBaiduAnalytics(router: Router, baiduId: string) {
  if (typeof window === 'undefined')
    return

  // 避免重复注入
  if (!document.getElementById('baidu-analytics')) {
    const hm = document.createElement('script')
    hm.id = 'baidu-analytics'
    hm.src = `https://hm.baidu.com/hm.js?${baiduId}`
    document.head.appendChild(hm)
  }

  // 路由切换上报
  router.afterEach((to) => {
    if (window._hmt) {
      window._hmt.push(['_trackPageview', to.fullPath])
    }
  })
}
