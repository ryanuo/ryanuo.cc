import fs from 'node:fs'
import path from 'node:path'
import mql from '@microlink/mql'

interface SitemapItem {
  url: string
  title: string
}

interface RequestParams {
  aspect_ratio: string
  coverMarkColor: string
  font: string
  coverTitle: string
  coverAuthor: string
  iconPosition: number
  iconName: string
  previewImg: string
}

const jsonUrl = 'dist/sitemap.json'
const url = 'https://c.ryanuo.cc/auto'
const outDir = 'public/og'
const timeout = 1200

// GitHub Action 推荐 5~6
const concurrency = 5

function urlToKey(url: string) {
  return `og-${url.replace(/^https?:\/\//, '').replace(/\//g, '-')}`
}

// 获取 sitemap
async function getJsonUrl(jsonUrl: string): Promise<Record<string, string>> {
  let items: SitemapItem[] = []

  if (jsonUrl.startsWith('http')) {
    const res = await fetch(jsonUrl)
    const json = await res.json()
    items = json.items || []
  }
  else {
    const jsonStr = fs.readFileSync(jsonUrl, 'utf-8')
    const json = JSON.parse(jsonStr)
    items = json.items || []
  }

  const result: Record<string, string> = {}

  for (const item of items) {
    result[urlToKey(item.url)] = item.title || ''
  }

  console.log(`共生成 ${items.length} 个链接`)

  return result
}

// 检查本地图片
async function checkLocalImage(): Promise<[string, string][]> {
  const imgMap = await getJsonUrl(jsonUrl)

  const list: [string, string][] = []

  for (const [key, title] of Object.entries(imgMap)) {
    const filename = path.join(outDir, `${key}.png`)

    if (!fs.existsSync(filename)) {
      list.push([key, title])
    }
  }

  return list
}

// URL 参数编码
function urlEncode(params: Record<string, any>) {
  const arr: string[] = []

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach(v => arr.push(`${key}=${encodeURIComponent(v)}`))
    }
    else {
      arr.push(`${key}=${encodeURIComponent(value)}`)
    }
  }

  return arr.join('&')
}

// 生成图片
async function generateCover(params: RequestParams, imgName: string) {
  const fullUrl = `${url}?${urlEncode(params)}`

  const { data } = await mql(fullUrl, {
    waitForTimeout: timeout,
    screenshot: {
      element: '#cover-preview-generate',
    },
  })

  if (!data?.screenshot?.url) {
    throw new Error('未获取到截图 URL')
  }

  const imageRes = await fetch(data.screenshot.url)
  const buffer = Buffer.from(await imageRes.arrayBuffer())

  const filename = path.join(outDir, `${imgName}.png`)

  await fs.promises.writeFile(filename, buffer)
}

// 并发池
async function runWithConcurrency(
  tasks: (() => Promise<void>)[],
  limit: number,
) {
  let index = 0

  async function worker(workerId: number) {
    while (true) {
      const current = index++

      if (current >= tasks.length)
        return

      try {
        await tasks[current]()
      }
      catch (e) {
        console.error(`[Worker ${workerId}]`, e)
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(limit, tasks.length) },
      (_, i) => worker(i + 1),
    ),
  )
}

async function main() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, {
      recursive: true,
    })
  }

  console.log('开始检查图片...')

  const noExistImgList = await checkLocalImage()

  if (!noExistImgList.length) {
    console.log('所有图片均已存在')
    return
  }

  console.log(`共 ${noExistImgList.length} 张图片需要生成`)
  console.log(`并发数：${concurrency}`)

  let finished = 0
  const total = noExistImgList.length

  const tasks = noExistImgList.map(([key, title]) => {
    return async () => {
      const font = key.includes('-en-')
        ? 'Work Sans'
        : 'Ma Shan Zheng'

      const params: RequestParams = {
        aspect_ratio: '2:1',
        coverMarkColor: 'rgba(0, 0, 0, 0.3)',
        font,
        coverTitle: title,
        coverAuthor: '@RYANUO',
        iconPosition: 3,
        iconName: 'material-symbols:adaptive-audio-mic',
        previewImg:
          'https://images.unsplash.com/photo-1536613105185-09ea1249a2cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1OTE5MjN8MHwxfHNlYXJjaHw0OXx8c2ltcGxlfGVufDB8fHx8MTc0MzA5MDUzOHww&ixlib=rb-4.0.3&q=80&w=1080',
      }

      console.log(`🚀 [${finished + 1}/${total}] 开始 ${key}`)

      await generateCover(params, key)

      finished++

      console.log(`✅ [${finished}/${total}] 完成 ${key}`)
    }
  })

  const start = Date.now()

  await runWithConcurrency(tasks, concurrency)

  const seconds = ((Date.now() - start) / 1000).toFixed(2)

  console.log('')
  console.log('=======================================')
  console.log(`🎉 全部生成完成`)
  console.log(`📦 总数量：${total}`)
  console.log(`⚡ 并发数：${concurrency}`)
  console.log(`⏱️ 耗时：${seconds}s`)
  console.log('=======================================')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})