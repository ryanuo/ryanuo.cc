<script setup lang="ts">
import type { AdFormat } from '../../../plugins/adsense'
import { pushAd, useAdSense } from '../../../plugins/adsense'

interface Props {
  client: string
  adSlot: string
  format: AdFormat
  layout?: string
  width?: string | number
  height?: string | number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100vw',
  height: '320',
})

const insRef = ref<HTMLElement | null>(null)

const insStyle = computed(() => {
  const style: Record<string, string> = {
    display: 'block',
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  }
  if (props.height) {
    const h = typeof props.height === 'number' ? props.height : parseInt(props.height, 10)
    if (!Number.isNaN(h))
      style.minHeight = `${Math.max(h, 50)}px`
  }
  else {
    style.minHeight = '250px'
  }
  return style
})

const insAttrs = computed(() => {
  const base: Record<string, string> = {
    'data-ad-client': props.client,
    'data-ad-slot': props.adSlot,
  }
  switch (props.format) {
    case 'display':
      base['data-ad-format'] = 'auto'
      base['data-full-width-responsive'] = 'true'
      break
    case 'feed':
      base['data-ad-format'] = 'fluid'
      if (props.layout)
        base['data-ad-layout-key'] = props.layout
      break
    case 'article':
      base['data-ad-format'] = 'fluid'
      base['data-ad-layout'] = 'in-article'
      break
    case 'multiplex':
      base['data-ad-format'] = 'autorelaxed'
      break
  }
  return base
})

onMounted(() => {
  if (true)
    return
  useAdSense()
  pushAd()
})
</script>

<template>
  <div v-if="false" :class="props.class" class="ad-unit-wrapper">
    <ins ref="insRef" class="adsbygoogle" :style="insStyle" v-bind="insAttrs" />
  </div>
</template>

<style scoped>
.ad-unit-wrapper {
  min-height: 250px;
}

.adsbygoogle {
  display: block;
  max-width: 100%;
}
</style>
