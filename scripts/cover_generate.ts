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
const timeout = 1200 // 等待时间，单位毫秒

// 工具：URL 转 key
function urlToKey(url: string) {
  return `og-${url.replace(/^https?:\/\//, '').replace(/\//g, '-')}`
}

// 获取 JSON 数据
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

  const results: Record<string, string> = {}
  items.forEach((item) => {
    results[urlToKey(item.url)] = item.title || ''
  })

  console.log(`共生成 ${items.length} 个链接`)
  return results
}

// 检查本地图片
async function checkLocalImage(): Promise<[string, string][]> {
  const imgMap = await getJsonUrl(jsonUrl)
  const notFoundList: [string, string][] = []

  for (const [key, title] of Object.entries(imgMap)) {
    const localImagePath = path.join(outDir, `${key}.png`)
    if (!fs.existsSync(localImagePath)) {
      notFoundList.push([key, title])
    }
  }

  return notFoundList
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

async function generateCover(params: RequestParams, imgName: string) {
  try {
    const fullUrl = `${url}?${urlEncode(params)}`
    const { data } = await mql(fullUrl, {
      waitForTimeout: timeout,
      screenshot: { element: '#cover-preview-generate' },
    })

    if (data?.screenshot?.url) {
      const imageUrl = data.screenshot.url

      // 下载图片
      const imageRes = await fetch(imageUrl)
      const buffer = Buffer.from(await imageRes.arrayBuffer())

      const filename = path.join(outDir, `${imgName}.png`)
      // 写入本地文件
      fs.writeFileSync(filename, buffer)
      console.log('图片已保存到:', filename)
    }
    else {
      console.error('未获取到截图 URL:', data)
    }
  }
  catch (e) {
    console.error('请求或保存失败:', e)
  }
}

async function main() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  console.log('正在生成封面...')

  const noExistImgList = await checkLocalImage()

  if (noExistImgList.length > 0) {
    console.log(`共 ${noExistImgList.length} 个图片不存在，开始生成...`)
    for (const [key, title] of noExistImgList) {
      const font = key.includes('-zh-') ? 'ZCOOL KuaiLe' : 'Work Sans'
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

      await generateCover(params, key)
    }
  }
  else {
    console.log('所有图片均已存在')
  }
}

main()
