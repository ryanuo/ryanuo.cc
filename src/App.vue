<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <NavBar />
  <main class="px-7 py-10 of-x-hidden">
    <RouterView />
    <Footer v-if="route.path" />
  </main>
</template>

<style scoped></style>
