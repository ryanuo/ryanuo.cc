<script setup lang="ts">
import type { DemosTypes } from './type'

// 定义组件 props
defineProps<{ demos: Record<number, DemosTypes[]> }>()

// 当前主题
const currentTheme = ref('t7')

// const getRadomTheme = () => {
//   const themes = ["t1", "t2", "t3", "t4", "t5", "t6"];
//   const randomIndex = Math.floor(Math.random() * themes.length);
//   currentTheme.value = themes[randomIndex];
// };

watchEffect(() => {
  // getRadomTheme();
})
</script>

<template>
  <T1Card v-if="currentTheme === 't1'" :demos="demos" />
  <!-- <T2Card v-if="currentTheme === 't2'" :demos="demos" />
  <T3Card v-if="currentTheme === 't3'" :demos="demos" />
  <T4Card v-if="currentTheme === 't4'" :demos="demos" />
  <T5Card v-if="currentTheme === 't5'" :demos="demos" />
  <T6Card v-if="currentTheme === 't6'" :demos="demos" /> -->
  <T7Card v-if="currentTheme === 't7'" :demos="demos" />
</template>
