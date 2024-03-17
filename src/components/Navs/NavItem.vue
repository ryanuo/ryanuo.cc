<script setup lang="ts">
interface Project {
  desc: string;
  name: string;
  link: string;
  icon: string;
  image: string;
  tags: string[];
}

const props = defineProps<{
  project: Project;
}>();
const errorImage =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9IiNjY2NjY2MiIGQ9Ik0yMiAyMC43TDMuMyAyTDIgMy4zbDEgMVYxOWMwIDEuMS45IDIgMiAyaDE0LjdsMSAxek01IDE5VjYuM2w3LjYgNy42bC0xLjUgMS45TDkgMTMuMUw2IDE3aDkuN2wyIDJ6TTguOCA1bC0yLTJIMTljMS4xIDAgMiAuOSAyIDJ2MTIuMmwtMi0yVjV6Ii8+PC9zdmc+";
const loadingImage =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NjY2NjYyIgc3Ryb2tlLWRhc2hhcnJheT0iMTUiIHN0cm9rZS1kYXNob2Zmc2V0PSIxNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0xMiAzQzE2Ljk3MDYgMyAyMSA3LjAyOTQ0IDIxIDEyIj48YW5pbWF0ZSBmaWxsPSJmcmVlemUiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1kYXNob2Zmc2V0IiBkdXI9IjAuM3MiIHZhbHVlcz0iMTU7MCIvPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgZHVyPSIxLjVzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgdHlwZT0icm90YXRlIiB2YWx1ZXM9IjAgMTIgMTI7MzYwIDEyIDEyIi8+PC9wYXRoPjwvc3ZnPg==";
const imageLoaded = ref(false);
const project = ref(props.project);

const handleImageLoad = () => {
  imageLoaded.value = true;
};

const handleImageError = () => {
  imageLoaded.value = true; // 加载失败也表示图片加载完成
  project.value.image = errorImage; // 加载失败时显示的默认图片
};
</script>
<template>
  <!-- 点击跳转外链 -->
  <a
    :href="project.link"
    target="_blank"
    class="flex flex-col bg-gray-100 rounded-md text-gray-400 p2 h-full nav_a_wrap"
    hover="bg-white border border-gray-800! shadow-md"
    dark="bg-zinc-900 hover:bg-black hover:border-slate-800!"
  >
    <div class="w-full flex relative">
      <div
        v-if="project.image ?? project.icon"
        class="flex justify-center items-center bg-gray-200 dark:bg-zinc-700 rounded-md w-10 h-10"
      >
        <span v-if="project.icon" :class="`${project.icon} flex-1`" />
        <div v-if="project.image" class="w-6 grayscale image-icon">
          <img class="rounded-lg" :src="loadingImage" v-if="!imageLoaded" />
          <img
            class="rounded-lg"
            :src="project.image"
            @load="handleImageLoad"
            @error="handleImageError"
            v-show="imageLoaded"
          />
        </div>
      </div>
      <div flex items-center overflow-hidden>
        <div class="text-base font-size-3.8 pl-2 text-ellipsis line-clamp-1">
          {{ project.name }}
        </div>
      </div>
      <div
        v-for="tag in project.tags"
        :key="tag"
        class="absolute hidden md:inline-flex md:right-1 bg-gray-200 dark:bg-gray-800 rounded-lg px-1"
        style="font-size: 13px"
      >
        {{ tag }}
      </div>
    </div>
    <div
      v-if="project.desc"
      class="text-e pt-1 mt-1 border-t border-gray-200 dark:border-gray-800 text-sm"
    >
      {{ project.desc }}
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
</style>
