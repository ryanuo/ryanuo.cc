<script setup lang="ts">
import { formatDateToMarDD } from '~/utils'

defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
})
const route = useRoute()
const isShowAIPost = computed(() => {
  if (route.path === '/zh/posts' || route.path === '/posts')
    return false
  return route.path?.indexOf('posts') !== -1
})

const base = 'https://ryanuo.cc'
const tweetUrl = computed(() => `https://x.com/intent/tweet?text=${encodeURIComponent(`Reading @ryan7co\'s ${base}${route.path}\n\nI think...`)}`)
</script>

<template>
  <ClientOnly v-if="typeof frontmatter.plum === 'boolean' ? frontmatter.plum : true">
    <Plum />
  </ClientOnly>
  <div v-if="frontmatter.title && !frontmatter.isHidenTitle" class="prose" m-auto mb-8>
    <h1 class="slide-enter-50 mb-0" :style="frontmatter.titleStyle">
      <span data-title>{{ frontmatter.display ?? frontmatter.title }}</span>
      <div v-if="frontmatter.date" class="mt-2 text-sm text-gray-500 font-400">
        {{ formatDateToMarDD(frontmatter.date, true) }}
      </div>
    </h1>
  </div>
  <article>
    <AIPostChat v-if="isShowAIPost" />
    <slot />
  </article>
  <div
    v-if="route.path.indexOf('posts') !== -1"
    class="prose slide-enter m-auto mb-8 mt-8 animate-delay-500 print:hidden"
  >
    <!-- <div class="w-full flex justify-end">
    </div> -->
    <template v-if="frontmatter.date">
      <span font-mono op50>> </span>
      <span op50>comment on </span>
      <span op25> / </span>
      <a :href="tweetUrl" target="_blank" op50>twitter</a>
    </template>
    <br>
    <span font-mono op50>> </span>
    <RouterLink
      :to="route.path.split('/').slice(0, -1).join('/') || '/'" class="font-mono op50 hover:op75"
      text="cd .."
    />
  </div>
</template>
