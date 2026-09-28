<script setup lang="ts">
import type { FilterKey, Project } from './type'
import { useLanguage } from '~/hooks/useLanguage'
import { useProjects } from '~/hooks/useProjects'
import { useModalOptions } from './hooks/useModalOptions'
import { localizedText } from './type'

const DATA_SOURCE = 'https://github.com/oubuild/.github/blob/main/profile/README.md'

const { isChinese } = useLanguage()
const { data, loading, failed, live, lastSync, refresh } = useProjects()
const { options } = useModalOptions()

const query = ref('')
const filter = ref<FilterKey>('all')
const showArchived = ref(false)

const projects = computed(() => data.value.projects.filter(project => !project.hidden))
const profileTitle = computed(() => localizedText(data.value.profile?.title, isChinese.value))
const syncedAt = computed(() => (lastSync.value || '').slice(0, 10))

function searchableText(project: Project) {
  return [
    project.name.zh,
    project.name.en,
    project.description.zh,
    project.description.en,
    project.repo,
    ...project.tags,
  ].join(' ').toLowerCase()
}

function matchesQuery(project: Project) {
  const q = query.value.trim().toLowerCase()
  if (!q)
    return true
  return searchableText(project).includes(q)
}

function matchesType(project: Project) {
  return filter.value === 'all' || project.type === filter.value
}

// 有搜索词时把历史项目也纳入结果，不用先手动展开
const searching = computed(() => Boolean(query.value.trim()))
const includeArchived = computed(() => showArchived.value || searching.value)

const visibleProjects = computed(() =>
  projects.value.filter((project) => {
    if (project.status === 'archived' && !includeArchived.value)
      return false
    return matchesQuery(project) && matchesType(project)
  }),
)

// 精选只在「未筛选、未搜索」时单独成区，否则所有结果平铺
const showFeatured = computed(() => filter.value === 'all' && !searching.value)
const featuredList = computed(() =>
  showFeatured.value
    ? visibleProjects.value.filter(project => project.featured && project.status === 'active')
    : [],
)
const activeList = computed(() =>
  visibleProjects.value.filter(project => project.status === 'active' && !featuredList.value.includes(project)),
)
const archivedList = computed(() => visibleProjects.value.filter(project => project.status === 'archived'))
const archivedTotal = computed(() => projects.value.filter(project => project.status === 'archived').length)

const counts = computed(() => {
  const scoped = projects.value.filter((project) => {
    if (project.status === 'archived' && !includeArchived.value)
      return false
    return matchesQuery(project)
  })
  return {
    all: scoped.length,
    self: scoped.filter(project => project.type === 'self').length,
    adapted: scoped.filter(project => project.type === 'adapted').length,
    deployed: scoped.filter(project => project.type === 'deployed').length,
  }
})

function openMore(project: Project) {
  options.value.content = project
  options.value.modelValue = true
}

onMounted(() => refresh())
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
    <header class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-3xl text-neutral-900 font-semibold tracking-tight dark:text-neutral-50">
          {{ $t('demos.title') }}
        </h1>
        <p class="text-sm text-neutral-500">
          {{ profileTitle }} · {{ $t('demos.count', { count: projects.length }) }}
        </p>
      </div>

      <div class="flex items-center gap-3 text-xs text-neutral-500">
        <a :href="DATA_SOURCE" target="_blank" rel="noopener noreferrer" class="text-neutral-400 no-underline hover:text-neutral-900 dark:hover:text-neutral-100">
          {{ $t('demos.dataSource') }} ↗
        </a>
        <span class="text-neutral-300 dark:text-neutral-700">|</span>
        <span>
          {{ $t('demos.syncedAt') }} {{ syncedAt }}
          <template v-if="live">· {{ $t('demos.live') }}</template>
          <template v-else-if="failed">· {{ $t('demos.snapshot') }}</template>
        </span>
        <button
          type="button"
          :disabled="loading"
          class="inline-flex cursor-pointer items-center gap-1 border border-neutral-200 rounded-md px-2 py-1 transition disabled:cursor-not-allowed dark:border-neutral-800 hover:border-neutral-400 disabled:op-40 dark:hover:border-neutral-600"
          @click="refresh(true)"
        >
          <span class="i-ri-refresh-line" :class="loading && 'animate-spin'" />
          {{ loading ? $t('demos.syncing') : $t('demos.refresh') }}
        </button>
      </div>
    </header>

    <DemoToolbar v-model:query="query" v-model:filter="filter" :counts="counts" />

    <p v-if="visibleProjects.length === 0" class="mt-16 text-center text-sm text-neutral-500">
      {{ $t('demos.empty') }}
    </p>

    <section v-if="featuredList.length" class="mt-10">
      <h2 class="mb-4 text-sm text-neutral-400 font-medium">
        {{ $t('demos.featured') }}
      </h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <DemoCard
          v-for="project in featuredList"
          :key="project.id"
          :project="project"
          @more="openMore"
        />
      </div>
    </section>

    <section v-if="activeList.length" class="mt-10">
      <h2 class="mb-4 text-sm text-neutral-400 font-medium">
        {{ $t('demos.all') }}
      </h2>
      <div class="grid gap-4 lg:grid-cols-3 sm:grid-cols-2">
        <DemoCard
          v-for="project in activeList"
          :key="project.id"
          :project="project"
          @more="openMore"
        />
      </div>
    </section>

    <section v-if="archivedTotal > 0" class="mt-12 border-t border-neutral-200 pt-6 dark:border-neutral-800">
      <button
        type="button"
        class="w-full flex cursor-pointer items-center justify-between border-0 bg-transparent p-0 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        @click="showArchived = !showArchived"
      >
        <span>{{ $t('demos.archived') }} · {{ archivedTotal }}</span>
        <span class="inline-flex items-center gap-1">
          {{ showArchived ? $t('demos.hideArchived') : $t('demos.showArchived') }}
          <span :class="showArchived ? 'i-ri-arrow-up-s-line' : 'i-ri-arrow-down-s-line'" />
        </span>
      </button>
      <div v-if="showArchived && archivedList.length" class="grid mt-6 gap-4 lg:grid-cols-3 sm:grid-cols-2">
        <DemoCard
          v-for="project in archivedList"
          :key="project.id"
          :project="project"
          @more="openMore"
        />
      </div>
    </section>
  </div>

  <DemoDialog :options="options" />
</template>
