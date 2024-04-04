<script setup lang="ts">
import { useTypewriter } from "./useTypewriter";

const aiPostText = ref("");
const { typedText } = useTypewriter(aiPostText);
const route = useRoute();

// 智能分析插槽内容
const analyzeContent = () => {
  let apiUrl;
  if (import.meta.env.DEV) {
    // 在开发环境下使用本地接口
    apiUrl = "/api/ai-post";
  } else {
    // 在生产环境下使用远程接口
    apiUrl = "https://gpt.mr90.top/ai-post";
  }
  // 使用 fetch 发送数据到后端进行智能分析
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      RefererUrl: `https://mr90.top${route.path}`,
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
onMounted(() => {
  analyzeContent();
});
</script>
<template>
  <div
    class="prose m-auto slide-enter-content rounded-xl p-3 border border-color-[#e3e8f7] mb-2"
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
