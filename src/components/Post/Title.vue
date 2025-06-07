<script setup lang="ts">
defineProps<{
  title: string
}>()
const isShowTitle = ref(false)
const { y } = useWindowScroll()

// 增加滚动方向判断（向上/向下滚动）
const isScrollDown = ref(true)
let prevScrollY = 0

watch(y, (currentVal) => {
  // 判断滚动方向
  isScrollDown.value = currentVal > prevScrollY
  prevScrollY = currentVal

  if (currentVal > 10) {
    isShowTitle.value = true
  }
  else {
    isShowTitle.value = false
  }
})
</script>

<template>
  <transition
    name="slide-fade"
    enter-active-class="slide-fade-enter-active"
    leave-active-class="slide-fade-leave-active"
  >
    <div
      v-show="isShowTitle"
      class="fixed left-0 right-0 top-0 z-99 w-full bg-[#fcfcfde6]/50 py-4 text-center font-bold opacity-100 backdrop-blur-md dark:bg-[#050505]/50"
      :class="[
        { 'transform translateY-0': isShowTitle && isScrollDown },
        { 'transform translateY-[-100px]': isShowTitle && !isScrollDown },
      ]"
    >
      {{ title }}
    </div>
  </transition>
</template>

<style scoped>
/* 自定义过渡动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-in-out;
  will-change: transform, opacity;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* 向下滚动显示时的动画（从底部滑入） */
@keyframes slide-down {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 向上滚动隐藏时的动画（滑出顶部） */
@keyframes slide-up {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100px);
    opacity: 0;
  }
}
</style>
