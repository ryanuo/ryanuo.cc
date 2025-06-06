<script setup lang="ts">
import type { DemosTypes } from '../type'
import { useModalOptions } from '../hooks/useModalOptions'

defineProps<{ demos: Record<number, DemosTypes[]> }>()

const { options } = useModalOptions()
</script>

<template>
  <div class="slide-enter-content prose m-auto">
    <div v-for="index in Object.keys(demos)?.sort((a, b) => Number(b) - Number(a))" :key="index" class="relative">
      <div class="text-center">
        <span
          class="border-b-1.5 border-dashed text-4em color-transparent font-bold text-stroke-2 text-stroke-hex-aaa op30"
        >
          {{ index }}
        </span>
      </div>
      <div flex="~ wrap gap-4 justify-between">
        <div v-for="demo in demos[Number(index)]" :key="demo.name" class="card_t1 w-full md:w-8/17">
          <iframe
            v-if="demo.video" width="100%" height="400px" :src="demo.video" scrolling="no" border="0"
            frameborder="no" framespacing="0"
          />
          <img v-if="!demo.video && demo.img" :src="demo.img" class="px-1">

          <div class="card__content">
            <p class="card__title">
              {{ demo.name }}
              <i
                class="i-ri-fullscreen-exit-fill absolute right-0 top-[10px] text-[14px] transition-all duration-[0.6s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[1.2]" @click="() => {
                  options.modelValue = true;
                  options.content = demo;
                }
                "
              />
            </p>
            <p class="card__description line-clamp-3">
              {{ demo.desc }}
            </p>
            <div class="position-absolute bottom-2 right-2 text-right">
              <TechStack :tech-stack="demo.tags" uno="justify-end" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalCard :options="options" />
</template>

<style scoped>
.full-w {
  position: absolute;
  top: 10px;
  right: 0;
  font-size: 14px;
}

.full-w:hover {
  /* 放大 */
  transform: scale(1.2);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card_t1 {
  position: relative;
  height: 180px;
  background-color: var(--c-demo-card-bg);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
  /* box-shadow: 0 0 0 2px #ffffff80; */
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  border: 0.1px solid #dadada8e;
}

.card_t1 iframe {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card_t1:hover {
  transform: scale(1.05);
  border: 0.1px solid #dadada8e;
}

.card__content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: var(--c-demo-card-bg);
  transform: rotateX(-90deg);
  transform-origin: bottom;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card_t1:hover .card__content {
  transform: rotateX(0deg);
}

.card__title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  position: relative;
}

.card_t1:hover iframe {
  scale: 0;
}

.card__description {
  margin: 10px 0 0;
  font-size: 14px;
  color: #777;
  line-height: 1.4;
}
</style>
