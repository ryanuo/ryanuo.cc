import type { Project, ProjectsData } from '~/components/Demos/type'
import snapshot from '~/data/projects.json'

/**
 * 演示数据来自 oubuild 组织仓库的 profile/projects.json（由 data.yaml 生成）。
 * 页面默认用仓库内的快照渲染（SSG 直出，首屏不空），浏览器端再拉远端覆盖，
 * 这样在远端新增项目不需要重新构建部署本站。
 */
const REMOTE_SOURCES = [
  'https://raw.githubusercontent.com/oubuild/.github/main/profile/projects.json',
  'https://fastly.jsdelivr.net/gh/oubuild/.github@main/profile/projects.json',
]

const FETCH_TIMEOUT = 8000

function isLiveDemo(demo?: string | null) {
  if (!demo)
    return false
  // demo 指向 GitHub 仓库说明没有线上演示，卡片里就不显示「预览」
  return !/^https?:\/\/(?:www\.)?github\.com\//i.test(demo)
}

/**
 * 封面在构建时就解析进了快照的 image 字段（scripts/sync-projects.ts：先扫 public/demos 按
 * 「项目 id / 仓库名」匹配本地截图，没命中再抓应用页面的 og:image）。运行时拉的远端数据只带
 * 项目信息，所以按 id 沿用快照里的封面，远端数据里的 image 字段不再使用。
 * 新增封面 = 给应用页面的 SEO 加 og:image（或提交 public/demos/<项目 id>.png），下次构建自动带上。
 */
const localImages = new Map<string, string | null>(
  (snapshot as unknown as ProjectsData).projects.map(project => [project.id, project.image] as const),
)

function normalizeProject(project: Project): Project {
  return {
    ...project,
    demo: isLiveDemo(project.demo) ? project.demo : null,
    image: localImages.get(project.id) ?? null,
    description: project.description ?? { zh: '', en: '' },
    name: project.name ?? { zh: project.id, en: project.id },
    tags: project.tags ?? [],
  }
}

function parseProjects(raw: unknown): ProjectsData | null {
  const data = raw as ProjectsData | null
  if (!data || typeof data !== 'object' || !Array.isArray(data.projects))
    return null
  const projects = data.projects.filter(project => project && project.id && project.type)
  if (!projects.length)
    return null
  return { ...data, projects: projects.map(normalizeProject) }
}

async function fetchJson(url: string) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT)
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })
    if (!response.ok)
      throw new Error(`HTTP ${response.status}`)
    return await response.json()
  }
  finally {
    clearTimeout(timer)
  }
}

// 模块级单例：中英文两个路由共用同一份数据，避免重复请求
const fallback = snapshot as unknown as ProjectsData
// 快照也要过一遍 normalize，否则首屏（SSG）拿不到按约定匹配到的本地截图
const initial: ProjectsData = { ...fallback, projects: fallback.projects.map(normalizeProject) }
const data = ref<ProjectsData>(initial)
const loading = ref(false)
const failed = ref(false)
const live = ref(false)
const lastSync = ref(fallback.generatedAt ?? '')
let inflight: Promise<void> | null = null

async function refresh(force = false) {
  // SSG 阶段没有网络，只渲染快照；浏览器端挂载后再同步
  if (typeof window === 'undefined' || inflight)
    return inflight ?? undefined

  loading.value = true
  inflight = (async () => {
    for (const base of REMOTE_SOURCES) {
      try {
        const url = force ? `${base}${base.includes('?') ? '&' : '?'}t=${Date.now()}` : base
        const parsed = parseProjects(await fetchJson(url))
        if (!parsed)
          continue
        data.value = parsed
        lastSync.value = parsed.generatedAt ?? ''
        live.value = true
        failed.value = false
        return
      }
      catch (error) {
        console.warn('[demos] 远端数据同步失败：', base, error)
      }
    }
    failed.value = true
  })()

  try {
    await inflight
  }
  finally {
    loading.value = false
    inflight = null
  }
}

export function useProjects() {
  return { data, loading, failed, live, lastSync, refresh }
}
