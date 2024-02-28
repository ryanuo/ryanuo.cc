import Vue from "@vitejs/plugin-vue";
import fs from "fs-extra";
import matter from "gray-matter";
import { resolve } from "node:path";
import UnoCSS from "unocss/vite";
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
