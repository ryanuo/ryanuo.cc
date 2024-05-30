<script setup lang="ts">
interface Project {
  desc: string
  name: string
  link: string
  icon: string
  image: string
  tags: string[]
}

const props = defineProps<{
  project: Project
}>()
const errorImage
  = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiNjY2NjY2MiIGQ9Ik0yMiAyMC43TDMuMyAyTDIgMy4zbDEgMVYxOWMwIDEuMS45IDIgMiAyaDE0LjdsMSAxek01IDE5VjYuM2w3LjYgNy42bC0xLjUgMS45TDkgMTMuMUw2IDE3aDkuN2wyIDJ6TTguOCA1bC0yLTJIMTljMS4xIDAgMiAuOSAyIDJ2MTIuMmwtMi0yVjV6Ii8+PC9zdmc+'
const loadingImage
  = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NjY2NjYyIgc3Ryb2tlLWRhc2hhcnJheT0iMTUiIHN0cm9rZS1kYXNob2Zmc2V0PSIxNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0xMiAzQzE2Ljk3MDYgMyAyMSA3LjAyOTQ0IDIxIDEyIj48YW5pbWF0ZSBmaWxsPSJmcmVlemUiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1kYXNob2Zmc2V0IiBkdXI9IjAuM3MiIHZhbHVlcz0iMTU7MCIvPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgZHVyPSIxLjVzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdHlwZT0icm90YXRlIiB2YWx1ZXM9IjAgMTIgMTI7MzYwIDEyIDEyIi8+PC9wYXRoPjwvc3ZnPg=='
const imageLoaded = ref(false)
const project = ref(props.project)

function handleImageLoad() {
  imageLoaded.value = true
}

function handleImageError() {
  imageLoaded.value = true // 加载失败也表示图片加载完成
  project.value.image = errorImage // 加载失败时显示的默认图片
}
</script>

<template>
  <!-- 点击跳转外链 -->
  <a
    :href="project.link"
    target="_blank"
    class="nav_a_wrap h-full flex flex-col rounded-md bg-[#f7f7f7b5] p2 text-gray-400"
    hover="bg-white border border-gray-800! shadow-md"
    dark="bg-zinc-900 hover:bg-black hover:border-slate-800!"
  >
    <div class="relative w-full flex">
      <div
        v-if="project.image ?? project.icon"
        class="h-10 w-10 flex items-center justify-center rounded-md bg-[#e5e7eb4d] dark:bg-zinc-700"
      >
        <span v-if="project.icon" :class="`${project.icon} flex-1`" />
        <div v-if="project.image" class="image-icon w-6 text-center grayscale">
          <img v-if="!imageLoaded" class="rounded-lg" :src="loadingImage">
          <img
            v-show="imageLoaded"
            class="inline-block rounded-lg"
            :src="project.image"
            @load="handleImageLoad"
            @error="handleImageError"
          >
        </div>
      </div>
      <div flex items-center overflow-hidden>
        <div
          class="line-clamp-1 text-ellipsis pl-2 text-base font-size-3.8"
          data-name
        >
          {{ project.name }}
        </div>
      </div>
      <div
        v-for="tag in project.tags"
        :key="tag"
        class="absolute hidden rounded-lg px-1 md:right-1 md:inline-flex"
        style="font-size: 13px"
      >
        {{ tag }}
      </div>
    </div>
    <div class="peer">
      <div
        v-if="project.desc"
        class="text-e mt-1 border-t border-gray-200 pt-1 text-sm font-normal op50 dark:border-gray-800"
      >
        {{ project.desc }}
      </div>
    </div>
  </a>
</template>

<style scoped>
.text-e {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.nav_a_wrap:hover .image-icon {
  --uno: grayscale-0;
}

.nav_a_wrap .peer {
  opacity: 0;
  visibility: hidden;
  width: 0;
  height: 0;
}

.nav_a_wrap:hover .peer {
  opacity: 1;
  visibility: visible;
  width: auto;
  height: auto;
  transition: all 0.8s ease;
}
</style>
