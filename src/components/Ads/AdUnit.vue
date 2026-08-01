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
  useAdSense()
  pushAd()
})
</script>

<template>
  <div :class="props.class" class="ad-unit-wrapper">
    <ins
      ref="insRef"
      class="adsbygoogle"
      style="display: block"
      v-bind="insAttrs"
    />
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
