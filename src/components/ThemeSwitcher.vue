<script setup lang="ts">
import { ref } from 'vue'
import { themes } from '../../public/demos/typora-themes'
import { loadTheme } from '~/utils/markdown'

const isDark = useDark()

const themeType = computed(() => (isDark.value ? 'dark' : 'light'))
const themeName = ref('indigo')

function updateTheme() {
  loadTheme(themeType.value, themeName.value)
}

onMounted(() => {
  loadTheme(themeType.value, themeName.value)
})
</script>

<template>
  <div>
    <select v-model="themeName" @change="updateTheme">
      <option v-for="(_theme, name) in themes[themeType]" :key="name" :value="name">
        {{ name }}
      </option>
    </select>
  </div>
</template>
