<script setup lang="ts">
import type { DemosTypes } from './type'

defineProps<{ demos: DemosTypes[] }>()
</script>

<template>
  <div flex="~ wrap gap-4 justify-between">
    <div v-for="demo in demos" :key="demo.name" class="card w-full">
      <div
        class="group relative h-56 flex flex-col items-start justify-start gap-2 rounded-lg bg-gray-900 p-4 shadow-gray-800 duration-500 hover:shadow-xl hover:-translate-y-2"
      >
        <div
          alt="image here"
          class="absolute h-1/2 w-1/2 rounded-lg bg-gray-800 shadow-md duration-700 -bottom-10 -right-10 group-hover:-translate-x-4 group-hover:-translate-y-4"
        />

        <div class="">
          <h2 class="mb-2 text-2xl text-gray-100 font-bold">
            Dark Card
          </h2>
          <p class="line-clamp-3 text-gray-200">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            convallis magna quis lectus fermentum, quis scelerisque orci
            pellentesque. Duis id porta justo. Sed ac enim id justo tincidunt
            hendrerit id ac lectus. Pellentesque maximus posuere tortor vitae
            consequat.
          </p>
        </div>
        <button
          class="mt-6 rounded bg-gray-800 p-2 px-6 text-gray-100 hover:bg-gray-700"
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
