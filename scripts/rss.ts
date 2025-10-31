import type { FeedOptions, Item } from 'feed'
import { dirname } from 'node:path'
import fg from 'fast-glob'
import { Feed } from 'feed'
import fs from 'fs-extra'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const DOMAIN = 'https://ryanuo.cc'
const AUTHOR = {
  name: 'ryanuo',
  email: 'ryanuo@aliyun.com',
  link: DOMAIN,
}
const markdown = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
})

function urlReplaceEn(url: string) {
  if (url.includes('/en/')) {
    return url.replace('/en', '')
  }

  return url
}

async function run() {
  await buildBlogRSS()
  await buildLatestPostsRSS()
}

async function buildBlogRSS() {
  const files = await fg([
    'pages/en/posts/*.md',
    'pages/zh/posts/*.md',
    'pages/en/navs/*.md',
    'pages/zh/navs/*.md',
  ])

  const options = {
    title: 'RYANUO',
    description: 'RYANUO\' Blog',
    id: DOMAIN,
    link: DOMAIN,
    copyright: 'CC BY-NC-SA 4.0 2021 © RYANUO',
    feedLinks: {
      json: `${DOMAIN}/sitemap.json`,
      atom: `${DOMAIN}/sitemap.atom`,
      rss: `${DOMAIN}/sitemap.xml`,
    },
  }

  const posts: any[] = (
    await Promise.all(
      files
        .filter(i => !i.includes('posts/index'))
        .map(async (i) => {
          const raw = await fs.readFile(i, 'utf-8')
          const { data, content } = matter(raw)
          let html = markdown.render(content)
          if (i.includes('/navs') && data?.projects) {
            html = ''
            Object.entries(data.projects).forEach(
              ([key, values]: [string, any]) => {
                html += `<h4>${key}</h4>`
                values.forEach((project: any) => {
                  html += `<div class="project-item"><div class="project-item-title">${project.name}</div><div class="project-item-desc">${project.desc}</div><div class="project-item-link"><a href="${project.link}" target="_blank">${project.link}</a></div></div>`
                })
              },
            )
          }

          return {
            ...data,
            date: data?.date ? new Date(data?.date) : new Date(),
            content: html,
            extensions: [
              { name: 'text', objects: content.replace(/\r\n/g, '') },
            ],
            author: [AUTHOR],
            link:
              urlReplaceEn(DOMAIN
                + i.replace(/^pages(.+)\.md$/, '$1')?.replace('/index', '')),
          }
        }),
    )
  ).filter(Boolean)

  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date))

  await writeFeedToFile('sitemap', options, posts, './dist')
}

async function buildLatestPostsRSS() {
  const files = await fg(['pages/en/posts/*.md'])

  const options = {
    title: 'RYANUO - Latest Posts',
    description: 'Latest posts from RYANUO\'s Blog',
    id: DOMAIN,
    link: DOMAIN,
    copyright: 'CC BY-NC-SA 4.0 2021 © RYANUO',
    feedLinks: {
      rss: `${DOMAIN}/latest_sitemap.xml`,
    },
  }

  const filteredFiles: string[] = []
  for (const file of files) {
    const raw = await fs.readFile(file, 'utf-8')
    const { data } = matter(raw)
    if (!file.includes('posts/index') && data?.isHidden !== true) {
      filteredFiles.push(file)
    }
  }

  const posts: any[] = (
    await Promise.all(
      filteredFiles.map(async (i) => {
        const raw = await fs.readFile(i, 'utf-8')
        const { data, content } = matter(raw)
        const html = markdown.render(content)

        const link = DOMAIN
          + i.replace(/^pages(.+)\.md$/, '')?.replace('/index', '')

        return {
          ...data,
          date: data?.date ? new Date(data?.date) : new Date(),
          content: html,
          extensions: [
            { name: 'text', objects: content.replace(/\r\n/g, '') },
          ],
          author: [AUTHOR],
          link: urlReplaceEn(link),
        }
      }),
    )
  ).filter(Boolean)

  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date))

  await writeFeedToFile('sitemap', options, posts, './dist/latest')
}

async function writeFeedToFile(name: string, options: FeedOptions, items: Item[], outputDir: string) {
  options.author = AUTHOR
  options.image = `${DOMAIN}/avatar.png`
  options.favicon = `${DOMAIN}/logo.png`

  const feed = new Feed(options)

  items.forEach(item => feed.addItem(item))

  await fs.ensureDir(dirname(`${outputDir}/${name}`))
  await fs.writeFile(`${outputDir}/${name}.xml`, feed.rss2(), 'utf-8')
  if (!outputDir.includes('latest')) {
    await fs.writeFile(`${outputDir}/${name}.atom`, feed.atom1(), 'utf-8')
    await fs.writeFile(`${outputDir}/${name}.json`, feed.json1(), 'utf-8')
  }
}

run()
