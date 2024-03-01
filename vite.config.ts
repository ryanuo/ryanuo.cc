import Vue from "@vitejs/plugin-vue";
import fs from "fs-extra";
import matter from "gray-matter";
import { resolve } from "node:path";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import Components from "unplugin-vue-components/vite";
import Markdown from "unplugin-vue-markdown/vite";
import { defineConfig } from "vite";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [{ find: "@/", replacement: `${resolve(__dirname, "src")}/` }],
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
      // reactivityTransform: true,
      script: {
        defineModel: true,
      },
    }),
    UnoCSS(),
    Pages({
      extensions: ["vue", "md"],
      dirs: "pages",
      extendRoute(route) {
        const path = resolve(__dirname, route.component.slice(1));

        if (path.endsWith(".md")) {
          const md = fs.readFileSync(path, "utf-8");
          const { data } = matter(md);
          route.meta = Object.assign(route.meta || {}, { frontmatter: data });
        }

        return route;
      },
    }),
    AutoImport({
      imports: ["vue", "vue-router", "@vueuse/core"],
      dts: "typings/auto-imports.d.ts",
    }),
    Markdown({
      wrapperComponent: "WrapPost",
      wrapperClasses: (id, code) => {
        console.log(code);
        return code.includes("@layout-full-width")
          ? ""
          : "prose m-auto slide-enter-content";
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
});
