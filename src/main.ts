import NProgress from "nprogress";
import autoRoutes from "pages-generated";
import { ViteSSG, ViteSSGContext } from "vite-ssg";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "./style/markdown.css";
import "./style/prose.css";
import "./style/style.css";

import App from "./App.vue";
NProgress.configure({ showSpinner: false });
const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith("/") ? `${i.path}index.html` : `${i.path}.html`,
  };
});

export const createApp = ViteSSG(
  App,
  {
    routes,
  },
  ({ router, isClient }: ViteSSGContext) => {
    if (isClient) {
      router.beforeEach(() => {
        NProgress.start();
      });
      router.afterEach(() => {
        NProgress.done();
      });
    }
  }
);

console.log(routes, "routes");
