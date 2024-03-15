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
  <div
    v-if="frontmatter.title && !frontmatter.isHidenTitle"
    class="prose"
    m-auto
    mb-8
  >
    <h1 class="mb-0 slide-enter-50" :style="frontmatter.titleStyle">
      {{ frontmatter.display ?? frontmatter.title }}
    </h1>
  </div>
  <article>
    <slot />
  </article>
</template>
