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

interface ScriptOptions {
  id: string
  src: string
  async?: boolean
  defer?: boolean
  type?: string
  customElement?: string
}

export function loadScript(options: ScriptOptions) {
  if (typeof document === 'undefined')
    return

  const { id, src, async = true, defer = false, type, customElement } = options

  if (document.getElementById(id))
    return

  const script = document.createElement('script')
  script.id = id
  script.src = src
  script.async = async
  if (defer)
    script.defer = true
  if (type)
    script.type = type
  if (customElement)
    script.setAttribute('custom-element', customElement)

  document.head.appendChild(script)
}

export function useAmpAd() {
  loadScript({
    id: 'amp-ad-script',
    src: 'https://cdn.ampproject.org/v0/amp-ad-0.1.js',
    customElement: 'amp-ad',
  })
}

export function isAmpReady() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}
