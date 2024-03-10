<script setup lang="ts">
import { DemosTypes } from "./type";

const props = defineProps<{ demos: DemosTypes[] }>();
console.log(props.demos);
</script>

<template>
  <div flex="~ wrap gap-4 justify-between">
    <div class="card w-full" v-for="demo in demos" :key="demo.name">
      <div
        class="group flex flex-col justify-start items-start gap-2 h-56 duration-500 relative rounded-lg p-4 bg-gray-900 hover:-translate-y-2 hover:shadow-xl shadow-gray-800"
      >
        <div
          alt="image here"
          class="absolute duration-700 shadow-md group-hover:-translate-y-4 group-hover:-translate-x-4 -bottom-10 -right-10 w-1/2 h-1/2 rounded-lg bg-gray-800"
        ></div>

        <div class="">
          <h2 class="text-2xl font-bold mb-2 text-gray-100">Dark Card</h2>
          <p class="text-gray-200 line-clamp-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            convallis magna quis lectus fermentum, quis scelerisque orci
            pellentesque. Duis id porta justo. Sed ac enim id justo tincidunt
            hendrerit id ac lectus. Pellentesque maximus posuere tortor vitae
            consequat.
          </p>
        </div>
        <button
          class="hover:bg-gray-700 bg-gray-800 text-gray-100 mt-6 rounded p-2 px-6"
        >
          Explore
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.card {
  cursor: pointer;
}
</style>
