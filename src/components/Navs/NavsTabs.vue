<script setup lang="ts">
import { useLanguage } from '~/hooks/useLanguage'

defineProps({
  description: {
    type: String,
    required: true,
  },
})

const { aliaRoute } = useLanguage()
const inactiveStyle = 'opacity-20 hover:opacity-50'
const activeStyle = 'opacity-100 underline'

const route = useRoute()
</script>

<template>
  <div class="tabs m-auto mb-5 max-w-300 select-none at-lg:max-w-212 animate-none! op100!">
    <div mb-0 flex="~ gap-1 sm:row gap-2 sm:gap-3 wrap" text-2xl>
      <RouterLink :to="`${aliaRoute}/navs`" class="!border-none" :class="route.path === `${aliaRoute}/navs` ? activeStyle : inactiveStyle">
        {{ $t("tabs.navs", "Navs") }}
      </RouterLink>
      <RouterLink
        :to="`${aliaRoute}/navs/libraries`" class="!border-none" :class="route.path === `${aliaRoute}/navs/libraries` ? activeStyle : inactiveStyle
        "
      >
        {{ $t("tabs.libraries", "Libraries") }}
      </RouterLink>
      <RouterLink
        :to="`${aliaRoute}/navs/tools`" class="!border-none" :class="route.path === `${aliaRoute}/navs/tools` ? activeStyle : inactiveStyle
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
