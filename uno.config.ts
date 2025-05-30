// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        // sans: "Baloo Thambi 2",
        sans: ['Work Sans', 'Inter:400,600,800', 'HarmonyOS_Regular', 'Bonheur Royale'],
        mono: 'DM Mono:400,600',
        ai: 'Kaushan Script',
      },
    }),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        'display': 'inline-block',
        'height': '1.2em',
        'width': '1.2em',
        'vertical-align': 'middle',
      },
    }),
  ],
  content: {
    pipeline: {
      include: ['**/*.{vue,html,js,ts,jsx,tsx,md}'],
      exclude: ['node_modules', '.git', 'dist', 'public'],
    },
  },
  transformers: [transformerDirectives()],
})
