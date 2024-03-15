// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        // sans: "Baloo Thambi 2",
        sans: ["Inter:400,600,800", "HarmonyOS_Regular", "Pacifico"],
        mono: "DM Mono:400,600",
      },
    }),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: "inline-block",
        height: "1.2em",
        width: "1.2em",
        "vertical-align": "middle",
      },
    }),
  ],
  transformers: [transformerDirectives()],
});
