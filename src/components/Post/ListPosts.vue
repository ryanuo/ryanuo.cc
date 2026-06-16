<script lang="ts" setup>
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '~/hooks/useLanguage'
import { formatDateToMarDD } from '~/utils'

const routes = useRouter()
const { isChinese } = useLanguage()

const selectedCategory = ref('')

const postsRoutes = computed(() => {
  const lang = isChinese.value ? '/zh' : ''

  return routes
    .getRoutes()
    .filter((route) => {
      const { path, meta } = route
      return (
        path.includes('/posts')
        && path.startsWith(`${lang}/posts`)
        && !path.endsWith('.html')
        && !['/zh/posts', '/posts'].includes(path)
        && !(meta.frontmatter as FrontmatterPostType)?.isHidden
      )
    })
    .map((route) => {
      const { title, date, tags = [], categories = '' } = route.meta.frontmatter as FrontmatterPostType
      return { title, path: route.path, date, tags, category: categories }
    })
    .sort(
      (a, b) =>
        new Date(b.date as string).getTime()
          - new Date(a.date as string).getTime(),
    )
})

const CATEGORIES_CONFIG = {
  tech: { zh: '技术', en: 'Tech' },
  life: { zh: '生活', en: 'Life' },
  note: { zh: '笔记', en: 'Note' },
  series: { zh: '随笔', en: 'Series' },
}

const categories = computed(() => Object.entries(CATEGORIES_CONFIG).map(([key, { zh, en }]) => ({
  key,
  label: isChinese.value ? zh : en,
})))

function selectCategory(key: string) {
  selectedCategory.value = key
  if (typeof window !== 'undefined') {
    try {
      routes.replace({
        path: routes.currentRoute.value.path,
        query: routes.currentRoute.value.query,
        hash: key ? `#${key}` : undefined,
      })
    }
    catch {
      if (key)
        location.hash = `#${key}`
      else
        history.replaceState(null, '', location.pathname + location.search)
    }
  }
}

watch(() => routes.currentRoute.value.hash, (h) => {
  const clean = (h || '').replace('#', '')
  if (clean && categories.value.some((c: any) => c.key === clean))
    selectedCategory.value = clean
  else if (!clean)
    selectedCategory.value = ''
}, { immediate: true })

const filteredPosts = computed(() => {
  const cat = selectedCategory.value
  if (!cat)
    return postsRoutes.value

  const conf = (CATEGORIES_CONFIG as any)[cat]
  const label = conf ? String(isChinese.value ? conf.zh : conf.en || '').trim() : ''

  return postsRoutes.value.filter((p) => {
    const raw = p.category
    if (!raw)
      return false

    const cats = (Array.isArray(raw) ? raw : [raw]).map((c: any) => String(c).trim())

    if (cats.includes(cat))
      return true

    if (label) {
      if (isChinese.value) {
        if (cats.includes(label))
          return true
      }
      else {
        const target = label.toLowerCase()
        if (cats.some((c: string) => c.toLowerCase() === target))
          return true
      }
    }

    return false
  })
})

function isYearGroup(date?: string, preDate?: string) {
  if (!preDate)
    return true
  const year = dayjs(date).format('YYYY')
  const preYear = dayjs(preDate).format('YYYY')
  return year !== preYear
}
</script>

<template>
  <div>
    <div class="mb-4 flex flex-wrap items-center pl-[1.44em]">
      <button
        class="category-pill mb-2 mr-2 border rounded-full px-3 py-1 text-sm transition-colors duration-150"
        :class="[
          selectedCategory === ''
            ? 'bg-gray-900 text-white border-gray-900'
            : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 dark:bg-transparent dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800',
        ]" aria-pressed="false" @click="selectCategory('')"
      >
        {{ $t('post.all') }}
      </button>

      <button
        v-for="cat in categories" :key="cat.key"
        class="category-pill mb-2 mr-2 border rounded-full px-3 py-1 text-sm transition-colors duration-150" :class="[
          selectedCategory === cat.key
            ? 'bg-gray-900 text-white border-gray-900'
            : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 dark:bg-transparent dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800',
        ]" @click="selectCategory(cat.key)"
      >
        {{ cat.label }}
      </button>
    </div>

    <ul>
      <li v-for="(post, index) in filteredPosts" :key="post.path" class="before:content-none!">
        <div
          v-if="isYearGroup(post.date, filteredPosts[index - 1]?.date)"
          class="slide-enter pointer-events-none relative h20 select-none"
        >
          <span
            class="absolute left--3rem top--2rem text-8em color-transparent font-bold text-stroke-2 text-stroke-hex-aaa op10"
          >{{
            dayjs(post.date).format('YYYY') }}</span>
        </div>
        <a :href="post.path" class="font-normal" style="border-style: dashed">{{ post.title }}</a>
        <span class="ml-2 inline-flex text-sm text-gray-500 dark:text-gray-400">{{ formatDateToMarDD(post.date)
        }}</span>

        <!-- <div class="mt-1">
          <span
            v-for="tag in post.tags || []" :key="tag"
            class="mr-2 inline-block rounded bg-gray-100 px-2 py-0.5 text-sm dark:bg-gray-800"
          >{{ tag }}</span>
        </div> -->
      </li>
    </ul>
  </div>
</template>

<style scoped>
.category-pill:focus {
  outline: none;
}

.category-pill:focus-visible {
  box-shadow: 0 0 0 4px rgba(0, 95, 204, 0.18);
}

.category-pill:active {
  transform: translateY(0.5px);
}
</style>
