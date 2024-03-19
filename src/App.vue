<script setup lang="ts">
const route = useRoute();
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
</script>

<template>
  <NavBar />
  <main class="px-7 py-10 of-x-hidden">
    <RouterView />
    <Footer v-if="route.path" />
  </main>
</template>

<style scoped></style>
