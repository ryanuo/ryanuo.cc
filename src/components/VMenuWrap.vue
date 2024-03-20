<script lang="ts" setup>
import { slug } from "@/utils";

defineProps<{
  title: string;
  menus: {
    name: string;
    link: string;
  }[];
  icon?: string;
  width?: string;
}>();
</script>

<template>
  <VMenu :delay="200">
    <a href="javascript:void(0)">
      <span class="lt-md:hidden cursor-pointer">{{ title }}</span>
      <div :class="['md:hidden', icon, 'cursor-pointer']"></div>
    </a>
    <template #popper>
      <ul :class="['w-auto', width, 'p-1.6']">
        <li v-for="item in menus" :key="slug(item.name)" class="li_wrap">
          <a
            v-if="item.link.startsWith('http')"
            :href="item.link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ item.name }}
          </a>
          <RouterLink v-else :to="item.link" :title="item.name">
            <span>{{ item.name }}</span>
          </RouterLink>
        </li>
      </ul>
    </template>
  </VMenu>
</template>
<style scoped>
.li_wrap {
  transition:
    background-color 0.25s,
    color 0.25s;
  padding: 0.18rem 0.4rem;
  border-radius: 0.41rem;
  white-space: nowrap;
  cursor: pointer;
}

.li_wrap a {
  display: block;
  width: 100%;
}

.li_wrap:hover {
  background-color: rgba(142, 150, 170, 0.14);
}

.dark .li_wrap:hover {
  background-color: rgba(101, 117, 133, 0.16);
}
</style>
