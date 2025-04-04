<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    default: '',
  },
  click: {
    type: Function,
    default: () => {},
  },
})

// 计算属性 - buttonPosition
const buttonPosition = computed(() => {
  return 'fixed bottom-3 right-3 z-100 h-10 w-10 rounded-full op30 transition duration-300 print:hidden hover-bg-hex-8883 hover:op100'
})

const buttonClassProp = computed(() => props.class)
function handleClick() {
  props.click()
}
</script>

<template>
  <button
    :title="title"
    :class="[buttonPosition, buttonClassProp]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
