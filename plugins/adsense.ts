import { ADS_CONFIG } from '~/components/Ads/config'

export type AdFormat = 'display' | 'feed' | 'article' | 'multiplex'

export interface AdUnitConfig {
  type: string
  client: string
  slot: string
  format?: AdFormat
  layout?: string
  width?: string | number
  height?: string | number
}

export function loadScript(options: { id: string, src: string, async?: boolean }) {
  if (typeof document === 'undefined')
    return

  const { id, src, async = true } = options

  if (document.getElementById(id))
    return

  const script = document.createElement('script')
  script.id = id
  script.src = src
  script.async = async
  document.head.appendChild(script)
}

export function useAdSense() {
  loadScript({
    id: 'adsbygoogle-script',
    src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.client}`,
  })
}

export function isAmpReady() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function pushAd() {
  try {
    ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
    ;(window as any).adsbygoogle.push({})
  }
  catch (e) {
    console.error('AdSense push error:', e)
  }
}
