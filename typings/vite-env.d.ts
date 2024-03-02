/// <reference types="vite/client" />

declare module "pages-generated" {
  import type { RouteRecordRaw } from "vue-router";

  const routes: RouteRecordRaw[];
  export default routes;
}

declare module "vue-router-better-scroller";
