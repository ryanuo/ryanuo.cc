<script setup lang="ts">
defineProps<{ projects: Record<string, any[]> }>();

function slug(name: string) {
  return name.toLowerCase().replace(/[\s\\\/]+/g, "-");
}
</script>

<template>
  <div class="max-w-300 mx-auto">
    <div
      v-for="(key, cidx) in Object.keys(projects)"
      :key="slug(key)"
      slide-enter
      :style="{ '--enter-stage': cidx + 1 }"
      class="mb-10"
    >
      <h4 :id="slug(key)" class="text-2xl font-bold mb-5">
        {{ key }}
      </h4>
      <ul class="list-disc list-inside flex flex-wrap flex-justify-between">
        <li
          v-for="project in projects[key]"
          :key="project.name"
          class="mb-2 list-none w-68"
        >
          <NavItem :project="project" />
        </li>
      </ul>
    </div>
  </div>
</template>
