<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router/auto'

defineProps({
  description: {
    type: String,
    required: true,
  },
})
const { locale } = useI18n()
const alia = computed(() => (locale.value === 'zh-CN' ? '/zh' : ''))
const inactiveStyle = 'opacity-20 hover:opacity-50'
const activeStyle = 'opacity-100 underline'

const route = useRoute()
</script>

<template>
  <div class="tabs m-auto mb-5 max-w-300 select-none at-lg:max-w-212 animate-none! op100!">
    <div mb-0 flex="~ gap-1 sm:row gap-2 sm:gap-3 wrap" text-2xl>
      <RouterLink to="/navs" class="!border-none" :class="route.path === `${alia}/navs` ? activeStyle : inactiveStyle">
        {{ $t("tabs.navs", "Navs") }}
      </RouterLink>
      <RouterLink
        to="/navs/libraries" class="!border-none" :class="route.path === `${alia}/navs/libraries` ? activeStyle : inactiveStyle
        "
      >
        {{ $t("tabs.libraries", "Libraries") }}
      </RouterLink>
      <RouterLink
        to="/navs/tools" class="!border-none" :class="route.path === `${alia}/navs/tools` ? activeStyle : inactiveStyle
        "
      >
        {{ $t("tabs.tools", "Tools") }}
      </RouterLink>
    </div>
    <div class="my-4 rounded-lg p1 text-gray-500!" style="font-size: 14px">
      {{ description }}
    </div>
  </div>
</template>

<style>
.tabs a {
  text-decoration: none;
}
</style>
