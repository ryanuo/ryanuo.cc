<script setup lang="ts">
import { useModalOptions } from '../hooks/useModalOptions'
import type { DemosTypes } from '../type'

const props = defineProps<{ demos: Record<number, DemosTypes[]> }>()

const { options } = useModalOptions()

const allYears = computed(() => Object.keys(props.demos).map(year => Number(year)).sort((a, b) => b - a))

const selectedYears = ref<number[]>(allYears.value)

const demosArray = computed(() => {
  return Object.keys(props.demos)
    .sort((a, b) => Number(b) - Number(a))
    .flatMap(key => props.demos[Number(key)].map(demo => ({
      ...demo,
      year: Number(key),
      img: demo.img || '/demos/zhanweitu.png',
    })))
    .filter(demo => selectedYears.value.length === 0 || selectedYears.value.includes(demo.year))
})

function toggleYear(year: number) {
  if (selectedYears.value.includes(year)) {
    if (selectedYears.value.length > 1) {
      selectedYears.value = selectedYears.value.filter(y => y !== year)
    }
  }
  else {
    selectedYears.value.push(year)
  }
}

function selectAllYears() {
  selectedYears.value = [...allYears.value]
}

function deselectAllYears() {
  if (selectedYears.value.length > 1) {
    selectedYears.value = [allYears.value[0]] // 保证至少选中一个
  }
}
</script>

<template>
  <div class="mx-auto p-2 container sm:p-4 dark:text-gray-800">
    <h2 class="mb-4 text-2xl font-semibold leading-tight">
      <p> Hello! 👋🏾This is my portfolio page！</p>
      <div class="checkbox-wrapper-30 inline-block">
        <span class="checkbox">
          <input
            type="checkbox" :checked="selectedYears.length === allYears.length"
            :indeterminate="selectedYears.length > 0 && selectedYears.length < allYears.length"
            @change="selectedYears.length === allYears.length ? deselectAllYears() : selectAllYears()"
          >
          <svg>
            <use xlink:href="#checkbox-30" class="checkbox" />
          </svg>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" style="display:none">
          <symbol id="checkbox-30" viewBox="0 0 22 22">
            <path
              fill="none" stroke="currentColor"
              d="M5.5,11.3L9,14.8L20.2,3.3l0,0c-0.5-1-1.5-1.8-2.7-1.8h-13c-1.7,0-3,1.3-3,3v13c0,1.7,1.3,3,3,3h13 c1.7,0,3-1.3,3-3v-13c0-0.4-0.1-0.8-0.3-1.2"
            />
          </symbol>
        </svg>
      </div>
    </h2>
    <div class="mb-4 text-xs">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="year in allYears" :key="year" class="cursor-pointer rounded p-1 focus:outline-none" :class="[
            selectedYears.includes(year)
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          ]" @click="toggleYear(year)"
        >
          {{ year }}
        </button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full text-xs">
        <colgroup>
          <col>
          <col>
          <col>
          <col>
          <col>
        </colgroup>
        <thead class="dark:bg-gray-300">
          <tr class="text-left">
            <th class="p-3">
              Year
            </th>
            <th class="p-3">
              Name
            </th>
            <th class="p-3">
              Description
            </th>
            <th class="p-3">
              Tags
            </th>
            <th class="p-3">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="demo in demosArray" :key="demo.name"
            class="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50"
          >
            <td class="p-3">
              <p>{{ demo.year }}</p>
            </td>
            <td class="p-3">
              <a :href="demo.link" target="_blank" class="text-blue-500 underline">
                {{ demo.name }}
              </a>
            </td>
            <td class="p-3">
              <p>{{ demo.desc }}</p>
            </td>
            <td class="p-3">
              <ul>
                <li
                  v-for="tag in demo.tags" :key="tag"
                  class="mb-1 mr-1 inline-block rounded bg-gray-200 px-2 py-1 text-xs"
                >
                  {{ tag }}
                </li>
              </ul>
            </td>
            <td class="p-3">
              <i
                class="i-ri-fullscreen-exit-fill cursor-pointer transition-all duration-[0.6s] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-[1.2]"
                @click="() => {
                  options.modelValue = true;
                  options.content = demo;
                }
                "
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ModalCard :options="options" />
</template>

<style>
.checkbox-wrapper-30 .checkbox {
  --bg: #fff;
  --brdr: #d1d6ee;
  --brdr-actv: #1e2235;
  --brdr-hovr: #bbc1e1;
  --dur: calc((var(--size, 2) / 2) * 1s);
  display: inline-block;
  width: calc(var(--size, 1) * 16px);
  position: relative;
}

.checkbox-wrapper-30 .checkbox:after {
  content: '';
  width: 100%;
  padding-top: 100%;
  display: block;
}

.checkbox-wrapper-30 .checkbox > * {
  position: absolute;
}

.checkbox-wrapper-30 .checkbox input {
  -webkit-appearance: none;
  -moz-appearance: none;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  background-color: var(--bg);
  border-radius: calc(var(--size, 1) * 4px);
  border: calc(var(--newBrdr, var(--size, 1)) * 1px) solid;
  color: var(--newBrdrClr, var(--brdr));
  outline: none;
  margin: 0;
  padding: 0;
  transition: all calc(var(--dur) / 3) linear;
}

.checkbox-wrapper-30 .checkbox input:hover,
.checkbox-wrapper-30 .checkbox input:checked {
  --newBrdr: calc(var(--size, 1) * 2);
}

.checkbox-wrapper-30 .checkbox input:hover {
  --newBrdrClr: var(--brdr-hovr);
}

.checkbox-wrapper-30 .checkbox input:checked {
  --newBrdrClr: var(--brdr-actv);
  transition-delay: calc(var(--dur) / 1.3);
}

.checkbox-wrapper-30 .checkbox input:checked + svg {
  --dashArray: 16 93;
  --dashOffset: 109;
}

.checkbox-wrapper-30 .checkbox svg {
  fill: none;
  left: 0;
  pointer-events: none;
  stroke: var(--stroke, var(--border-active));
  stroke-dasharray: var(--dashArray, 93);
  stroke-dashoffset: var(--dashOffset, 94);
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2px;
  top: 0;
  transition:
    stroke-dasharray var(--dur),
    stroke-dashoffset var(--dur);
}

.checkbox-wrapper-30 .checkbox svg,
.checkbox-wrapper-30 .checkbox input {
  display: block;
  height: 100%;
  width: 100%;
}
</style>
