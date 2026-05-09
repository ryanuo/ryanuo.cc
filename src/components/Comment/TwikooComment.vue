<script setup lang="ts">
const containerRef = ref<HTMLElement | null>(null)
const route = useRoute()

declare global {
  interface Window {
    twikoo: any
  }
}

function initTwikoo() {
  if (!route.path.includes('posts'))
    return

  if (!containerRef.value || typeof window.twikoo === 'undefined') {
    console.warn('Twikoo container not found or library not loaded')
    return
  }

  const envId = import.meta.env.VITE_APP_TWIKOO_ENV_ID
  window.twikoo.init({
    envId,
    el: containerRef.value,
    path: route.path,
    lang: 'zh-CN',
  })
}

onMounted(() => {
  // 1. 检查路径
  if (route.path.includes('posts')) {
    // 2. 检查是否已加载
    if (!document.getElementById('twikoo')) {
      const script = document.createElement('script')
      script.id = 'twikoo'
      script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.7.9/dist/twikoo.min.js'
      script.crossOrigin = 'anonymous'
      script.onload = initTwikoo
      document.body.appendChild(script)
    }
    else {
      initTwikoo()
    }
  }
})

watch(() => route.path, () => {
  if (route.path.includes('posts')) {
    setTimeout(() => {
      initTwikoo()
    }, 100)
  }
})
</script>

<template>
  <div ref="containerRef" class="twikoo-wrapper" />
</template>

<style scoped>
/* .twikoo-wrapper {
  max-width: 1000px;
  margin: 40px auto 0;
  padding-top: 20px;
  border-top: 1px solid #eee;
} */
</style>
