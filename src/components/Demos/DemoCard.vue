<script setup lang="ts">
import type { Project } from './type'
import { useLanguage } from '~/hooks/useLanguage'
import { localizedText, TYPE_COLOR } from './type'

const props = defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  more: [project: Project]
}>()

const { isChinese } = useLanguage()
const imageBroken = ref(false)

const title = computed(() => localizedText(props.project.name, isChinese.value))
const description = computed(() => localizedText(props.project.description, isChinese.value))
const showImage = computed(() => Boolean(props.project.image) && !imageBroken.value)

// 无截图时按 id 生成稳定的色相，渲染色块占位而不是裂图
const hue = computed(() => {
  let value = 0
  for (const char of props.project.id)
    value = (value * 31 + char.charCodeAt(0)) % 360
  return value
})

watch(() => props.project.image, () => {
  imageBroken.value = false
})
</script>

<template>
  <article
    class="flex flex-col overflow-hidden border border-neutral-200 rounded-xl dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
  >
    <div class="relative aspect-[16/10] overflow-hidden border-b border-neutral-200 dark:border-neutral-800">
      <img
        v-if="showImage" :src="project.image!" :alt="title" loading="lazy" decoding="async"
        class="h-full w-full object-cover object-top" @error="imageBroken = true"
      >
      <div
        v-else class="demo-cover-fallback h-full w-full flex flex-col items-center justify-center gap-2"
        :style="{ '--h': hue }"
      >
        <span class="demo-cover-initial text-4xl font-semibold tracking-tight">{{ project.id.charAt(0).toUpperCase()
        }}</span>
        <span class="px-4 text-center text-xs text-neutral-500">{{ title }}</span>
      </div>

      <span
        class="absolute bottom-2 left-2 inline-flex items-center rounded-md px-2 py-0.5 text-xs text-white shadow-sm"
        :class="TYPE_COLOR[project.type]"
      >
        {{ $t(`demos.type.${project.type}`) }}
      </span>
      <span class="absolute bottom-2 right-2 rounded-md bg-black/50 px-1.5 py-0.5 text-xs text-white">
        {{ project.year }}
      </span>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="space-y-1">
        <h3 class="text-base text-neutral-900 font-medium leading-snug dark:text-neutral-100">
          {{ title }}
        </h3>
        <p class="line-clamp-2 text-sm text-neutral-500 leading-relaxed">
          {{ description }}
        </p>
      </div>

      <div v-if="project.tags.length" class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in project.tags" :key="tag"
          class="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400"
        >
          {{ tag }}
        </span>
      </div>

      <div class="mt-auto flex items-center gap-3 border-t border-neutral-100 pt-3 text-sm dark:border-neutral-900">
        <a
          v-if="project.demo" :href="project.demo" target="_blank" rel="noopener noreferrer"
          class="text-neutral-900 font-medium no-underline dark:text-neutral-100 hover:underline"
        >
          {{ $t('demos.demo') }} →
        </a>
        <a
          :href="project.source" target="_blank" rel="noopener noreferrer"
          class="text-neutral-500 no-underline hover:text-neutral-900 hover:underline dark:hover:text-neutral-100"
        >
          {{ $t('demos.source') }} ↗
        </a>
        <button
          type="button"
          class="ml-auto cursor-pointer border-0 bg-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          @click="emit('more', project)"
        >
          {{ $t('demos.more') }}
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.demo-cover-fallback {
  background: hsl(var(--h) 30% 96%);
}

.demo-cover-initial {
  color: hsl(var(--h) 35% 42%);
}

html.dark .demo-cover-fallback {
  background: hsl(var(--h) 16% 13%);
}

html.dark .demo-cover-initial {
  color: hsl(var(--h) 40% 68%);
}
</style>
