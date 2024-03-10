<script setup lang="ts">
import { DemosTypes } from "./type";

const props = defineProps<{ demos: DemosTypes[] }>();
console.log(props.demos);
</script>

<template>
  <div flex="~ wrap gap-4 justify-between">
    <div
      class="card_t1 w-full md:w-8/17"
      v-for="demo in demos"
      :key="demo.name"
    >
      <iframe
        width="100%"
        height="400px"
        :src="demo.video"
        scrolling="no"
        border="0"
        frameborder="no"
        framespacing="0"
      />

      <div class="card__content">
        <p class="card__title">{{ demo.name }}</p>
        <p class="card__description">
          {{ demo.desc }}
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card_t1 {
  position: relative;
  height: 200px;
  background-color: #f2f2f2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 1000px;
  box-shadow: 0 0 0 5px #ffffff80;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.card_t1 iframe {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card_t1:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(255, 255, 255, 0.2);
}

.card__content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f2f2f2;
  transform: rotateX(-90deg);
  transform-origin: bottom;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card_t1:hover .card__content {
  transform: rotateX(0deg);
}

.card__title {
  margin: 0;
  font-size: 24px;
  color: #333;
  font-weight: 700;
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
