<script setup lang="ts">
import { formatDateToMarDD } from "@/utils";
const route = useRoute();
defineProps({
  frontmatter: {
    type: Object,
    required: true,
  },
});

// 创建一个 ref 来保存插槽内容
const slotContent = ref<string | undefined>();

// 监听插槽内容变化
const onSlotChange = () => {
  slotContent.value = document.querySelector("article")?.innerText.trim();
};

// 在组件挂载时，监听插槽内容的变化
onMounted(() => {
  onSlotChange();
});

// 智能分析插槽内容
const analyzeContent = () => {
  // 使用 fetch 发送数据到后端进行智能分析
  // fetch("/api/g4f/generate_completion", {
  fetch("https://gpt.mr90.top/g4f/generate_completion", {
    method: "POST",
    body: JSON.stringify({
      message: [
        {
          role: "assistant",
          content: "概括以下内容,50个字左右",
        },
        {
          role: "user",
          content: slotContent.value,
        },
      ],
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // 处理分析结果
      console.log(data);
    })
    .catch((error) => {
      // 处理错误
      console.error(error);
    });
};

// 使用 watch 监听 slotContent 的变化
watch(slotContent, (newValue, oldVal) => {
  if (newValue !== oldVal) {
    analyzeContent();
  }
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
    <slot />
  </article>
  <div
    v-if="route.path.indexOf('posts') !== -1"
    class="prose m-auto mt-8 mb-8 slide-enter animate-delay-500 print:hidden"
  >
    <span font-mono op50>> </span>
    <RouterLink
      :to="route.path.split('/').slice(0, -1).join('/') || '/'"
      class="font-mono op50 hover:op75"
      v-text="'cd ..'"
    />
  </div>
</template>
