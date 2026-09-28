<script setup lang="ts">
import type { FilterKey } from './type'
import { TYPE_COLOR } from './type'

const props = defineProps<{
  query: string
  filter: FilterKey
  counts: Record<FilterKey, number>
}>()

const emit = defineEmits<{
  'update:query': [value: string]
  'update:filter': [value: FilterKey]
}>()

const filters: FilterKey[] = ['all', 'self', 'adapted', 'deployed']
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="key in filters"
        :key="key"
        type="button"
        class="inline-flex cursor-pointer items-center gap-1.5 border rounded-md px-3 py-1.5 text-sm transition"
        :class="props.filter === key
          ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900'"
        @click="emit('update:filter', key)"
      >
        <span
          v-if="key !== 'all'"
          class="h-1.5 w-1.5 rounded-full"
          :class="TYPE_COLOR[key]"
        />
        {{ $t(`demos.type.${key}`) }}
        <span class="op-60">{{ counts[key] }}</span>
      </button>
    </div>

    <label class="flex items-center gap-2 border border-neutral-200 rounded-md px-3 py-1.5 sm:w-64 dark:border-neutral-800 focus-within:border-neutral-400 dark:focus-within:border-neutral-600">
      <span class="i-ri-search-line shrink-0 text-neutral-400" />
      <input
        :value="query"
        type="search"
        :placeholder="$t('demos.search')"
        class="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
        @input="emit('update:query', ($event.target as HTMLInputElement).value)"
      >
    </label>
  </div>
</template>
