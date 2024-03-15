<script lang="ts" setup>
import { ModalsContainer, VueFinalModal } from "vue-final-modal";

defineProps<{
  options: any;
}>();
</script>
<template>
  <VueFinalModal
    v-model="options.modelValue"
    :teleport-to="options.teleportTo"
    :display-directive="options.displayDirective"
    :hide-overlay="options.hideOverlay"
    :overlay-transition="options.overlayTransition"
    :content-transition="options.contentTransition"
    :click-to-close="options.clickToClose"
    :esc-to-close="options.escToClose"
    :background="options.background"
    :lock-scroll="options.lockScroll"
    :reserve-scroll-bar-gap="options.reserveScrollBarGap"
    :swipe-to-close="options.swipeToClose"
    class="flex justify-center items-center"
    content-class="max-w-90 md:max-w-5/6 md:max-h-15/16 md:min-w-4/5 mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
  >
    <h1 class="text-xl flex justify-between border-b pb-2">
      {{ options.content.name }}
      <div>
        <a
          :href="options.content.link"
          i-akar-icons-github-fill
          target="_blank"
        />
        <a
          v-if="options.content.readme"
          class="i-fluent-more-48-filled m-1"
          :href="options.content.readme"
          target="_blank"
        />
        <span
          class="i-material-symbols-close-small-outline cursor-pointer hover:scale-120"
          @click="options.modelValue = false"
        />
      </div>
    </h1>
    <p>
      {{ options.content.desc }}
    </p>
    <div class="flex justify-center items-center">
      <img
        class="w-full md:h-160 rounded at-lg:h-70vh"
        :src="options.content.img"
        v-if="options.content.img && !options.content.video"
      />
      <iframe
        :src="options.content.video"
        v-if="options.content.video"
        class="w-full h-80 md:h-160 at-lg:h-70vh"
      />
    </div>
  </VueFinalModal>

  <ModalsContainer />
</template>
