<script setup lang="ts">
import { useModalOptions } from '../hooks/useModalOptions'
import type { DemosTypes } from '../type'
import { linkBlank } from '~/utils'

defineProps<{ demos: {
  [key: number]: DemosTypes[]
} }>()
const { options } = useModalOptions()
</script>

<template>
  <div class="masonry-container">
    <article
      v-for="([, demoList], key) in Object.entries(demos)?.sort((a, b) => Number(b[0]) - Number(a[0]))"
      :key="key"
      class="masonry-item relative m-2 flex flex-col cursor-pointer rounded-lg bg-clip-border"
    >
      <div v-for="demo in demoList" :key="demo.name" class="group/item relative mb-6 mt-4 text-gray-800 shadow-lg">
        <img
          :src="demo.img || '/demos/zhanweitu.png'"
          alt="Demo Image"
          class="relative w-full rounded-lg bg-clip-border object-cover text-white shadow-md"
        >
        <i
          class="i-ri-fullscreen-exit-fill absolute right-2 top-6 op-0 transition-all duration-[0.6s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[1.2] group-hover/item:op-100" @click="() => {
            options.modelValue = true;
            options.content = demo;
          }
          "
        />
        <div class="p-4">
          <h5
            class="mb-3 text-lg text-gray-900 font-bold leading-tight tracking-wide dark:text-gray-100"
          >
            {{ demo.name }}
          </h5>
          <p
            class="text-sm text-gray-600 font-light leading-relaxed dark:text-gray-400"
          >
            {{ demo.desc }}
          </p>
        </div>
        <div class="p-4 pt-0">
          <button
            data-ripple-light="true"
            type="button"
            class="select-none rounded-md from-gray-100 to-gray-300 bg-gradient-to-r px-5 py-2 text-center text-sm text-gray-800 font-medium uppercase shadow-md transition-all dark:from-gray-700 hover:from-gray-200 dark:to-gray-900 hover:to-gray-400 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-800 dark:focus:ring-gray-600"
            @click="() => {
              linkBlank(demo.readme || demo.link)
            }"
          >
            Read More
          </button>
        </div>
      </div>
    </article>
  </div>
  <ModalCard :options="options" />
</template>

<style scoped>
.masonry-container {
  column-count: 3; /* 瀑布流列数 */
  column-gap: 1rem; /* 列间距 */
}

.masonry-item {
  break-inside: avoid; /* 防止元素被拆分到不同列 */
}

.dark .masonry-item {
  background-color: #1f2937; /* 暗黑模式背景色 */
}
</style>
