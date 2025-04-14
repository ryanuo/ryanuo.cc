<script setup lang="ts">
import type { DemosTypes } from './type'

defineProps<{ demos: Record<number, DemosTypes[]> }>()

const currentTheme = ref('t2')
const themes: string[] = ['t1', 't2', 't8']
let currentIndex = themes.findIndex(item => item === currentTheme.value)

function getRadomTheme() {
  currentIndex = (currentIndex + 1) % themes.length
  currentTheme.value = themes[currentIndex]
}

const { y: scroll } = useWindowScroll()
const buttonClass = computed(() => {
  return scroll.value > 300 ? 'bottom-14! transition-all' : ''
})
</script>

<template>
  <BottomIcon
    title="Change theme"
    :class="buttonClass"
    :click="getRadomTheme"
  >
    <i i-ant-design-skin-outlined />
  </BottomIcon>
  <T1Card v-if="currentTheme === 't1'" :demos="demos" />
  <T2Card v-if="currentTheme === 't2'" :demos="demos" />
  <!-- <T3Card v-if="currentTheme === 't3'" :demos="demos" /> -->
  <!-- <T4Card v-if="currentTheme === 't4'" :demos="demos" /> -->
  <!-- <T5Card v-if="currentTheme === 't5'" :demos="demos" /> -->
  <!-- <T6Card v-if="currentTheme === 't6'" :demos="demos" />  -->
  <!-- <T7Card v-if="currentTheme === 't7'" :demos="demos" /> -->
  <T8Card v-if="currentTheme === 't8'" :demos="demos" />
</template>
