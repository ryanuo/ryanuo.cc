<script setup lang="ts">
defineProps<{ projects: Record<string, any[]> }>();

function slug(name: string) {
  return name.toLowerCase().replace(/[\s\\\/]+/g, "-");
}
</script>

<template>
  <div class="max-w-300 mx-auto"></div>
</template>
