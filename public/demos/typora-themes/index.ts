// 导入CSS文件
const ayuMirage = '/demos/typora-themes/dark/typora-ayu-mirage.css'
const charcoal = '/demos/typora-themes/dark/typora-charcoal.css'
const cobalt = '/demos/typora-themes/dark/typora-cobalt.css'
const darkGraphite = '/demos/typora-themes/dark/typora-dark-graphite.css'
const dieci = '/demos/typora-themes/dark/typora-dieci.css'
const dracula = '/demos/typora-themes/dark/typora-dracula.css'
const gotham = '/demos/typora-themes/dark/typora-gotham.css'
const lighthouse = '/demos/typora-themes/dark/typora-lighthouse.css'
const nord = '/demos/typora-themes/dark/typora-nord.css'
const panic = '/demos/typora-themes/dark/typora-panic.css'
const solarizedDark = '/demos/typora-themes/dark/typora-solarized-dark.css'
const toothpaste = '/demos/typora-themes/dark/typora-toothpaste.css'
const githubDark = '/demos/typora-themes/dark/github-dark.css'

// light themes
const ayu = '/demos/typora-themes/light/typora-ayu.css'
const contrast = '/demos/typora-themes/light/typora-contrast.css'
const dBoring = '/demos/typora-themes/light/typora-d-boring.css'
const duotoneHeat = '/demos/typora-themes/light/typora-duotone-heat.css'
const duotoneLight = '/demos/typora-themes/light/typora-duotone-light.css'
const gandalf = '/demos/typora-themes/light/typora-gandalf.css'
const indigo = '/demos/typora-themes/light/typora-indigo.css'
const larkBoldColor = '/demos/typora-themes/light/typora-lark-bold-color.css'
const lark = '/demos/typora-themes/light/typora-lark.css'
const oliveDunk = '/demos/typora-themes/light/typora-olive-dunk.css'
const redGraphite = '/demos/typora-themes/light/typora-red-graphite.css'
const solarizedLight = '/demos/typora-themes/light/typora-solarized-light.css'
const githubLight = '/demos/typora-themes/light/github-light.css'

export const themes: Record<string, {
  [key: string]: any
}> = {
  dark: {
    githubDark,
    ayuMirage,
    charcoal,
    cobalt,
    darkGraphite,
    dieci,
    dracula,
    gotham,
    lighthouse,
    nord,
    panic,
    solarizedDark,
    toothpaste,
  },
  light: {
    githubLight,
    ayu,
    contrast,
    dBoring,
    duotoneHeat,
    duotoneLight,
    gandalf,
    indigo,
    larkBoldColor,
    lark,
    oliveDunk,
    redGraphite,
    solarizedLight,
  },
}
