declare interface Document {
  startViewTransition?: () => any
}

declare module 'markdown-it-table-of-contents';
declare module 'lodash-es';
declare module 'markdown-it-textual-uml';
declare module 'diacritics';

declare interface FrontmatterPostType {
  title: string
  description: string
  tags?: string[]
  cate?: string
  date: string
  image?: string
  plum?: boolean
  isHidden?: boolean
  display?: string
  isHiddenTitle?: boolean

  // 以下仅首页 / 导航页（index.md、navs/*.md）使用
  avatars?: string
  id?: string
  keywords?: string
  projects?: Record<string, { name: string, link: string }[]>
  titleStyle?: { fontFamily?: string, opacity?: number }
}

interface AlgoliaSearchParams {
  appId: string
  apiKey: string
  siteId: string
  branch: string
  selector: string
}

declare module '@docsearch/js';

declare module 'vue-virtual-scroller'
