<script lang="ts" setup>
import { ModalsContainer, VueFinalModal } from 'vue-final-modal'
import { useLanguage } from '~/hooks/useLanguage'

const props = defineProps<{
  options: {
    modelValue: boolean
    teleportTo?: string
    displayDirective?: string
    hideOverlay?: boolean
    overlayTransition?: string
    contentTransition?: string
    clickToClose?: boolean
    escToClose?: boolean
    background?: string
    lockScroll?: boolean
    reserveScrollBarGap?: boolean
    swipeToClose?: string
    content?: { name?: { zh?: string, en?: string } | string } | null
  }
}>()

const { isChinese } = useLanguage()

const title = computed(() => {
  const name = props.options.content?.name
  if (!name)
    return ''
  if (typeof name === 'string')
    return name
  return isChinese.value ? name.zh : name.en
})

function close() {
  // eslint-disable-next-line vue/no-mutating-props -- options 是页面共享的响应式配置对象
  props.options.modelValue = false
}
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <VueFinalModal
    v-model="options.modelValue"
    :teleport-to="options.teleportTo"
    :display-directive="options.displayDirective"
    :hide-overlay="options.hideOverlay"
    :overlay-transition="options.overlayTransition"
    :content-transition="options.contentTransition"
    :click-to-close="options.clickToClose"
    :esc-to-close="options.escToClose"
    :background="options.background"
    :lock-scroll="options.lockScroll"
    :reserve-scroll-bar-gap="options.reserveScrollBarGap"
    :swipe-to-close="options.swipeToClose"
    class="flex items-center justify-center"
    content-class="mx-4 max-h-[90vh] w-full max-w-2xl overflow-auto border border-neutral-200 rounded-xl bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
  >
    <header class="mb-4 flex items-start justify-between gap-4">
      <h2 class="text-xl text-neutral-950 font-semibold dark:text-neutral-50">
        {{ title }}
      </h2>
      <button
        type="button"
        class="i-material-symbols-close-small-outline shrink-0 cursor-pointer text-neutral-500 hover:text-neutral-950 dark:hover:text-neutral-50"
        :aria-label="$t('demos.close')"
        @click="close"
      />
    </header>
    <slot />
  </VueFinalModal>

  <ModalsContainer />
</template>
