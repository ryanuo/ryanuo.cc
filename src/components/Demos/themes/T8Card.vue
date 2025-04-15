<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import type { DemosTypes } from '../type'
import { useModalOptions } from '../hooks/useModalOptions'
import { launchInNewWindow } from '~/utils'

const props = defineProps<{ demos: Record<number, DemosTypes[]> }>()

const { options } = useModalOptions()

const demosArray = computed(() => {
  return Object.keys(props.demos)
    .sort((a, b) => Number(b) - Number(a))
    .flatMap(key => props.demos[Number(key)].map(demo => ({ ...demo, year: Number(key), img: demo.img || '/demos/zhanweitu.png',
    })))
})
</script>

<template>
  <div class="t8-card">
    <div class="title">
      <p> Hello! 👋🏾This is my portfolio page！</p>
    </div>
    <div id="banner-t8">
      <Swiper
        slides-per-view="auto"
        :pagination="{
          el: '.swiper-pagination',
          clickable: true,
        }"
        :navigation="{
          nextEl: '.next',
          prevEl: '.last',
        }"
        :loop="true"
        :modules="[Navigation, Autoplay, Pagination]"
        :autoplay="true"
      >
        <SwiperSlide
          v-for="(demo, index) in demosArray"
          :key="index"
          class="img-box"
        >
          <div class="info">
            <h3 @click.prevent="launchInNewWindow(demo.link)">
              {{ demo.name }}
              <i
                class="i-ri-fullscreen-exit-fill text-[14px] transition-all duration-[0.6s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[1.2]" @click.stop="() => {
                  options.modelValue = true;
                  options.content = demo;
                }
                "
              />
            </h3>
          </div>
          <img :src="demo.img" alt="">
        </SwiperSlide>
      </Swiper>
    </div>
    <div class="btn-group">
      <button class="last btn">
        <svg
          t="1686472004424" class="icon left" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="2373" width="128" height="128"
        >
          <path
            d="M862.485 481.154H234.126l203.3-203.3c12.497-12.497 12.497-32.758 0-45.255s-32.758-12.497-45.255 0L135.397 489.373c-12.497 12.497-12.497 32.758 0 45.254l256.774 256.775c6.249 6.248 14.438 9.372 22.627 9.372s16.379-3.124 22.627-9.372c12.497-12.497 12.497-32.759 0-45.255l-203.3-203.301h628.36c17.036 0 30.846-13.81 30.846-30.846s-13.81-30.846-30.846-30.846z"
            fill="" p-id="2374"
          />
        </svg>
      </button>
      <button class="next btn">
        <svg
          t="1686472004424" class="icon right" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="2373" width="128" height="128"
        >
          <path
            d="M862.485 481.154H234.126l203.3-203.3c12.497-12.497 12.497-32.758 0-45.255s-32.758-12.497-45.255 0L135.397 489.373c-12.497 12.497-12.497 32.758 0 45.254l256.774 256.775c6.249 6.248 14.438 9.372 22.627 9.372s16.379-3.124 22.627-9.372c12.497-12.497 12.497-32.759 0-45.255l-203.3-203.301h628.36c17.036 0 30.846-13.81 30.846-30.846s-13.81-30.846-30.846-30.846z"
            fill="" p-id="2374"
          />
        </svg>
      </button>
    </div>
    <div class="swiper-pagination" />
    <ModalCard :options="options" />
  </div>
</template>

<style>
:root {
  --post-spacing: 1.78vw;
  --post-size: 25vw;
  --mask-size: 100vw;
  --swiper-pagination-color: #bcd4e0;
  --swiper-pagination-bullet-inactive-color: #bbbbbb;
}
</style>

<style scoped>
.t8-card {
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

#banner-t8 {
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
  top: 18%;
}

#banner-t8 .img-box {
  display: inline-block;
  margin-right: var(--post-spacing);
  position: relative;
  cursor: pointer;
  width: var(--post-size);
  height: calc(var(--post-size) / 0.72);
  cursor: pointer;
  overflow: hidden;
}

#banner-t8 .img-box:hover img {
  -webkit-transform: scale(1.05);
  transform: scale(1.05);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

#banner-t8 .img-box .info {
  position: absolute;
  z-index: 1; /* 确保 info 在 img 之上 */
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

.info h3:hover {
  text-underline-offset: 0.3em;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-thickness: 2px;
}

.info h3:hover i {
  display: inline-block;
  transition: all 0.3s ease-in-out; /* 缩短时间并调整缓动函数 */
  opacity: 1; /* 悬停时显示 */
}

.info i {
  font-size: 14px;
  padding: 10px;
  z-index: 9999;
  transition: opacity 0.3s ease-in-out; /* 添加透明度过渡效果 */
  opacity: 0; /* 默认透明 */
}

#banner-t8 .img-box img {
  z-index: 0; /* 确保 img 在 info 之下 */
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

.btn-group .btn:focus {
  outline: none;
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
</style>
