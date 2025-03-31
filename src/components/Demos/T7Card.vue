<script setup lang="ts">
import type { DemosTypes } from './type'

const props = defineProps<{ demos: Record<number, DemosTypes[]> }>()

const demosArray = computed(() => {
  return Object.keys(props.demos)
    .sort((a, b) => Number(b) - Number(a))
    .flatMap(key => props.demos[Number(key)].map(demo => ({ ...demo, year: Number(key) })))
})

const index = ref(0)
const imgBoxCount = ref(0)
const imgBoxLength = ref(0)
const animationTime = ref(0.5)

watch([() => index.value, () => imgBoxCount.value], ([newValue]) => {
  if (imgBoxCount.value > 0) {
    const eleList = document.querySelectorAll('.img-box')
    for (let i = eleList.length - 1; i >= 0; i--) {
      const ele = eleList[i] as HTMLElement
      const len = eleList.length - i - 1
      if (newValue >= 0 && len <= newValue) {
        ele.style.transform = `translateX(-${imgBoxLength.value * eleList.length}vw)`
      }
      else {
        ele.style.transform = 'none'
      }
    }
  }
}, { immediate: true })

const imgListStyle = computed(() => ({
  transition: `${animationTime.value}s ease`,
  left: `${imgBoxLength.value * index.value}vw`,
}))

const btnGroupOpacity = computed(() => (animationTime.value * 1000 > 0 ? 1 : 0))
const btnGroupBottom = computed(() => (animationTime.value * 1000 > 0 ? '5%' : '0'))
const btnGroupStyle = computed(() => ({
  opacity: btnGroupOpacity.value,
  bottom: btnGroupBottom.value,
}))
function initializeData() {
  const postSpacing = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--post-spacing').replace('vw', ''))
  const postSize = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--post-size').replace('vw', ''))

  imgBoxCount.value = demosArray.value.length
  imgBoxLength.value = postSize + postSpacing
}

function cilckFun(flag: 'next' | 'last') {
  if (flag === 'next') {
    index.value--
    // Transition effect for next
    setTimeout(() => {
      if (Math.abs(index.value) === imgBoxCount.value) {
        index.value = 0
      }
    }, animationTime.value * 1000)
  }
  else {
    index.value++
    // Transition effect for previous
    setTimeout(() => {
      if (Math.abs(index.value) === imgBoxCount.value) {
        index.value = 0
      }
    }, animationTime.value * 1000)
  }
}

onMounted(() => {
  initializeData()
})

function targetLink(link: string) {
  if (link) {
    window.open(link, '_blank')
  }
}
</script>

<template>
  <div class="t7-card">
    <div class="title">
      <p> Hello! 👋🏾This is my portfolio page！</p>
    </div>
    <div id="banner">
      <div :style="imgListStyle" class="img-list img-wrapper">
        <div
          v-for="(demo, index) in demosArray"
          :key="index"
          class="img-box"
          @click="targetLink(demo.link)"
        >
          <div class="info">
            <h3>{{ demo.name }}</h3>
          </div>
          <img :src="demo.img || '/demos/zhanweitu.png'" alt="">
        </div>
      </div>
    </div>
    <div class="btn-group" :style="btnGroupStyle">
      <button class="last btn" @click="cilckFun('last')">
        <svg
          t="1686471404424" class="icon left" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="2373" width="128" height="128"
        >
          <path
            d="M862.485 481.154H234.126l203.3-203.3c12.497-12.497 12.497-32.758 0-45.255s-32.758-12.497-45.255 0L135.397 489.373c-12.497 12.497-12.497 32.758 0 45.254l256.774 256.775c6.249 6.248 14.438 9.372 22.627 9.372s16.379-3.124 22.627-9.372c12.497-12.497 12.497-32.759 0-45.255l-203.3-203.301h628.36c17.036 0 30.846-13.81 30.846-30.846s-13.81-30.846-30.846-30.846z"
            fill="" p-id="2374"
          />
        </svg>
      </button>
      <button class="next btn" @click="cilckFun('next')">
        <svg
          t="1686471404424" class="icon right" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="2373" width="128" height="128"
        >
          <path
            d="M862.485 481.154H234.126l203.3-203.3c12.497-12.497 12.497-32.758 0-45.255s-32.758-12.497-45.255 0L135.397 489.373c-12.497 12.497-12.497 32.758 0 45.254l256.774 256.775c6.249 6.248 14.438 9.372 22.627 9.372s16.379-3.124 22.627-9.372c12.497-12.497 12.497-32.759 0-45.255l-203.3-203.301h628.36c17.036 0 30.846-13.81 30.846-30.846s-13.81-30.846-30.846-30.846z"
            fill="" p-id="2374"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style>
:root {
  --post-spacing: 1.78vw;
  --post-size: 25vw;
  --mask-size: 100vw;
}

.t7-card {
  padding: 0;
  margin: 0;
  font-family: Millik, Arial, sans-serif;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
@font-face {
  font-family: Millik;
  font-weight: 700;
  src: url(/font/Millik.c3f91cb.ttf) format('truetype');
  text-rendering: optimizeLegibility;
}

.title {
  position: absolute;
  left: 50%;
  top: 15%;
  -webkit-transform: translate(-50%, -5%);
  transform: translate(-50%, -5%);
}

.title p {
  font-size: 2rem;
  font-weight: 800;
  white-space: nowrap;
}

#banner {
  overflow: hidden;
  position: relative;
  width: 100vw;
  height: calc(var(--post-size) / 0.72);
  -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDE0NDAgNTAwIiBpZD0iaiI+CiAgPHBhdGggZmlsbD0icmdiKDIwMCwyMDAsMjAwKSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCAwczI3NS4wNCAxMDAgNzIwIDEwMFMxNDQwIDAgMTQ0MCAwdjUwMHMtMjc1LjA0LTEwMC03MjAtMTAwUzAgNTAwIDAgNTAwVjB6Ii8+Cjwvc3ZnPgo=);
  mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDQwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDE0NDAgNTAwIiBpZD0iaiI+CiAgPHBhdGggZmlsbD0icmdiKDIwMCwyMDAsMjAwKSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMCAwczI3NS4wNCAxMDAgNzIwIDEwMFMxNDQwIDAgMTQ0MCAwdjUwMHMtMjc1LjA0LTEwMC03MjAtMTAwUzAgNTAwIDAgNTAwVjB6Ii8+Cjwvc3ZnPgo=);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: var(--mask-size);
  mask-size: var(--mask-size);
  position: absolute;
  top: 12%;
}

#banner .img-wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: absolute;
  width: 100%;
  float: left;
  height: calc(var(--post-size) / 0.72);
  -webkit-transform: translate(13.39vw, 0);
  transform: translate(13.39vw, 0);
  -webkit-animation: admission 1.5s;
  animation: admission 1.5s;
}

#banner .img-wrapper .img-box {
  height: 100%;
  display: inline-block;
  margin-right: var(--post-spacing);
  position: relative;
  cursor: pointer;
}

#banner .img-wrapper .img-box .info {
  position: absolute;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: rgba(23, 23, 23, 0.5);
  text-align: center;
  color: #fff9f1;
  font-size: 4rem;
}

.info h3 {
  font-family: Millik;
  font-weight: 700;
  font-size: 1.5rem;
  margin: 0;
}

#banner .img-wrapper .img-box img {
  width: var(--post-size);
  height: 100%;
  -o-object-position: center;
  object-position: center;
  -o-object-fit: cover;
  object-fit: cover;
  max-width: fit-content;
}

.btn-group {
  /* height: 15vh; */
  position: absolute;
  left: 50%;
  bottom: 0%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-transition: 1s;
  transition: 1s;
  opacity: 0;
}

.btn-group .btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #171717;
  background-color: #fff;
  margin: 10px;
  cursor: pointer;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.btn-group .btn:hover {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
  background-color: #000;
}

.btn-group .btn:hover .icon {
  fill: #fff;
}

.btn-group .btn .icon {
  width: 30px;
  height: 30px;
  display: inline-block;
}

.btn-group .btn .right {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}

.img-list {
  left: 0;
}

@-webkit-keyframes admission {
  0% {
    -webkit-transform: translate(140vw, 0);
    transform: translate(140vw, 0);
  }
  100% {
    -webkit-transform: translate(13.39vw, 0);
    transform: translate(13.39vw, 0);
  }
}

@keyframes admission {
  0% {
    -webkit-transform: translate(140vw, 0);
    transform: translate(140vw, 0);
  }
  100% {
    -webkit-transform: translate(13.39vw, 0);
    transform: translate(13.39vw, 0);
  }
}
</style>
