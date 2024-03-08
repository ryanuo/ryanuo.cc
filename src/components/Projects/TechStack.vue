<script setup lang="ts">
defineProps<{ techStack: { icon: string; name: string }[] }>();
</script>

<template>
  <div class="flex gap-2">
    <div
      v-for="(tech, index) in techStack"
      :key="index"
      class="flex flex-row items-center"
    >
      <div
        dark="bg-gray-900 border-gray-700"
        cursor-pointer
        bg-gray-100
        rounded
        px-1
        text-sm
        border
        border-0.2
        border-gray-200
        border-dashed
      >
        <i :class="tech.icon"></i>
        <span class="text-gray-500 dark:text-gray-300 align-middle">{{
          tech.name
        }}</span>
      </div>
    </div>
  </div>
</template>
