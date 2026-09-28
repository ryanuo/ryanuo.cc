import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 构建前同步演示数据：把 oubuild/.github 的 profile/projects.json 变成 src/data/projects.json 快照。
 *
 * 顺便在这里把截图解析进每个项目的 image 字段（扫 public/demos，按「项目 id / 仓库名」匹配），
 * 所以 oubuild 那边只维护项目数据、不维护图片路径，截图只要按 public/demos/<项目 id>.png 命名即可。
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
const REMOTE_SOURCES = [
  'https://raw.githubusercontent.com/oubuild/.github/main/profile/projects.json',
  'https://fastly.jsdelivr.net/gh/oubuild/.github@main/profile/projects.json',
]

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

/** 依次按「数据里的路径 → 项目 id → 仓库名」匹配本地截图，都没命中就留空（页面渲染色块占位） */
function resolveImage(project: any, images: Map<string, string>) {
  const given = typeof project.image === 'string' ? project.image.trim() : ''
  if (/^https?:\/\//i.test(given))
    return given

  const candidates = [fileStem(given), project.id, fileStem(project.repo ?? '')]
  for (const candidate of candidates) {
    if (!candidate)
      continue
    const hit = images.get(looseKey(candidate))
    if (hit)
      return `/demos/${hit}`
  }

  return null
}

function writeSnapshot(text: string, from: string) {
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed?.projects) || parsed.projects.length === 0)
    throw new Error(`${from} 里没有 projects 数据`)

  const images = readImageIndex()
  parsed.projects = parsed.projects.map((project: any) => ({
    ...project,
    image: resolveImage(project, images),
  }))

  // 只有 generatedAt 变了就不重写，避免每次构建都让 CI 提交一次无意义的快照变更
  const contentKey = (value: any) => JSON.stringify({ ...value, generatedAt: null })
  if (existsSync(DEST) && contentKey(JSON.parse(readFileSync(DEST, 'utf8'))) === contentKey(parsed)) {
    console.log('快照内容无变化，跳过写入')
    return
  }

  writeFileSync(DEST, `${JSON.stringify(parsed, null, 2)}\n`)
  const matched = parsed.projects.filter((project: any) => project.image).length
  console.log(`synced ${parsed.projects.length} projects (${matched} with screenshot) from ${from}`)
}

if (existsSync(LOCAL)) {
  writeSnapshot(readFileSync(LOCAL, 'utf8'), LOCAL)
  process.exit(0)
}

for (const url of REMOTE_SOURCES) {
  try {
    const response = await fetch(url)
    if (!response.ok)
      throw new Error(`HTTP ${response.status} ${response.statusText}`)
    writeSnapshot(await response.text(), url)
    process.exit(0)
  }
  catch (error) {
    console.warn(`failed to sync from ${url}:`, error)
  }
}

if (existsSync(DEST)) {
  console.warn('远端同步失败，保留现有快照 src/data/projects.json')
  process.exit(0)
}

throw new Error('远端同步失败且本地没有快照，无法生成 src/data/projects.json')
