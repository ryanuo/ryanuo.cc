<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTypewriter } from './useTypewriter'

const { t } = useI18n()
const aiPostText = ref('')
const { typedText } = useTypewriter(aiPostText)
const route = useRoute()

async function analyzeContent() {
  let apiUrl
  if (import.meta.env.DEV) {
    apiUrl = '/api/ai-post'
  }
  else {
    apiUrl = 'https://gpt.ryanuo.cc/ai-post'
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'RefererUrl': `https://ryanuo.cc${route.path}`,
      },
      body: JSON.stringify({
        content: aiPostText.value,
      }),
    })

    const res = await response.json()
    if (res.status_code === 200) {
      aiPostText.value = res.data
    }
    else {
      aiPostText.value = t('analysisFailed', 'Analysis failed, AI robot malfunction, please contact the administrator!!')
    }
  }
  catch (error) {
    aiPostText.value = t('analysisFailed', 'Analysis failed, AI robot malfunction, please contact the administrator!!')
    console.error(error)
  }
}

function handleAIPostClick() {
  window.open('https://github.com/ryanuo/gpt', '_blank')
}

onMounted(() => {
  analyzeContent()
})
</script>

<template>
  <div class="prose slide-enter-content m-auto mb-2 border border-color-[#e3e8f7] rounded-xl p-3">
    <div class="flex justify-between">
      <a href="javascript:void(0)" :title="$t('viewDetails', 'View Details')">
        <!-- <div>
          <i class="i-gravity-ui-square-article" />
          <span class="align-middle">{{ $t('summary', 'Summary') }}</span>
        </div> -->
        <div class="ai-link">
          <i class="icon-arrow-right-s-line" />
        </div>
      </a>
      <div
        class="flex cursor-pointer items-center font-size-[.8rem]"
        @click="handleAIPostClick"
      >
        <i class="i-ri-robot-2-line mr-1 align-middle" />
        {{ $t('aiRobot', 'RyanAI') }}
      </div>
    </div>
    <div class="my-2 break-all indent-8 font-size-[.94rem]">
      <p v-if="typedText" class="max-h-32 overflow-auto m-0!">
        {{ typedText }}
      </p>
      <span v-else class="ellipsis-animation">{{ $t('loading', 'Loading.') }}</span>
    </div>
    <div>
      <div class="font-size-[.7rem] text-color-[#3c3c43cc]">
        {{ $t('generatedContentNote', 'This content is generated based on the article and is only used for explanation and summary of the article content.') }}
      </div>
    </div>
  </div>
</template>

<style>
/* 省略号动画关键帧 */
@keyframes ellipsis {
  0% {
    content: '.';
  }

  33% {
    content: '..';
  }

  66% {
    content: '...';
  }

  100% {
    content: '';
  }
}

/* 应用省略号动画到元素 */
.ellipsis-animation::after {
  content: '.';
  animation: ellipsis 1s infinite steps(1);
}
</style>
