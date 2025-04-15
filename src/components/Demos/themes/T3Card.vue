<script setup lang="ts">
import { useModalOptions } from '../hooks/useModalOptions'
import type { DemosTypes } from '../type'
import { launchInNewWindow } from '~/utils'

defineProps<{ demos: {
  [key: number]: DemosTypes[]
} }>()
const { options } = useModalOptions()
</script>

<template>
  <div class="prose slide-enter-content m-auto">
    <div v-for="[key, demoList] in Object.entries(demos).sort((a, b) => Number(b[0]) - Number(a[0]))" :key="key" class="my-3">
      <div class="text-center text-4em color-transparent font-bold text-stroke-2 text-stroke-hex-aaa op30">
        {{ key }}
      </div>
      <div flex="~ wrap gap-4 justify-between">
        <div v-for="demo in demoList" :key="demo.name" class="main w-full md:w-8/17">
          <div
            class="t3-card"
            :style="`
            background-image: url(${demo.img});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;`"
          >
            <div
              class="fl" @click="() => {
                options.modelValue = true;
                options.content = demo;
              }"
            >
              <div class="fullscreen">
                <svg viewBox="0 0 100 100" class="fullscreen_svg">
                  <path
                    d="M3.563-.004a3.573 3.573 0 0 0-3.527 4.09l-.004-.02v28.141c0 1.973 1.602 3.57 3.57 3.57s3.57-1.598 3.57-3.57V12.218v.004l22.461 22.461a3.571 3.571 0 0 0 6.093-2.527c0-.988-.398-1.879-1.047-2.523L12.218 7.172h19.989c1.973 0 3.57-1.602 3.57-3.57s-1.598-3.57-3.57-3.57H4.035a3.008 3.008 0 0 0-.473-.035zM96.333 0l-.398.035.02-.004h-28.16a3.569 3.569 0 0 0-3.57 3.57 3.569 3.569 0 0 0 3.57 3.57h19.989L65.323 29.632a3.555 3.555 0 0 0-1.047 2.523 3.571 3.571 0 0 0 6.093 2.527L92.83 12.221v19.985a3.569 3.569 0 0 0 3.57 3.57 3.569 3.569 0 0 0 3.57-3.57V4.034v.004a3.569 3.569 0 0 0-3.539-4.043l-.105.004zM3.548 64.23A3.573 3.573 0 0 0 .029 67.8v28.626-.004l.016.305-.004-.016.004.059v-.012l.039.289-.004-.023.023.121-.004-.023c.074.348.191.656.34.938l-.008-.02.055.098-.008-.02.148.242-.008-.012.055.082-.008-.012c.199.285.43.531.688.742l.008.008.031.027.004.004c.582.461 1.32.742 2.121.762h.004l.078.004h28.61a3.569 3.569 0 0 0 3.57-3.57 3.569 3.569 0 0 0-3.57-3.57H12.224l22.461-22.461a3.569 3.569 0 0 0-2.492-6.125l-.105.004h.008a3.562 3.562 0 0 0-2.453 1.074L7.182 87.778V67.793a3.571 3.571 0 0 0-3.57-3.57h-.055.004zm92.805 0a3.573 3.573 0 0 0-3.519 3.57v19.993-.004L70.373 65.328a3.553 3.553 0 0 0-2.559-1.082h-.004a3.573 3.573 0 0 0-3.566 3.57c0 1.004.414 1.91 1.082 2.555l22.461 22.461H67.802a3.57 3.57 0 1 0 0 7.14h28.606c.375 0 .742-.059 1.082-.168l-.023.008.027-.012-.02.008.352-.129-.023.008.039-.02-.02.008.32-.156-.02.008.023-.016-.008.008c.184-.102.34-.207.488-.32l-.008.008.137-.113-.008.004.223-.211.008-.008c.156-.164.301-.34.422-.535l.008-.016-.008.016.008-.02.164-.285.008-.02-.008.016.008-.02c.098-.188.184-.406.246-.633l.008-.023-.004.008.008-.023a3.44 3.44 0 0 0 .121-.852v-.004l.004-.078V67.804a3.569 3.569 0 0 0-3.57-3.57h-.055.004z"
                  />
                </svg>
              </div>
            </div>
            <div class="t3-card_content">
              <label class="switch_738">
                <input type="checkbox" class="chk_738">
                <span class="slider_738" />
              </label>
            </div>
            <div class="t3-card_back" />
          </div>
          <div class="data">
            <div class="img">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox="0 0 80 80"
              />
            </div>
            <div class="text">
              <div class="text_m">
                {{ demo.name }}
              </div>
              <div class="text_s">
                {{ demo.tags.join('、') }}
              </div>
            </div>
          </div>
          <div class="btns">
            <div class="likes">
              <span
                class="i-il-github text-white"
                @click="() => {
                  launchInNewWindow(demo.link || demo.readme)
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalCard :options="options" />
</template>

<style scoped>
.t3-card {
  width: 15em;
  height: 10em;
  border-radius: 7px;
  cursor: pointer;
}

.fl {
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  transition: 0.2s ease-in-out;
}

.fl:hover .fullscreen {
  scale: 1.2;
}

.fl:hover .fullscreen_svg {
  fill: white;
}

.fullscreen {
  width: 1.5em;
  height: 1.5em;
  border-radius: 5px;
  background-color: #727890;
  margin: 1em;
  margin-right: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s ease-in-out;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
}

.fullscreen_svg {
  width: 15px;
  height: 15px;
  fill: rgb(177, 176, 176);
  transition: 0.2s ease-in-out;
}

.t3-card_back {
  position: absolute;
  width: 15em;
  height: 13em;
  background-color: rgba(30, 31, 38, 0.575);
  border-radius: 7px;
  margin-top: -5em;
  margin-left: 0.7em;
  transition: 0.2s ease-in-out;
  z-index: -1;
}

.main:hover .t3-card_back {
  margin-top: -6.25em;
  margin-left: 0em;
  scale: 1.1;
  height: 15.25em;
  cursor: pointer;
}

.main:hover .fl {
  opacity: 1;
  cursor: pointer;
  margin-right: 0.5em;
}

.data {
  display: flex;
  flex-direction: row;
  margin-top: 1em;
}

.img {
  width: 2.25em;
  height: 2.25em;
  background-color: #252525;
  border-radius: 5px;
  overflow: hidden;
}

.text {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 0.5em;
  font-family: Montserrat;
  color: white;
}

.text_m {
  font-weight: bold;
  font-size: 0.9em;
}

.text_s {
  font-size: 0.7em;
}

.btns {
  display: flex;
  width: 80%;
  justify-content: flex-end;
  transition: 0.2s ease-in-out;
}

.likes {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  opacity: 0;
  transition: 0.2s ease-in-out;
  padding: 0 0.25em;
  cursor: pointer;
}

.likes:hover {
  background-color: #727890;
}

.main:hover .likes {
  margin-top: 0.5em;
  opacity: 1;
}

.main:hover .comments {
  margin-top: 0.5em;
  opacity: 1;
}

.main:hover .views {
  margin-top: 0.5em;
  opacity: 1;
}

/* The Main Switch */

.t3-card_content {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* The switch - the box around the slider */
.switch_738 {
  font-size: 13px;
  position: relative;
  display: inline-block;
  width: 1.2em;
  height: 3.3em;
}

/* Hide default HTML checkbox */
.switch_738 .chk_738 {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider_738 {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 5px;
}

.slider_738:before {
  position: absolute;
  content: '';
  height: 0.5em;
  width: 2.4em;
  border-radius: 5px;
  left: -0.6em;
  top: 0.2em;
  background-color: white;
  box-shadow: 0 6px 7px rgba(0, 0, 0, 0.3);
  transition: 0.4s;
}

.slider_738:before,
.slider_738:after {
  content: '';
  display: block;
}

.slider_738:after {
  background:
    linear-gradient(transparent 50%, rgba(255, 255, 255, 0.15) 0) 0 50% / 50%
      100%,
    repeating-linear-gradient(
        90deg,
        rgb(255, 255, 255) 0,
        rgb(255, 255, 255),
        rgb(255, 255, 255) 20%,
        rgb(255, 255, 255) 20%,
        rgb(255, 255, 255) 40%
      )
      0 50% / 50% 100%,
    radial-gradient(circle at 50% 50%, rgb(255, 255, 255) 25%, transparent 26%);
  background-repeat: no-repeat;
  border: 0.25em solid transparent;
  border-left: 0.4em solid #ffffff;
  border-right: 0 solid transparent;
  transition:
    border-left-color 0.1s 0.3s ease-out,
    transform 0.3s ease-out;
  transform: translateX(-22.5%) rotate(90deg);
  transform-origin: 25% 50%;
  position: relative;
  top: 0.5em;
  left: 0.55em;
  width: 2em;
  height: 1em;
  box-sizing: border-box;
}

.chk_738:checked + .slider_738 {
  background-color: rgb(132, 235, 132);
}

.chk_738:focus + .slider_738 {
  box-shadow: 0 0 1px rgb(132, 235, 132);
}

.chk_738:checked + .slider_738:before {
  transform: translateY(2.3em);
}

.chk_738:checked + .slider_738:after {
  transform: rotateZ(90deg) rotateY(180deg) translateY(0.45em)
    translateX(-1.4em);
}
</style>
