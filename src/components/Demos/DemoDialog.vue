<script setup lang="ts">
import type { Project } from './type'
import { useLanguage } from '~/hooks/useLanguage'
import { localizedText, TYPE_COLOR } from './type'

const props = defineProps<{
  options: {
    modelValue: boolean
    content?: Project | null
  }
}>()

const { isChinese } = useLanguage()

const project = computed(() => props.options.content ?? null)
const title = computed(() => localizedText(project.value?.name, isChinese.value))
const description = computed(() => localizedText(project.value?.description, isChinese.value))
</script>

<template>
  <ModalCard :options="options">
    <template v-if="project">
      <div class="space-y-4">
        <div
          v-if="project.image || project.video"
          class="overflow-hidden border border-neutral-200 rounded-lg dark:border-neutral-800"
        >
          <iframe v-if="project.video" :src="project.video" class="h-80 w-full md:h-125" />
          <img v-else :src="project.image!" :alt="title" class="w-full">
        </div>

        <div class="flex flex-wrap items-center gap-2 text-sm">
          <span
            class="inline-flex items-center rounded-md px-2 py-0.5 text-xs text-white"
            :class="TYPE_COLOR[project.type]"
          >
            {{ $t(`demos.type.${project.type}`) }}
          </span>
          <span class="text-neutral-500">{{ project.year }}</span>
          <span class="text-neutral-400">·</span>
          <a
            :href="`https://github.com/${project.repo}`" target="_blank" rel="noopener noreferrer"
            class="text-neutral-500 no-underline hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {{ project.repo }}
          </a>
        </div>

        <div class="space-y-1">
          <p class="text-lg font-medium">
            {{ title }}
          </p>
          <p class="text-sm text-neutral-500 leading-relaxed">
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

        <div class="flex flex-wrap gap-2 pt-2">
          <a
            v-if="project.demo" :href="project.demo" target="_blank" rel="noopener noreferrer"
            class="border border-neutral-900 rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white no-underline dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {{ $t('demos.openDemo') }} ↗
          </a>
          <a
            :href="project.source" target="_blank" rel="noopener noreferrer"
            class="border border-neutral-200 rounded-md px-3 py-1.5 text-sm text-neutral-700 no-underline dark:border-neutral-800 dark:text-neutral-300"
          >
            {{ $t('demos.source') }} ↗
          </a>
          <a
            v-if="project.readme" :href="project.readme" target="_blank" rel="noopener noreferrer"
            class="border border-neutral-200 rounded-md px-3 py-1.5 text-sm text-neutral-700 no-underline dark:border-neutral-800 dark:text-neutral-300"
          >
            README ↗
          </a>
        </div>
      </div>
    </template>
  </ModalCard>
</template>
