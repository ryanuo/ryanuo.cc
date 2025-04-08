import { useI18n } from 'vue-i18n'
import { langIconMap } from '~/i18n'

export function useLanguage() {
  const { locale } = useI18n()
  const routes = useRoute()
  const router = useRouter()

  const isChinese = ref(routes.path.includes('/zh'))

  const aliaRoute = computed(() => (isChinese.value ? '/zh' : ''))
  const langIcon = computed(() => {
    return langIconMap[isChinese.value ? 'en-US' : 'zh-CN']
  })

  // Watch route changes and update isChinese accordingly
  watch(
    () => routes.path,
    (newPath) => {
      const val = newPath.includes('/zh')
      isChinese.value = val
      locale.value = val ? 'zh-CN' : 'en-US'
    },
    { immediate: true },
  )

  const switchLanguage = () => {
    const { path } = routes
    const to = isChinese.value ? path.replace('/zh', '') : `/zh${path}`
    router.push(to)
  }

  return {
    isChinese,
    locale,
    switchLanguage,
    langIcon,
    aliaRoute,
  }
}
