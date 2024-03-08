// src/i18n/index.js
import { createI18n } from "vue-i18n";
import { messages } from "./locales";

const lang = useStorage("lang", "en-US");
const i18n = createI18n({
  legacy: false,
  locale: lang.value, // 默认语言
  fallbackLocale: "en-US",
  messages,
});

export default i18n;

export const langIconMap: Record<string, string> = {
  "zh-CN": "i-icon-park-outline-chinese",
  "en-US": "i-icon-park-outline-english",
};
export function handleLanguageSwitch(to: any, next: any): void {
  if (!lang.value || typeof lang.value !== "string") {
    console.error("Invalid language value");
    next();
    return;
  }

  const targetPath = lang.value === "zh-CN" ? "/zh" : "";

  if (targetPath && !to.path.startsWith(targetPath)) {
    const newPath = `${targetPath}${to.fullPath.replace(/^\/?/, "/")}`;
    next(newPath);
  } else if (!targetPath && to.path.startsWith("/zh")) {
    const newPath = to.fullPath.replace(/^\/zh/, "");
    next(newPath);
  } else {
    next();
  }
}
