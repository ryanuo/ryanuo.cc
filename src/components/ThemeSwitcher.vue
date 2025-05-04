<script setup lang="ts">
import { ref } from 'vue'
import { themes } from '../../public/demos/typora-themes'
import { loadTheme } from '~/utils/markdown'

const isDark = useDark()

const themeType = computed(() => (isDark.value ? 'dark' : 'light'))
const themeName = ref('githubLight')

function updateTheme() {
  loadTheme(themeType.value, themeName.value)
}

onMounted(() => {
  loadTheme(themeType.value, themeName.value)
})
</script>

<template>
  <div class="my-5">
    <select v-model="themeName" class="theme-switcher" @change="updateTheme">
      <option v-for="(_theme, name) in themes[themeType]" :key="name" :value="name">
        {{ name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.theme-switcher {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  font-size: 14px;
  outline: none;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.theme-switcher:focus {
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.theme-switcher option {
  padding: 4px;
}
</style>
