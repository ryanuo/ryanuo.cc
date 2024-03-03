<script setup lang="ts">
import { useRoute } from "vue-router";
defineProps({
  description: {
    type: String,
    required: true,
  },
});

const inactiveStyle = "opacity-20 hover:opacity-50";
const activeStyle = "opacity-100 underline";

const route = useRoute();
</script>

<template>
  <div class="tabs max-w-300 m-auto mb-5 select-none animate-none! op100!">
    <div mb-0 flex="~ col gap-1 sm:row sm:gap-3 wrap" text-3xl>
      <RouterLink
        to="/navs"
        class="!border-none"
        :class="route.path === '/navs' ? activeStyle : inactiveStyle"
      >
        Navs
      </RouterLink>
      <RouterLink
        to="/navs/libraries"
        class="!border-none"
        :class="route.path === '/navs/libraries' ? activeStyle : inactiveStyle"
      >
        Libraries
      </RouterLink>
      <RouterLink
        to="/navs/tools"
        class="!border-none"
        :class="route.path === '/navs/tools' ? activeStyle : inactiveStyle"
      >
        Tools
      </RouterLink>
    </div>
    <div class="my-4 p1 rounded-lg text-gray-500!" style="font-size: 14px">
      - {{ description }}
    </div>
  </div>
</template>

<style>
.tabs a {
  text-decoration: none;
}
</style>
