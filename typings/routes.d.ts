/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'unplugin-vue-router/types'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/[...404]': RouteRecordInfo<'/[...404]', '/:404(.*)', { 404: ParamValue<true> }, { 404: ParamValue<false> }>,
    '/demos/': RouteRecordInfo<'/demos/', '/demos', Record<never, never>, Record<never, never>>,
    '/interview/': RouteRecordInfo<'/interview/', '/interview', Record<never, never>, Record<never, never>>,
    '/navs/': RouteRecordInfo<'/navs/', '/navs', Record<never, never>, Record<never, never>>,
    '/navs/libraries': RouteRecordInfo<'/navs/libraries', '/navs/libraries', Record<never, never>, Record<never, never>>,
    '/navs/tools': RouteRecordInfo<'/navs/tools', '/navs/tools', Record<never, never>, Record<never, never>>,
    '/posts/': RouteRecordInfo<'/posts/', '/posts', Record<never, never>, Record<never, never>>,
    '/posts/2021': RouteRecordInfo<'/posts/2021', '/posts/2021', Record<never, never>, Record<never, never>>,
    '/posts/algolia': RouteRecordInfo<'/posts/algolia', '/posts/algolia', Record<never, never>, Record<never, never>>,
    '/posts/aug': RouteRecordInfo<'/posts/aug', '/posts/aug', Record<never, never>, Record<never, never>>,
    '/posts/big-screen': RouteRecordInfo<'/posts/big-screen', '/posts/big-screen', Record<never, never>, Record<never, never>>,
    '/posts/bs2022': RouteRecordInfo<'/posts/bs2022', '/posts/bs2022', Record<never, never>, Record<never, never>>,
    '/posts/buy-car': RouteRecordInfo<'/posts/buy-car', '/posts/buy-car', Record<never, never>, Record<never, never>>,
    '/posts/convolution': RouteRecordInfo<'/posts/convolution', '/posts/convolution', Record<never, never>, Record<never, never>>,
    '/posts/debug_test': RouteRecordInfo<'/posts/debug_test', '/posts/debug_test', Record<never, never>, Record<never, never>>,
    '/posts/deepin': RouteRecordInfo<'/posts/deepin', '/posts/deepin', Record<never, never>, Record<never, never>>,
    '/posts/docker': RouteRecordInfo<'/posts/docker', '/posts/docker', Record<never, never>, Record<never, never>>,
    '/posts/es6': RouteRecordInfo<'/posts/es6', '/posts/es6', Record<never, never>, Record<never, never>>,
    '/posts/file-download': RouteRecordInfo<'/posts/file-download', '/posts/file-download', Record<never, never>, Record<never, never>>,
    '/posts/forwardemail': RouteRecordInfo<'/posts/forwardemail', '/posts/forwardemail', Record<never, never>, Record<never, never>>,
    '/posts/git': RouteRecordInfo<'/posts/git', '/posts/git', Record<never, never>, Record<never, never>>,
    '/posts/git-commit': RouteRecordInfo<'/posts/git-commit', '/posts/git-commit', Record<never, never>, Record<never, never>>,
    '/posts/gpt': RouteRecordInfo<'/posts/gpt', '/posts/gpt', Record<never, never>, Record<never, never>>,
    '/posts/java': RouteRecordInfo<'/posts/java', '/posts/java', Record<never, never>, Record<never, never>>,
    '/posts/js-re': RouteRecordInfo<'/posts/js-re', '/posts/js-re', Record<never, never>, Record<never, never>>,
    '/posts/make-name': RouteRecordInfo<'/posts/make-name', '/posts/make-name', Record<never, never>, Record<never, never>>,
    '/posts/md-it-diagarm': RouteRecordInfo<'/posts/md-it-diagarm', '/posts/md-it-diagarm', Record<never, never>, Record<never, never>>,
    '/posts/mermaid': RouteRecordInfo<'/posts/mermaid', '/posts/mermaid', Record<never, never>, Record<never, never>>,
    '/posts/npm-cdn': RouteRecordInfo<'/posts/npm-cdn', '/posts/npm-cdn', Record<never, never>, Record<never, never>>,
    '/posts/own-api': RouteRecordInfo<'/posts/own-api', '/posts/own-api', Record<never, never>, Record<never, never>>,
    '/posts/pinia': RouteRecordInfo<'/posts/pinia', '/posts/pinia', Record<never, never>, Record<never, never>>,
    '/posts/pnpm-pkg': RouteRecordInfo<'/posts/pnpm-pkg', '/posts/pnpm-pkg', Record<never, never>, Record<never, never>>,
    '/posts/pytorch': RouteRecordInfo<'/posts/pytorch', '/posts/pytorch', Record<never, never>, Record<never, never>>,
    '/posts/re-soup': RouteRecordInfo<'/posts/re-soup', '/posts/re-soup', Record<never, never>, Record<never, never>>,
    '/posts/rewrite-blazeb2': RouteRecordInfo<'/posts/rewrite-blazeb2', '/posts/rewrite-blazeb2', Record<never, never>, Record<never, never>>,
    '/posts/sass': RouteRecordInfo<'/posts/sass', '/posts/sass', Record<never, never>, Record<never, never>>,
    '/posts/swiper': RouteRecordInfo<'/posts/swiper', '/posts/swiper', Record<never, never>, Record<never, never>>,
    '/posts/tkinter': RouteRecordInfo<'/posts/tkinter', '/posts/tkinter', Record<never, never>, Record<never, never>>,
    '/posts/tmpl-cli': RouteRecordInfo<'/posts/tmpl-cli', '/posts/tmpl-cli', Record<never, never>, Record<never, never>>,
    '/posts/train': RouteRecordInfo<'/posts/train', '/posts/train', Record<never, never>, Record<never, never>>,
    '/posts/vscode': RouteRecordInfo<'/posts/vscode', '/posts/vscode', Record<never, never>, Record<never, never>>,
    '/posts/zsh-windows': RouteRecordInfo<'/posts/zsh-windows', '/posts/zsh-windows', Record<never, never>, Record<never, never>>,
    '/projects/': RouteRecordInfo<'/projects/', '/projects', Record<never, never>, Record<never, never>>,
    '/zh/': RouteRecordInfo<'/zh/', '/zh', Record<never, never>, Record<never, never>>,
    '/zh/demos/': RouteRecordInfo<'/zh/demos/', '/zh/demos', Record<never, never>, Record<never, never>>,
    '/zh/interview/': RouteRecordInfo<'/zh/interview/', '/zh/interview', Record<never, never>, Record<never, never>>,
    '/zh/navs/': RouteRecordInfo<'/zh/navs/', '/zh/navs', Record<never, never>, Record<never, never>>,
    '/zh/navs/libraries': RouteRecordInfo<'/zh/navs/libraries', '/zh/navs/libraries', Record<never, never>, Record<never, never>>,
    '/zh/navs/tools': RouteRecordInfo<'/zh/navs/tools', '/zh/navs/tools', Record<never, never>, Record<never, never>>,
    '/zh/posts/': RouteRecordInfo<'/zh/posts/', '/zh/posts', Record<never, never>, Record<never, never>>,
    '/zh/posts/2021': RouteRecordInfo<'/zh/posts/2021', '/zh/posts/2021', Record<never, never>, Record<never, never>>,
    '/zh/posts/algolia': RouteRecordInfo<'/zh/posts/algolia', '/zh/posts/algolia', Record<never, never>, Record<never, never>>,
    '/zh/posts/aug': RouteRecordInfo<'/zh/posts/aug', '/zh/posts/aug', Record<never, never>, Record<never, never>>,
    '/zh/posts/big-screen': RouteRecordInfo<'/zh/posts/big-screen', '/zh/posts/big-screen', Record<never, never>, Record<never, never>>,
    '/zh/posts/bs2022': RouteRecordInfo<'/zh/posts/bs2022', '/zh/posts/bs2022', Record<never, never>, Record<never, never>>,
    '/zh/posts/buy-car': RouteRecordInfo<'/zh/posts/buy-car', '/zh/posts/buy-car', Record<never, never>, Record<never, never>>,
    '/zh/posts/convolution': RouteRecordInfo<'/zh/posts/convolution', '/zh/posts/convolution', Record<never, never>, Record<never, never>>,
    '/zh/posts/debug_test': RouteRecordInfo<'/zh/posts/debug_test', '/zh/posts/debug_test', Record<never, never>, Record<never, never>>,
    '/zh/posts/deepin': RouteRecordInfo<'/zh/posts/deepin', '/zh/posts/deepin', Record<never, never>, Record<never, never>>,
    '/zh/posts/docker': RouteRecordInfo<'/zh/posts/docker', '/zh/posts/docker', Record<never, never>, Record<never, never>>,
    '/zh/posts/es6': RouteRecordInfo<'/zh/posts/es6', '/zh/posts/es6', Record<never, never>, Record<never, never>>,
    '/zh/posts/file-download': RouteRecordInfo<'/zh/posts/file-download', '/zh/posts/file-download', Record<never, never>, Record<never, never>>,
    '/zh/posts/forwardemail': RouteRecordInfo<'/zh/posts/forwardemail', '/zh/posts/forwardemail', Record<never, never>, Record<never, never>>,
    '/zh/posts/git': RouteRecordInfo<'/zh/posts/git', '/zh/posts/git', Record<never, never>, Record<never, never>>,
    '/zh/posts/git-commit': RouteRecordInfo<'/zh/posts/git-commit', '/zh/posts/git-commit', Record<never, never>, Record<never, never>>,
    '/zh/posts/gpt': RouteRecordInfo<'/zh/posts/gpt', '/zh/posts/gpt', Record<never, never>, Record<never, never>>,
    '/zh/posts/java': RouteRecordInfo<'/zh/posts/java', '/zh/posts/java', Record<never, never>, Record<never, never>>,
    '/zh/posts/js-re': RouteRecordInfo<'/zh/posts/js-re', '/zh/posts/js-re', Record<never, never>, Record<never, never>>,
    '/zh/posts/make-name': RouteRecordInfo<'/zh/posts/make-name', '/zh/posts/make-name', Record<never, never>, Record<never, never>>,
    '/zh/posts/md-it-diagarm': RouteRecordInfo<'/zh/posts/md-it-diagarm', '/zh/posts/md-it-diagarm', Record<never, never>, Record<never, never>>,
    '/zh/posts/mermaid': RouteRecordInfo<'/zh/posts/mermaid', '/zh/posts/mermaid', Record<never, never>, Record<never, never>>,
    '/zh/posts/npm-cdn': RouteRecordInfo<'/zh/posts/npm-cdn', '/zh/posts/npm-cdn', Record<never, never>, Record<never, never>>,
    '/zh/posts/own-api': RouteRecordInfo<'/zh/posts/own-api', '/zh/posts/own-api', Record<never, never>, Record<never, never>>,
    '/zh/posts/pinia': RouteRecordInfo<'/zh/posts/pinia', '/zh/posts/pinia', Record<never, never>, Record<never, never>>,
    '/zh/posts/pnpm-pkg': RouteRecordInfo<'/zh/posts/pnpm-pkg', '/zh/posts/pnpm-pkg', Record<never, never>, Record<never, never>>,
    '/zh/posts/pytorch': RouteRecordInfo<'/zh/posts/pytorch', '/zh/posts/pytorch', Record<never, never>, Record<never, never>>,
    '/zh/posts/re-soup': RouteRecordInfo<'/zh/posts/re-soup', '/zh/posts/re-soup', Record<never, never>, Record<never, never>>,
    '/zh/posts/rewrite-blazeb2': RouteRecordInfo<'/zh/posts/rewrite-blazeb2', '/zh/posts/rewrite-blazeb2', Record<never, never>, Record<never, never>>,
    '/zh/posts/sass': RouteRecordInfo<'/zh/posts/sass', '/zh/posts/sass', Record<never, never>, Record<never, never>>,
    '/zh/posts/swiper': RouteRecordInfo<'/zh/posts/swiper', '/zh/posts/swiper', Record<never, never>, Record<never, never>>,
    '/zh/posts/tkinter': RouteRecordInfo<'/zh/posts/tkinter', '/zh/posts/tkinter', Record<never, never>, Record<never, never>>,
    '/zh/posts/tmpl-cli': RouteRecordInfo<'/zh/posts/tmpl-cli', '/zh/posts/tmpl-cli', Record<never, never>, Record<never, never>>,
    '/zh/posts/train': RouteRecordInfo<'/zh/posts/train', '/zh/posts/train', Record<never, never>, Record<never, never>>,
    '/zh/posts/vscode': RouteRecordInfo<'/zh/posts/vscode', '/zh/posts/vscode', Record<never, never>, Record<never, never>>,
    '/zh/posts/zsh-windows': RouteRecordInfo<'/zh/posts/zsh-windows', '/zh/posts/zsh-windows', Record<never, never>, Record<never, never>>,
    '/zh/projects/': RouteRecordInfo<'/zh/projects/', '/zh/projects', Record<never, never>, Record<never, never>>,
  }
}
