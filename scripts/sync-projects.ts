import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 构建前同步演示数据：把 oubuild/.github 的 profile/projects.json 变成 src/data/projects.json 快照。
 *
 * 封面图按「本地优先」解析：
 * 1. 先扫 public/demos，按「数据里的文件名 / 项目 id / 仓库名」宽松匹配本地截图；
 * 2. 本地没命中就去应用页面的 SEO 里抓 og:image（含 twitter:image 兜底），相对地址补成绝对地址；
 * 3. 都没有就留 null，页面渲染色块占位。
 * 所以新增应用只要它的页面有 og:image，就不必往本站提交截图；远端数据里的 image 字段不再使用。
 *
 * 页面在浏览器里还会直接拉远端数据，所以快照只负责 SSG 首屏渲染，
 * 同步失败时保留旧快照即可，不要让构建挂掉。
 */
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DEST = resolve(ROOT, 'src/data/projects.json')
const IMAGES_DIR = resolve(ROOT, 'public/demos')
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif'])
// 本地开发优先用隔壁 clone 的 oubuild/.github，省一次网络请求
const LOCAL = resolve(ROOT, '../.github/profile/projects.json')
// api.github.com 不走 CDN 缓存，另一个仓库刚 push 完也能立刻拿到最新数据；CDN 源作为兜底
const REMOTE_SOURCES = [
  {
    url: 'https://api.github.com/repos/oubuild/.github/contents/profile/projects.json',
    accept: 'application/vnd.github.raw',
  },
  {
    url: 'https://raw.githubusercontent.com/oubuild/.github/main/profile/projects.json',
    accept: 'application/json',
  },
  {
    url: 'https://fastly.jsdelivr.net/gh/oubuild/.github@main/profile/projects.json',
    accept: 'application/json',
  },
]
// 抓页面的超时、并发与总预算，任何一个环节超时都只是拿不到封面，不让构建挂掉
const REMOTE_TIMEOUT = 6000
const OG_TIMEOUT = 8000
const OG_CONCURRENCY = 4
const OG_DEADLINE = 20000
const OG_KEYS = ['og:image', 'og:image:url', 'og:image:secure_url', 'twitter:image', 'twitter:image:src']
const OG_ACCEPT = 'text/html,application/xhtml+xml'
const OG_UA = 'Mozilla/5.0 (compatible; ryanuo.cc demos sync)'

mkdirSync(dirname(DEST), { recursive: true })

function fileStem(path: string) {
  const file = path.split('/').pop() ?? ''
  return file.replace(/\.[a-z0-9]+$/i, '')
}

/** 宽松匹配键：忽略大小写与 - / _ 等分隔符（whatToEat.png ≈ what-to-eat.png） */
function looseKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/** public/demos 下的可用图片：宽松键 → 真实文件名 */
function readImageIndex() {
  const index = new Map<string, string>()
  if (!existsSync(IMAGES_DIR)) {
    console.warn(`图片目录不存在：${IMAGES_DIR}`)
    return index
  }

  const files = readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(entry => entry.isFile() && IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase()))
    .map(entry => entry.name)

  for (const file of files) {
    index.set(looseKey(file), file)
    index.set(looseKey(fileStem(file)), file)
  }
  return index
}

/** 本地优先：依次按「数据里的相对路径 → 项目 id → 仓库名」匹配 public/demos，没命中返回 null 交给 og 兜底 */
function resolveLocalImage(project: any, images: Map<string, string>) {
  const given = typeof project.image === 'string' ? project.image.trim() : ''
  const candidates = [
    /^https?:\/\//i.test(given) ? '' : fileStem(given),
    project.id,
    fileStem(project.repo ?? ''),
  ]

  for (const candidate of candidates) {
    if (!candidate)
      continue
    const hit = images.get(looseKey(candidate))
    if (hit)
      return `/demos/${hit}`
  }

  return null
}

/** demo 指向 GitHub 仓库说明没有线上页面，抓不到 SEO */
function ogPageUrl(project: any) {
  const demo = typeof project.demo === 'string' ? project.demo.trim() : ''
  if (!/^https?:\/\//i.test(demo))
    return null
  if (/^https?:\/\/(?:www\.)?github\.com\//i.test(demo))
    return null
  return demo
}

function decodeEntities(value: string) {
  return value
    .replace(/&(?:amp|#0*38|#x0*26);/gi, '&')
    .replace(/&(?:quot|#0*34|#x0*22);/gi, '"')
    .replace(/&(?:apos|#0*39|#x0*27);/gi, '\'')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
}

function metaContent(tag: string, name: string) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, 'i'))
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : ''
}

/** 从 HTML 里按 og:image → twitter:image 的顺序取封面，并把相对地址补成绝对地址 */
function parseOgImage(html: string, pageUrl: string) {
  const found = new Map<string, string>()
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const key = (metaContent(tag, 'property') || metaContent(tag, 'name')).trim().toLowerCase()
    const content = metaContent(tag, 'content').trim()
    if (key && content && !found.has(key))
      found.set(key, content)
  }

  for (const key of OG_KEYS) {
    const value = decodeEntities(found.get(key) ?? '').trim()
    if (!value)
      continue
    try {
      const url = new URL(value, pageUrl)
      if (url.protocol === 'http:' || url.protocol === 'https:')
        return url.href
    }
    catch {
      // 解析不了的地址直接跳过，继续看下一个候选
    }
  }

  return null
}

async function fetchOgImage(pageUrl: string) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), OG_TIMEOUT)
  try {
    const response = await fetch(pageUrl, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'accept': OG_ACCEPT, 'user-agent': OG_UA },
    })
    if (!response.ok)
      throw new Error(`HTTP ${response.status}`)

    const type = response.headers.get('content-type') ?? ''
    if (type && !/text\/html|application\/xhtml/i.test(type))
      throw new Error(`非 HTML 响应：${type}`)

    return parseOgImage(await response.text(), response.url || pageUrl)
  }
  finally {
    clearTimeout(timer)
  }
}

/** 限量并发抓 og，失败只警告并留空（页面用色块占位） */
async function resolveOgImages(targets: { index: number, project: any, pageUrl: string }[]) {
  const images = new Map<number, string>()
  const queue = [...targets]
  const deadline = Date.now() + OG_DEADLINE

  async function worker() {
    while (queue.length) {
      const target = queue.shift()
      if (!target)
        return
      if (Date.now() > deadline) {
        console.warn(`跳过 ${target.project.id} 的 og 抓取：已超过 ${OG_DEADLINE}ms 预算`)
        continue
      }

      try {
        const image = await fetchOgImage(target.pageUrl)
        if (image) {
          images.set(target.index, image)
          console.log(`og 封面 ${target.project.id} → ${image}`)
        }
        else {
          console.warn(`og 封面缺失 ${target.project.id}：${target.pageUrl} 的 SEO 里没有 og:image`)
        }
      }
      catch (error) {
        console.warn(`og 封面抓取失败 ${target.project.id}：${target.pageUrl}`, error)
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(OG_CONCURRENCY, targets.length) }, worker))
  return images
}

async function writeSnapshot(text: string, from: string) {
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed?.projects) || parsed.projects.length === 0)
    throw new Error(`${from} 里没有 projects 数据`)

  const images = readImageIndex()
  const localImages: (string | null)[] = parsed.projects.map((project: any) => resolveLocalImage(project, images))

  const ogTargets: { index: number, project: any, pageUrl: string }[] = []
  parsed.projects.forEach((project: any, index: number) => {
    if (localImages[index])
      return
    const pageUrl = ogPageUrl(project)
    if (pageUrl)
      ogTargets.push({ index, project, pageUrl })
  })
  const ogImages = await resolveOgImages(ogTargets)

  parsed.projects = parsed.projects.map((project: any, index: number) => ({
    ...project,
    image: localImages[index] ?? ogImages.get(index) ?? null,
  }))

  // 只有 generatedAt 变了就不重写，避免每次构建都让 CI 提交一次无意义的快照变更
  const contentKey = (value: any) => JSON.stringify({ ...value, generatedAt: null })
  if (existsSync(DEST) && contentKey(JSON.parse(readFileSync(DEST, 'utf8'))) === contentKey(parsed)) {
    console.log('快照内容无变化，跳过写入')
    return
  }

  writeFileSync(DEST, `${JSON.stringify(parsed, null, 2)}\n`)
  const total = parsed.projects.length
  const localCount = localImages.filter(Boolean).length
  const ogCount = localImages.filter((image, index) => !image && ogImages.get(index)).length
  console.log(`synced ${total} projects from ${from}（本地截图 ${localCount} · og 兜底 ${ogCount} · 无封面 ${total - localCount - ogCount}）`)
}

/** 远端多源并发拉取，取 generatedAt 最新的一份（另一个仓库刚 push 时 CDN 可能还是旧数据） */
async function syncFromRemote() {
  const settled = await Promise.allSettled(REMOTE_SOURCES.map(async (source) => {
    // 没有超时的话，一个卡住的 CDN 连接就能拖死整次构建
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), REMOTE_TIMEOUT)
    try {
      const response = await fetch(source.url, {
        signal: controller.signal,
        headers: { 'accept': source.accept, 'user-agent': OG_UA },
      })
      if (!response.ok)
        throw new Error(`HTTP ${response.status} ${response.statusText}`)
      const text = await response.text()
      return { text, from: source.url, generatedAt: String(JSON.parse(text)?.generatedAt ?? '') }
    }
    finally {
      clearTimeout(timer)
    }
  }))

  const candidates = settled
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value)
    .sort((a, b) => (Date.parse(b.generatedAt) || 0) - (Date.parse(a.generatedAt) || 0))

  if (!candidates.length) {
    for (const result of settled) {
      if (result.status === 'rejected')
        console.warn('远端数据源拉取失败：', result.reason)
    }
  }

  for (const candidate of candidates) {
    try {
      await writeSnapshot(candidate.text, candidate.from)
      return true
    }
    catch (error) {
      console.warn(`failed to sync from ${candidate.from}:`, error)
    }
  }

  return false
}

if (existsSync(LOCAL)) {
  await writeSnapshot(readFileSync(LOCAL, 'utf8'), LOCAL)
  process.exit(0)
}

if (await syncFromRemote())
  process.exit(0)

if (existsSync(DEST)) {
  console.warn('远端同步失败，保留现有快照 src/data/projects.json')
  process.exit(0)
}

throw new Error('远端同步失败且本地没有快照，无法生成 src/data/projects.json')
