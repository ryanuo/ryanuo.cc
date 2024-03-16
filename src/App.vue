<script setup lang="ts">
const route = useRoute();
onBeforeMount(() => {
  import("./lang-modal.ts" as any);
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
