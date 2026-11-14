// @ts-check
/* eslint perfectionist/sort-objects: "error" */
import antfu from '@antfu/eslint-config'
import markdownFrontmatter, { fromInterface } from 'eslint-plugin-markdown-frontmatter'

// 直接读 typings/global.d.ts 里的 FrontmatterPostType：
// 字段增删只需改类型定义，不用在这里抄一遍
const postSchema = fromInterface('typings/global.d.ts', 'FrontmatterPostType', {
  overrides: {
    // 类型上是 string，但 YAML 不带引号的日期会解析成 Date 对象
    date: { required: true, type: 'date' },
  },
})

// 页面（index / navs / demos）复用同一份字段表，只放宽这两个必填项
const pageSchema = {
  ...postSchema,
  date: 'date',
  description: 'string',
}

export default antfu(
  {
    formatters: {
      css: true,
    },
    pnpm: true,
    rules: {
      '@stylistic/js/no-multiple-empty-lines': 'off',
      'no-labels': 'off',
      'no-lone-blocks': 'off',
      'no-restricted-syntax': 'off',
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/process': 'off',
      'prefer-rest-params': 'off',
      'symbol-description': 'off',
      'ts/ban-types': 'off',
      'ts/no-invalid-this': 'off',
      'ts/no-unnecessary-type-constraint': 'off',
      'vue/no-template-shadow': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
    },
    unocss: true,
  },

  // ---------------------------------------------------------------
  // frontmatter 校验
  // @eslint/markdown 默认 frontmatter: false，不显式打开的话 AST 里
  // 根本没有 yaml 节点，规则永远不会触发（表现为"完全不标红"）
  // ---------------------------------------------------------------
  {
    files: ['pages/**/*.md'],
    languageOptions: {
      frontmatter: 'yaml',
    },
    name: 'ryanuo/frontmatter/setup',
    plugins: {
      'markdown-frontmatter': markdownFrontmatter,
    },
  },
  {
    files: ['pages/**/*.md'],
    name: 'ryanuo/frontmatter/pages',
    rules: {
      // strict: schema 未声明的字段（通常是拼错，如 catess → cate）也报错
      'markdown-frontmatter/format': ['error', { schema: pageSchema, strict: true }],
    },
  },
  // 文章必须有 date（页面如 demos/about、posts/index 列表页不要求）
  {
    files: ['pages/**/posts/**/*.md'],
    ignores: ['pages/**/posts/index.md'],
    name: 'ryanuo/frontmatter/posts',
    rules: {
      'markdown-frontmatter/format': ['error', {
        schema: postSchema,
        strict: true,
      }],
    },
  },
)
