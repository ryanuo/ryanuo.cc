<script setup lang="ts">
import { useImagePreview } from "@/hooks/useImagePreview";
import mermaid from "mermaid";
const route = useRoute();
const { imageModel } = useImagePreview();

onBeforeMount(() => {
  import("./lang-modal.ts" as any);
});

window.addEventListener("error", function (event) {
  // 检查是否是特定错误，比如 "Failed to load module script"
  if (event.message.includes("Failed to load module script")) {
    // 刷新页面
    window.location.reload();
  }
});

onMounted(async () => {
  mermaid.initialize({ startOnLoad: false });
  await mermaid.run();
});

onKeyStroke("Escape", (e) => {
  if (imageModel.value) {
    imageModel.value = undefined;
    e.preventDefault();
  }
});
</script>

<template>
  <NavBar />
  <main class="px-7 py-10 of-x-hidden">
    <RouterView />
    <Footer v-if="route.path" />
  </main>

  <Transition name="fade">
    <div
      v-if="imageModel"
      fixed
      top-0
      left-0
      right-0
      bottom-0
      z-500
      p-6
      backdrop-blur-7
      @click="imageModel = undefined"
    >
      <div absolute top-0 left-0 right-0 bottom-0 bg-black:30 z--1 />
      <img
        :src="imageModel.src"
        :alt="imageModel.alt"
        w-full
        h-full
        object-contain
      />
    </div>
  </Transition>
</template>

<style scoped></style>
