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
    default: () => { },
  },
})

const buttonPosition = computed(() => {
  return [
    // 定位类
    'fixed bottom-3 right-3 z-100',
    // 尺寸类
    'h-10 w-10 rounded-full',
    // 样式类
    'op30 transition duration-300',
    // hover 类
    'hover:bg-hex-8883 hover:op100',
    // 其他类
    'print:hidden outline-none!',
  ].join(' ')
})

const buttonClassProp = computed(() => props.class)
function handleClick() {
  props.click()
}
</script>

<template>
  <button :title="title" :class="[buttonPosition, buttonClassProp]" @click="handleClick">
    <slot />
  </button>
</template>
