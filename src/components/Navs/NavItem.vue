<script setup lang="ts">
interface Project {
  desc: string;
  name: string;
  link: string;
  icon: string;
  image: string;
}

defineProps<{ project: Project }>();
</script>
<template>
  <!-- 点击跳转外链 -->
  <a
    :href="project.link"
    target="_blank"
    class="flex flex-col bg-gray-100 rounded-md text-gray-400 p2"
    hover="bg-white border border-gray-800! shadow-md"
    dark="bg-zinc-900 hover:bg-black hover:border-slate-800!"
  >
    <div class="w-full flex">
      <span
        class="flex place-items-center bg-gray-200 dark:bg-zinc-700 rounded-md w-10 h-10"
      >
        <span v-if="project.icon" :class="`${project.icon} flex-1`" />
        <img v-if="project.image" :src="project.image" class="" />
      </span>
      <span class="text-base font-medium flex items-center pl-2">
        {{ project.name }}
      </span>
    </div>
    <span
      v-if="project.desc"
      class="pt-1 mt-1 border-t border-gray-200 dark:border-gray-800 text-sm"
    >
      {{ project.desc }}
    </span>
  </a>
</template>
