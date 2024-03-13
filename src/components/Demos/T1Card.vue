<script setup lang="ts">
import { DemosTypes } from "./type";

const props = defineProps<{ demos: Record<number, DemosTypes[]> }>();
console.log(props.demos);
const getInitialValues = () => ({
  teleportTo: "body",
  displayDirective: "if",
  hideOverlay: false,
  overlayTransition: "vfm-fade",
  contentTransition: "vfm-slide-up",
  clickToClose: true,
  escToClose: true,
  background: "non-interactive",
  lockScroll: true,
  reserveScrollBarGap: true,
  swipeToClose: "none",
  modelValue: false,
  content: {},
});

const options = ref(getInitialValues()) as any;
</script>

<template>
  <div
    v-for="index in Object.keys(props.demos)?.sort(
      (a, b) => Number(b) - Number(a)
    )"
  >
    <h2>{{ index }}</h2>
    <div flex="~ wrap gap-4 justify-between">
      <div
        class="card_t1 w-full md:w-8/17"
        v-for="demo in props.demos[Number(index)]"
        :key="demo.name"
      >
        <iframe
          v-if="demo.video"
          width="100%"
          height="400px"
          :src="demo.video"
          scrolling="no"
          border="0"
          frameborder="no"
          framespacing="0"
        />
        <img v-if="!demo.video && demo.img" :src="demo.img" class="px-1" />

        <div class="card__content">
          <p class="card__title">
            {{ demo.name }}
            <i
              class="i-ri-fullscreen-exit-fill full-w"
              @click="
                () => {
                  options.modelValue = true;
                  options.content = demo;
                }
              "
            />
          </p>
          <p class="card__description line-clamp-3">
            {{ demo.desc }}
          </p>
          <div class="text-right position-absolute bottom-2 right-2">
            <TechStack :techStack="demo.tags" uno="justify-end" />
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
  height: 200px;
  background-color: var(--c-demo-card-bg);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
  box-shadow: 0 0 0 1px #ffffff80;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  border: 0.1px solid #dadada;
}

.card_t1 iframe {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card_t1:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
  border: none;
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
  box-shadow: 0 0px 1px 0.5px #cccbcbc2;
}

.card__title {
  margin: 0;
  font-size: 24px;
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
