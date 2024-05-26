/// <reference types="vite-ssg" />

import { resolve } from "node:path";
import MarkdownItShiki from "@shikijs/markdown-it";
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";
import Vue from "@vitejs/plugin-vue";
import fs from "fs-extra";
import matter from "gray-matter";
import anchor from "markdown-it-anchor";
import LinkAttributes from "markdown-it-link-attributes";
import TOC from "markdown-it-table-of-contents";
import { visualizer } from "rollup-plugin-visualizer";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
import Markdown from "unplugin-vue-markdown/vite";
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import textualUml from "markdown-it-textual-uml";
import type { UserConfig } from "vite";
import type { MarkdownIt } from 'markdown-it'

import { slugify } from "./scripts/slugify";

// https://vitejs.dev/config/
export default {
  resolve: {
    alias: [{ find: "~/", replacement: `${resolve(__dirname, "src")}/` }],
  },
  plugins: [
    visualizer({
      // 打包完成后自动打开浏览器，显示产物体积报告
      open: true,
    }),
    Vue({
      include: [/\.vue$/, /\.md$/],
      // reactivityTransform: true,
      script: {
        defineModel: true,
      },
    }),
    UnoCSS(),
    VueRouter({
      extensions: ['.vue', '.md'],
      routesFolder: 'pages',
      logs: true,
      dts: 'typings/routes.d.ts',
      extendRoute(route) {
        const path = route.components.get('default')
        if (!path)
          return

        if (path.endsWith('.md')) {
          const { data } = matter(fs.readFileSync(path, 'utf-8'))
          route.addToMeta({
            frontmatter: data,
          })
        }
      },
    }),
    AutoImport({
      imports: ["vue", VueRouterAutoImports, "@vueuse/core"],
      dts: "typings/auto-imports.d.ts",
    }),
    Markdown({
      wrapperComponent: "WrapPost",
      wrapperClasses: (id, code) => {
        return code.includes("@layout-full-width")
          ? ""
          : "prose m-auto slide-enter-content";
      },
      headEnabled: true,
      exportFrontmatter: false,
      exposeFrontmatter: false,
      exposeExcerpt: false,
      async markdownItSetup(md) {
        md.use(LinkAttributes as MarkdownIt, {
          matcher: (link: string) => /^https?:\/\//.test(link),
          attrs: {
            target: "_blank",
            rel: "noopener",
          },
        });

        md.use(
          await MarkdownItShiki({
            themes: {
              dark: "vitesse-dark",
              light: "vitesse-light",
            },
            defaultColor: false,
            cssVariablePrefix: "--s-",
            transformers: [
              transformerTwoslash({
                explicitTrigger: true,
                renderer: rendererRich(),
              }),
            ],
          }) as MarkdownIt
        );

        md.use(textualUml);

        md.use(TOC, {
          includeLevel: [1, 2, 3, 4],
          slugify,
          containerHeaderHtml:
            '<div class="table-of-contents-anchor"><div class="i-ri-menu-2-fill" /></div>',
        });

        md.use(anchor, {
          slugify,
          permalink: anchor.permalink.linkInsideHeader({
            symbol: "#",
            renderAttrs: () => ({ "aria-hidden": "true" }),
          }),
        });

        // md.use(MdItReplace, "foo_replace", "text", (tokens, formter, idx) => {
        //   if (formter.id === "ryanco") {
        //     if (tokens[idx].content.indexOf("[workyears]") !== -1) {
        //       tokens[idx].content = tokens[idx].content.replace(
        //         "[workyears]",
        //         calculateWorkYears(2022, 8)
        //       );
        //     }
        //   }
        // });
      },
    }),
    Components({
      extensions: ["vue", "md"],
      dts: "typings/components.d.ts",
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [
        IconsResolver({
          componentPrefix: "",
        }),
      ],
    }),
    Icons({
      defaultClass: "inline",
      defaultStyle: "vertical-align: sub;",
    }),
  ],
  optimizeDeps: {
    include: [
      "vue",
      "vue-router",
      "@vueuse/core",
      "dayjs",
      "dayjs/plugin/localizedFormat",
    ],
  },
  build: {
    rollupOptions: {
      onwarn(warning, next) {
        if (warning.code !== "UNUSED_EXTERNAL_IMPORT") next(warning);
      },
    },
  },
  ssgOptions: {
    formatting: "minify",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
} as UserConfig
