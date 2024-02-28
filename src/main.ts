import autoRoutes from "pages-generated";
import "virtual:uno.css";
import { ViteSSG } from "vite-ssg";
import App from "./App.vue";
import "./style.css";

const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith("/") ? `${i.path}index.html` : `${i.path}.html`,
  };
});

export const createApp = ViteSSG(App, {
  routes,
});

console.log(routes, "routes");
