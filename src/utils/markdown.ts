import markdownit from 'markdown-it'
import MarkdownItShiki from '@shikijs/markdown-it'
import { rendererRich, transformerTwoslash } from '@shikijs/twoslash'
import { themes } from '../../public/demos/typora-themes'

function handleReadmeUrl(url: string) {
  const urlObj = new URL(url)
  const pathParts = urlObj.pathname.split('/')
  const repoName = pathParts[1]
  const ownerName = pathParts[2]
  const branchName = pathParts[4]
  const fileName = pathParts[pathParts.length - 1]
  return `https://raw.githubusercontent.com/${repoName}/${ownerName}/refs/heads/${branchName}/${fileName}`
}

export async function fetchRemoteMarkdown(url: string) {
  const resultUrl = handleReadmeUrl(url)
  const response = await fetch(resultUrl)
  if (!response.ok) {
    throw new Error(`Failed to fetch markdown: ${response.statusText}`)
  }
  return await response.text()
}

export async function renderRemoteMarkdown(url: string) {
  try {
    const markdownContent = await fetchRemoteMarkdown(url)
    const md = markdownit()
    md.use(
      await MarkdownItShiki({
        themes: {
          dark: 'vitesse-dark',
          light: 'vitesse-light',
        },
        defaultColor: false,
        cssVariablePrefix: '--s-',
        transformers: [
          transformerTwoslash({
            explicitTrigger: true,
            renderer: rendererRich(),
          }),
        ],
      }) as any,
    )
    return md.render(markdownContent)
  }
  catch (error) {
    console.error('Error rendering remote markdown:', error)
    return '<p>Error loading content</p>'
  }
}

export function loadTheme(themeType: string, themeName: string) {
  const theme = themes[themeType]?.[themeName]
  if (typeof theme === 'string') { // 确保 theme 是字符串
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = theme
    link.id = 'dynamic-theme'
    const existingLink = document.getElementById('dynamic-theme')
    if (existingLink) {
      existingLink.replaceWith(link)
    }
    else {
      document.head.appendChild(link)
    }
  }
  else {
    console.error(`Theme ${themeName} not found in ${themeType} themes or is not a valid URL.`)
  }
}
