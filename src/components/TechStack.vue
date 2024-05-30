<script setup lang="ts">
defineProps<{
  techStack: { icon?: string, name: string }[] | string[]
  uno?: string
}>()
</script>

<template>
  <div :class="`flex gap-2 ${uno}`">
    <div
      v-for="(tech, index) in techStack"
      :key="index"
      class="flex flex-row items-center"
    >
      <div
        dark="bg-[#1a1b1cd9] border-gray-700"

        cursor-pointer border border-0.2 border-gray-200 rounded border-dashed bg-gray-100 px-1 text-sm
      >
        <i
          v-if="typeof tech !== 'string' && tech.icon"
          :class="typeof tech !== 'string' && tech.icon"
        />
        <span class="align-middle text-gray-500 dark:text-gray-300">{{
          typeof tech === "string" ? tech : tech.name
        }}</span>
      </div>
    </div>
  </div>
</template>
