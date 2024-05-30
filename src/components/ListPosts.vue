<script lang="ts" setup>
import dayjs from 'dayjs'
import { useLanguage } from '~/hooks/useLanguage'
import { formatDateToMarDD } from '~/utils'

const routes = useRouter()
const { isChinese } = useLanguage()

const postsRoutes = computed(() => {
  const lang = isChinese.value ? '/zh' : ''

  return routes
    .getRoutes()
    .filter((route) => {
      const { path } = route
      return (
        path.includes('/posts')
        && path.startsWith(`${lang}/posts`)
        && !path.endsWith('.html')
        && !['/zh/posts', '/posts'].includes(path)
      )
    })
    .map((route) => {
      const { title, date } = route.meta.frontmatter as FrontmatterPostType
      return { title, path: route.path, date }
    })
    .sort(
      (a, b) =>
        new Date(b.date as string).getTime()
          - new Date(a.date as string).getTime(),
    )
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
  <ul>
    <li v-for="(post, index) in postsRoutes" :key="post.path" class="before:content-none!">
      <div
        v-if="isYearGroup(post.date, postsRoutes[index - 1]?.date)"
        class="slide-enter pointer-events-none relative h20 select-none"
      >
        <span
          class="absolute left--3rem top--2rem text-8em color-transparent font-bold text-stroke-2 text-stroke-hex-aaa op10"
        >{{
          dayjs(post.date).format("YYYY") }}</span>
      </div>
      <a :href="post.path" class="font-normal" style="border-style: dashed">{{
        post.title
      }}</a>
      <span class="ml-2 inline-flex text-sm text-gray-500 dark:text-gray-400">{{
        formatDateToMarDD(post.date)
      }}</span>
    </li>
  </ul>
</template>
