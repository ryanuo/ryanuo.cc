<script setup>
import { defineProps } from "vue";

defineProps({
  title: String,
  link: String,
  imageSrc: String,
  timeRange: String,
});
</script>

<template>
  <div flex justify-between>
    <a :href="link" target="_blank" style="border-bottom: 1px dashed #0005">
      <img
        style="
          filter: grayscale(100%);
          width: 18px;
          height: 18px;
          display: inline-block;
          margin: 4px 2px 4px 0px;
          border-radius: 4px;
        "
        :src="imageSrc"
      />
      {{ title }}
    </a>
    <span>{{ timeRange }}</span>
  </div>
</template>
