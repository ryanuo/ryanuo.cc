<script setup lang="ts">
import { useModalOptions } from '../hooks/useModalOptions'
import type { DemosTypes } from '../type'
import { openLinkInPopup } from '~/utils'

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
      <div v-for="demo in demoList" :key="demo.name" class="group relative mb-6 mt-4 text-gray-800 shadow-lg transition-all dark:shadow-gray-900 hover:shadow-2xl">
        <img
          :src="demo.img || '/demos/zhanweitu.png'"
          alt="Demo Image"
          class="relative w-full rounded-lg bg-clip-border object-cover text-white shadow-md"
        >
        <i
          class="group-item i-ri-fullsccreen-exit-fill absolute right-2 top-2 op-0 transition-all duration-[0.6s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[1.2]" @click="() => {
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
        <div
          class="p-4 pt-0 text-right text-xs hover:underline" @click="() => {
            openLinkInPopup(demo.readme || demo.link)
          }"
        >
          Read More
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

.group :hover .group-item {
  opacity: 1; /* 鼠标悬停时显示图标 */
}
</style>
