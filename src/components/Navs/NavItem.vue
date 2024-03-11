<script setup lang="ts">
interface Project {
  desc: string;
  name: string;
  link: string;
  icon: string;
  image: string;
  tags: string[];
}

defineProps<{ project: Project }>();
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
          <img class="rounded-lg" :src="project.image" />
        </div>
      </div>
      <span class="text-base font-medium flex items-center pl-2">
        {{ project.name }}
      </span>
      <div
        v-for="tag in project.tags"
        :key="tag"
        class="absolute right-1 bg-gray-200 dark:bg-gray-800 rounded-lg px-1"
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
