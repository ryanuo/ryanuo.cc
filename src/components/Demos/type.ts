export type ProjectType = 'self' | 'adapted' | 'deployed'
export type ProjectStatus = 'active' | 'archived'
export type FilterKey = 'all' | ProjectType

export interface LocalizedText {
  zh: string
  en: string
}

export interface Project {
  id: string
  name: LocalizedText
  repo: string
  type: ProjectType
  status: ProjectStatus
  demo: string | null
  description: LocalizedText
  tags: string[]
  year: number
  image: string | null
  featured: boolean
  hidden: boolean
  source: string
  github: string
  readme: string
  video?: string | null
}

export interface ProjectsData {
  version: number
  generatedAt: string
  profile: {
    name: string
    title: LocalizedText
  }
  projects: Project[]
}

/**
 * 数据类型对应的标签底色。
 * 🟢 自研 / 🟡 开源改造 / 🔵 开源部署，与 oubuild profile README 的图例一致。
 */
export const TYPE_COLOR: Record<ProjectType, string> = {
  self: 'bg-green-600',
  adapted: 'bg-amber-500',
  deployed: 'bg-sky-600',
}

/** 取本地化文案，缺失时回退到另一种语言 */
export function localizedText(value: LocalizedText | null | undefined, isChinese: boolean): string {
  if (!value)
    return ''
  return (isChinese ? value.zh : value.en) || value.zh || value.en || ''
}
