<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTypewriter } from './useTypewriter'
import { useLanguage } from '~/hooks/useLanguage'

const { t } = useI18n()
const aiPostText = ref('')
const postUrls = ref<{
  url: string
  title: string
  date: string
  description: string
}[]>()

const { typedText } = useTypewriter(aiPostText)
const route = useRoute()
const { isChinese } = useLanguage()

const computedOtherPost = computed(() => {
  if (!postUrls.value || postUrls.value.length === 0)
    return

  const filteredPostUrls = postUrls.value.filter(item =>
    isChinese.value
      ? item.url.includes('zh/posts')
      : item.url.includes('/post') && !item.url.includes('zh/posts'),
  )

  if (filteredPostUrls.length === 0)
    return

  const randomPost = filteredPostUrls[Math.floor(Math.random() * filteredPostUrls.length)]
  return randomPost.url
})

async function fetchSeeOtherPost() {
  try {
    const response = await fetch('/sitemap.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    // Note: Response body will not be accessible in 'no-cors' mode
    const data = await response.json()
    postUrls.value = data.items
  }
  catch (error) {
    console.error('Error fetching sitmap.json:', error)
  }
}

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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

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
    console.error('Error analyzing content:', error)
  }
}

onMounted(() => {
  analyzeContent()
  fetchSeeOtherPost()
})
</script>

<template>
  <div id="core-ai-summary-tool" class="slide-enter-content prose m-auto">
    <div id="core-ai-summary-tool-main">
      <div class="tool-avatar">
        <div class="avatar-main">
          <div class="left-eye" /><div class="right-eye" />
          <svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="65" height="54.9205322265625" viewBox="0 0 65 54.9205322265625" fill="none"><g filter="url(#filter_qfaS4Fm6Zk-Z2zsQpdYKO)"><path fill="url(#linear_fill_qfaS4Fm6Zk-Z2zsQpdYKO_0)" d="M8 17L8 26.557C8 32.0975 11.7931 36.9177 17.1782 38.2205L19.7609 38.8454C20.1857 38.9482 20.598 39.097 20.9904 39.2894L28.4411 42.9408C30.7807 44.0874 33.6066 43.3676 35.1125 41.2414C36.1082 39.8356 37.7239 39 39.4466 39L45 39C51.6274 39 57 33.6274 57 27L57 17C57 10.3726 51.6274 5 45 5L20 5C13.3726 5 8 10.3726 8 17Z" /></g><defs><linearGradient id="linear_fill_qfaS4Fm6Zk-Z2zsQpdYKO_0" x1="8" y1="24.964996337890625" x2="57" y2="24.964996337890625" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#505666" /><stop offset="1" stop-color="#272C38" /></linearGradient><filter id="filter_qfaS4Fm6Zk-Z2zsQpdYKO" x="0" y="0" width="65" height="54.9205322265625" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="feFloodId_qfaS4Fm6Zk-Z2zsQpdYKO" /><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha_qfaS4Fm6Zk-Z2zsQpdYKO" /><feMorphology radius="2" operator="dilate" in="SourceAlpha" /><feOffset dx="0" dy="3" /><feGaussianBlur stdDeviation="3" /><feComposite in2="hardAlpha_qfaS4Fm6Zk-Z2zsQpdYKO" operator="out" /><feColorMatrix type="matrix" values="0 0 0 0 0.49411764705882355 0 0 0 0 0.5254901960784314 0 0 0 0 0.6 0 0 0 0.25 0" /><feBlend mode="normal" in2="feFloodId_qfaS4Fm6Zk-Z2zsQpdYKO" result="dropShadow_1_qfaS4Fm6Zk-Z2zsQpdYKO" /><feBlend mode="normal" in="SourceGraphic" in2="dropShadow_1_qfaS4Fm6Zk-Z2zsQpdYKO" result="shape_qfaS4Fm6Zk-Z2zsQpdYKO" /></filter></defs></svg>
        </div>
      </div><div class="tool-header">
        <div class="">
          <div class="tool-title">
            {{ $t('summary', 'AI Summary') }}
          </div><div class="tool-sub-title">
            {{ $t('generatedContentNote', '') }}
          </div>
        </div><div>
          <a href="https://github.com/ryanuo/gpt" target="_blank" rel="noopener">Core AI Power</a>
        </div>
      </div><div class="summary-content">
        <div>
          <p v-if="typedText" class="max-h-32 overflow-auto m-0!">
            {{ typedText }}
          </p>
          <span v-else class="ellipsis-animation">{{ $t('loading', 'Loading.') }}</span>
        </div>
      </div><div class="tool-footer">
        <div v-if="computedOtherPost" class="core-ai-see-other">
          <a :href="computedOtherPost" class="other-link" target="_blank" rel="noopener noreferrer">
            See more <i class="i-material-symbols-arrow-right-alt-rounded text-white" />
          </a>
        </div>
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

/* 新增样式 */
#core-ai-summary-tool {
  padding-top: 20px;
}

@keyframes leftEye-60cb787d {
  0% {
    left: 25px;
  }
  25% {
    left: 30px;
  }
  50% {
    left: 25px;
  }
  75% {
    left: 20px;
  }
  to {
    left: 25px;
  }
}

@keyframes rightEye-60cb787d {
  0% {
    right: 25px;
  }
  25% {
    right: 20px;
  }
  50% {
    right: 25px;
  }
  75% {
    right: 30px;
  }
  to {
    right: 25px;
  }
}

/* 修改 left-eye 和 right-eye 的动画关键帧，使它们同步运动 */
@keyframes eyeMovement {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(5px);
  }
  50% {
    transform: translateX(0);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}

/* 应用同步动画到 left-eye 和 right-eye */
#core-ai-summary-tool-main .tool-avatar .left-eye,
#core-ai-summary-tool-main .tool-avatar .right-eye {
  animation: eyeMovement 2s infinite;
}

/* 新增 bot-avatar 动效关键帧 */
@keyframes botAvatarBounce {
  0%,
  100% {
    transform: translateY(2px);
  }
  50% {
    transform: translateY(-2px);
  }
}

/* 应用动销到 bot-avatar */
#core-ai-summary-tool-main .bot-avatar {
  width: 65px;
  height: 54px;
  animation: botAvatarBounce 2s infinite;
  cursor: pointer;
}

#core-ai-summary-tool-main {
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 14px;
  position: relative;
  margin-bottom: 10px;
  margin-top: 20px;
  background: #f7f7f9;
  box-shadow: inset 0 0 4px #7e86991a;
}

#core-ai-summary-tool-main .tool-footer {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

#core-ai-summary-tool-main .tool-footer .feedback-link {
  color: #7e8699;
  font-size: 12px;
  text-decoration: none;
}

#core-ai-summary-tool-main .tool-footer .other-link {
  display: flex;
  align-items: center;
  gap: 5px;
}

#core-ai-summary-tool-main .tool-footer .other-link:hover {
  color: #fff !important;
}

#core-ai-summary-tool-main .tool-footer .core-ai-see-other {
  background: #272c38;
  display: inline-block;
  border-radius: 15px;
  padding: 2px 10px;
  font-size: 12px;
}

#core-ai-summary-tool-main .tool-footer .core-ai-see-other a {
  color: #fff;
  text-decoration: none;
}

#core-ai-summary-tool-main .tool-avatar {
  position: absolute;
  width: 80px;
  height: 80px;
  background: #fff;
  border-radius: 50%;
  top: -40px;
  left: calc(50% - 40px);
  padding: 5px;
}

#core-ai-summary-tool-main .tool-avatar .left-eye {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  display: inline-block;
  position: absolute;
  z-index: 10;
  right: 25px;
}

#core-ai-summary-tool-main .tool-avatar .right-eye-animation {
  animation: leftEye-60cb787d 2s forwards infinite;
}

#core-ai-summary-tool-main .tool-avatar .left-eye-animation {
  animation: rightEye-60cb787d 2s forwards infinite;
}

#core-ai-summary-tool-main .tool-avatar .right-eye {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  display: inline-block;
  position: absolute;
  z-index: 10;
  left: 25px;
}

#core-ai-summary-tool-main .tool-avatar .avatar-main {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f7f7f9;
  box-shadow: inset 0 -1px 6px 2px #7e869926;
  display: flex;
  align-items: center;
  justify-content: center;
}

#core-ai-summary-tool-main .tool-avatar .avatar-main img {
  box-shadow: none;
}

#core-ai-summary-tool-main .tool-avatar:before {
  content: ' ';
  display: none;
  width: 0;
  height: 0;
  border-radius: 50%;
  border: 10px solid transparent;
  background: transparent;
  border-left-color: green;
  position: absolute;
  transform: rotate(135deg);
  top: 50%;
  left: -10px;
}

#core-ai-summary-tool-main .tool-sub-title {
  font-size: 12px;
  color: #828a9d;
}

#core-ai-summary-tool-main .tool-title {
  font-weight: 700;
}

#core-ai-summary-tool-main .tool-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

#core-ai-summary-tool-main .tool-header a {
  text-decoration: none;
  color: #272c38;
  font-size: 10px;
}

#core-ai-summary-tool-main .summary-content {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
}

@media (max-width: 710px) {
  #core-ai-summary-tool {
    padding: 10px;
  }

  #core-ai-summary-tool .tool-header {
    flex-direction: column;
  }

  .tool-sub-title {
    margin-top: 20px;
  }
}

/* Dark mode styles */
.dark #core-ai-summary-tool-main {
  background: #1e1e2e;
  box-shadow: inset 0 0 4px #0000001a;
  color: #c9d1d9;
}

.dark #core-ai-summary-tool-main .tool-footer .core-ai-see-other {
  background: #3b3b4f;
}

.dark #core-ai-summary-tool-main .tool-footer .core-ai-see-other a {
  color: #c9d1d9;
}

.dark #core-ai-summary-tool-main .summary-content {
  background: #2c2c3c;
}

.dark #core-ai-summary-tool-main .tool-header a {
  color: #c9d1d9;
}

.dark #core-ai-summary-tool-main .tool-sub-title {
  color: #8b949e;
}
</style>
