import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * 把 oubuild/.github 的 profile/projects.json 同步成本仓库快照 src/data/projects.json。
 *
 * 页面在浏览器里还会直接拉远端数据，所以这个快照只负责 SSG 首屏渲染，
 * 同步失败时保留旧快照即可，不要让构建挂掉。
 */
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DEST = resolve(ROOT, 'src/data/projects.json')
// 本地开发优先用隔壁 clone 的 oubuild/.github，省一次网络请求
const LOCAL = resolve(ROOT, '../.github/profile/projects.json')
const REMOTE_SOURCES = [
  'https://raw.githubusercontent.com/oubuild/.github/main/profile/projects.json',
  'https://fastly.jsdelivr.net/gh/oubuild/.github@main/profile/projects.json',
]

mkdirSync(dirname(DEST), { recursive: true })

function writeSnapshot(text: string, from: string) {
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed?.projects) || parsed.projects.length === 0)
    throw new Error(`${from} 里没有 projects 数据`)

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
