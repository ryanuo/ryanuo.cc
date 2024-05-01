<script setup lang="ts">
import { formatDateToMarDD } from "@/utils";
const route = useRoute();
defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
});

const isShowAIPost = computed(() => {
  if (route.path === "/zh/posts" || route.path === "/posts") return false;
  return route.path.indexOf("posts") !== -1;
});
</script>

<template>
  <ClientOnly
    v-if="typeof frontmatter.plum === 'boolean' ? frontmatter.plum : true"
  >
    <Plum />
  </ClientOnly>
  <div
    v-if="frontmatter.title && !frontmatter.isHidenTitle"
    class="prose"
    m-auto
    mb-8
  >
    <h1 class="mb-0 slide-enter-50" :style="frontmatter.titleStyle">
      <span data-title>{{ frontmatter.display ?? frontmatter.title }}</span>
      <div class="text-sm text-gray-500 mt-2 font-400" v-if="frontmatter.date">
        {{ formatDateToMarDD(frontmatter.date, true) }}
      </div>
    </h1>
  </div>
  <article>
    <AIPostChat v-if="isShowAIPost" />
    <slot />
  </article>
  <div
    v-if="route.path.indexOf('posts') !== -1"
    class="prose m-auto mt-8 mb-8 slide-enter animate-delay-500 print:hidden"
  >
    <div class="w-full flex justify-end"><Sign /></div>
    <span font-mono op50>> </span>
    <RouterLink
      :to="route.path.split('/').slice(0, -1).join('/') || '/'"
      class="font-mono op50 hover:op75"
      v-text="'cd ..'"
    />
  </div>
</template>
