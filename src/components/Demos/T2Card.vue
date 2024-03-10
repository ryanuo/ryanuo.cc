<script setup lang="ts">
import { DemosTypes } from "./type";

const props = defineProps<{ demos: DemosTypes[] }>();
console.log(props.demos);
</script>

<template>
  <div flex="~ wrap gap-4 justify-between">
    <article
      class="relative flex w-full flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md md:w-8/17 cursor-pointer"
      v-for="demo in demos"
      :key="demo.name"
    >
      <div
        class="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r from-blue-500 to-blue-600"
      ></div>
      <div class="p-6">
        <h5
          class="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased"
        >
          Tailwind card
        </h5>
        <p
          class="block font-sans text-base font-light leading-relaxed text-inherit antialiased"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc felis
          ligula.
        </p>
      </div>
      <div class="p-6 pt-0">
        <button
          data-ripple-light="true"
          type="button"
          class="select-none rounded-lg bg-blue-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Read More
        </button>
      </div>
    </article>
  </div>
</template>
<style scoped>
.project-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  bottom: -22px;
  padding: 0 10px;
}

.project-title {
  font-weight: 500;
  font-size: 1.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: black;
}

.lighter {
  font-size: 0.9em;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag {
  font-weight: lighter;
  color: grey;
}

/*DELETE THIS TWO LINE*/
.delete {
  background-color: #b2b2fd;
}

.card-img div {
  width: 90%;
}
/*IF USING IMAGES*/

.card {
  background-color: white;
  color: black;
  max-height: 330px;
  border-radius: 8px;
  box-shadow:
    rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  cursor: pointer;
  padding-bottom: 10px;
}

.card-img {
  position: relative;
  top: -20px;
  height: 100px;
  display: flex;
  justify-content: center;
}

/* Change the .card-img div to .card-img img to use img*/
.card-img a,
.card-img div {
  height: 150px;
  width: 90%;
  /* Change this width here to change the width of the color/image */
  object-fit: cover;
  border-radius: 8px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.card-imgs {
  transition: all 0.5s;
}
</style>
