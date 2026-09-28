import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 两件事，都在构建前跑：
 * 1. 扫描 public/demos 生成图片清单 src/data/demos-images.json —— 演示页按「项目 id / 仓库名 / 旧路径名」
 *    自动匹配截图，所以新增截图只要把文件丢进 public/demos，不用改 oubuild 仓库的数据
 * 2. 把 oubuild/.github 的 profile/projects.json 同步成本仓库快照 src/data/projects.json
 *
 * 页面在浏览器里还会直接拉远端数据，所以快照只负责 SSG 首屏渲染，
 * 同步失败时保留旧快照即可，不要让构建挂掉。
 */
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DEST = resolve(ROOT, 'src/data/projects.json')
const IMAGES_DIR = resolve(ROOT, 'public/demos')
const IMAGE_MANIFEST = resolve(ROOT, 'src/data/demos-images.json')
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif'])
// 本地开发优先用隔壁 clone 的 oubuild/.github，省一次网络请求
const LOCAL = resolve(ROOT, '../.github/profile/projects.json')
const REMOTE_SOURCES = [
  'https://raw.githubusercontent.com/oubuild/.github/main/profile/projects.json',
  'https://fastly.jsdelivr.net/gh/oubuild/.github@main/profile/projects.json',
]

mkdirSync(dirname(DEST), { recursive: true })

function writeImageManifest() {
  if (!existsSync(IMAGES_DIR)) {
    console.warn(`图片目录不存在：${IMAGES_DIR}`)
    return
  }

  const files = readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(entry => entry.isFile() && IMAGE_EXTENSIONS.has(extname(entry.name).toLowerCase()))
    .map(entry => entry.name)
    .sort()

  writeFileSync(IMAGE_MANIFEST, `${JSON.stringify(files, null, 2)}\n`)
  console.log(`scanned ${files.length} images from public/demos`)
}

writeImageManifest()

function writeSnapshot(text: string, from: string) {
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed?.projects) || parsed.projects.length === 0)
    throw new Error(`${from} 里没有 projects 数据`)

  // 只有 generatedAt 变了就不重写，避免每次构建都让 CI 提交一次无意义的快照变更
  const contentKey = (value: any) => JSON.stringify({ ...value, generatedAt: null })
  if (existsSync(DEST) && contentKey(JSON.parse(readFileSync(DEST, 'utf8'))) === contentKey(parsed)) {
    console.log('快照内容无变化，跳过写入')
    return
  }

  writeFileSync(DEST, `${JSON.stringify(parsed, null, 2)}\n`)
  console.log(`synced ${parsed.projects.length} projects from ${from}`)
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
