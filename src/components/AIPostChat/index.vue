<script setup lang="ts">
// 创建一个 ref 来保存插槽内容
const slotContent = ref<string | undefined>();
const aiPostText = ref("");
import { useTypewriter } from "./useTypewriter";

const { typedText } = useTypewriter(aiPostText);

// 在组件挂载时，监听插槽内容的变化
onMounted(() => {
  slotContent.value = document.querySelector("article")?.innerText.trim();
});

// 智能分析插槽内容
const analyzeContent = () => {
  let apiUrl;
  if (import.meta.env.DEV) {
    // 在开发环境下使用本地接口
    apiUrl = "/api/g4f/generate_completion";
  } else {
    // 在生产环境下使用远程接口
    apiUrl = "https://gpt.mr90.top/g4f/generate_completion";
  }
  // 使用 fetch 发送数据到后端进行智能分析
  fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify({
      message: [
        {
          role: "assistant",
          content: "概括以下内容,50个字数左右,不要超出文字字数限制",
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
    .then((res) => {
      // 处理分析结果
      if (res.status_code === 200) {
        aiPostText.value = res.data;
      } else {
        aiPostText.value = "分析失败,AI机器人故障请联系管理员！！";
      }
    })
    .catch((error) => {
      // 处理错误
      aiPostText.value = "分析失败,AI机器人故障请联系管理员！！";
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
  <div
    class="prose m-auto slide-enter-content rounded-xl p-3 border border-color-[#e3e8f7]"
  >
    <div class="flex justify-between">
      <a href="javascript:void(0)" title="查看详情"
        ><div>
          <i class="i-gravity-ui-square-article" />
          <span class="align-middle">摘要</span>
        </div>
        <div class="ai-link">
          <i class="icon-arrow-right-s-line" /></div
      ></a>
      <div class="font-size-[.8rem] flex items-center cursor-pointer">
        <i class="i-ri-robot-2-line mr-1 align-middle" />
        RyanAI
      </div>
    </div>
    <div class="my-2 indent-8 font-size-[.94rem] break-all">
      <p v-if="typedText" class="overflow-auto max-h-32 m-0!">
        {{ typedText }}
      </p>
      <span v-else class="ellipsis-animation">Loading.</span>
    </div>
    <div>
      <div class="font-size-[.7rem] text-color-[#3c3c43cc]">
        此内容根据文章生成，仅用于文章内容的解释与总结
      </div>
    </div>
  </div>
</template>
<style>
/* 省略号动画关键帧 */
@keyframes ellipsis {
  0% {
    content: ".";
  }
  33% {
    content: "..";
  }
  66% {
    content: "...";
  }
  100% {
    content: "";
  }
}

/* 应用省略号动画到元素 */
.ellipsis-animation::after {
  content: ".";
  animation: ellipsis 1s infinite steps(1);
}
</style>
