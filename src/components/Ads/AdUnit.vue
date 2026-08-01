<script setup lang="ts">
import type { AdFormat } from '../../../plugins/amp-ad'
import { useId } from 'vue'
import { useAmpAd } from '../../../plugins/amp-ad'

interface Props {
  client: string
  adSlot: string
  format: AdFormat
  layout?: string
  width?: string | number
  height?: string | number
  type?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'adsense',
  width: '100vw',
  height: '320',
})

const id = useId()

const formatAttrs = computed(() => {
  switch (props.format) {
    case 'display':
      return {
        'data-ad-format': 'auto',
        'data-full-width-responsive': 'true',
      }
    case 'feed':
      return {
        'data-ad-format': 'fluid',
        ...(props.layout ? { 'data-ad-layout-key': props.layout } : {}),
      }
    case 'article':
      return {
        'data-ad-format': 'fluid',
        'data-ad-layout': 'in-article',
      }
    case 'multiplex':
      return {
        'data-ad-format': 'autorelaxed',
      }
    default:
      return {}
  }
})

onMounted(() => {
  useAmpAd()
})
</script>

<template>
  <ClientOnly>
    <div :class="props.class" class="ad-unit-wrapper">
      <amp-ad
        :id="id"
        :type="type"
        :width="String(width)"
        :height="String(height)"
        :data-ad-client="client"
        :data-ad-slot="adSlot"
        v-bind="formatAttrs"
      />
    </div>
  </ClientOnly>
</template>

<style scoped>
.ad-unit-wrapper {
  min-height: 250px;
}

amp-ad {
  display: block;
  max-width: 100%;
}
</style>
