// src/i18n/index.js
import { createI18n } from 'vue-i18n'
import { messages } from './locales'

const lang = useStorage('lang', 'zh-CN')
const i18n = createI18n({
  legacy: false,
  locale: lang.value, // 默认语言
  fallbackLocale: 'zh-CN', // 回退语言
  messages,
})

export default i18n

export const langIconMap: Record<string, string> = {
  'zh-CN': 'i-proicons-text-typography',
  'en-US': 'i-noto-v1-flag-for-flag-china',
}

export function handleLanguageSwitch(to: any, next: any): void {
  if (location.pathname.includes('en'))
    lang.value = 'en-US'
  else
    lang.value = 'zh-CN'

  next()
}
