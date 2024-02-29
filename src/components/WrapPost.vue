<script setup lang="ts">
defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <ClientOnly v-if="frontmatter.plum">
    <Plum />
  </ClientOnly>
  <slot />
</template>
