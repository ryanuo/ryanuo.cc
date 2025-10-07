<script setup lang="ts">
const isDark = useDark()

// 注入主题切换相关CSS
function injectThemeToggleCSS() {
  const css = `
    :root {
      --expo-out: linear(
        0 0%,
        0.1684 2.66%,
        0.3165 5.49%,
        0.446 8.52%,
        0.5581 11.78%,
        0.6535 15.29%,
        0.7341 19.11%,
        0.8011 23.3%,
        0.8557 27.93%,
        0.8962 32.68%,
        0.9283 38.01%,
        0.9529 44.08%,
        0.9711 51.14%,
        0.9833 59.06%,
        0.9915 68.74%,
        1 100%
      );
    }
    ::view-transition-group(root) {
      animation-timing-function: var(--expo-out);
      animation-duration: 0.8s;
    }
    ::view-transition-new(root) {
      mask:
        url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="0" cy="0" r="18" fill="white" filter="url(%23blur)"/></svg>')
        top left / 0 no-repeat;
      mask-origin: content-box;
      animation: scale 0.8s ease-out forwards;
      transform-origin: top left;
      z-index: 1;
    }
    ::view-transition-old(root),
    .dark::view-transition-old(root) {
      animation: fadeOut 0.8s ease-out forwards;
      transform-origin: top left;
      z-index: 0;
    }
    @keyframes scale {
      0% {
        mask-size: 0;
      }
      100% {
        mask-size: 350vmax;
      }
    }
    @keyframes fadeOut {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `
  if (!document.getElementById('theme-toggle-css')) {
    const style = document.createElement('style')
    style.id = 'theme-toggle-css'
    style.textContent = css
    document.head.appendChild(style)
  }
}

function toggleAnimatedOne(event: MouseEvent, transition: any) {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-out',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}
function toggleTheme(event: MouseEvent, type: 'animated1' | 'animated2' | 'normal') {
  const isAppearanceTransition
    = document.startViewTransition
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition) {
    isDark.value = !isDark.value
    return
  }
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })

  if (type === 'animated1') {
    return toggleAnimatedOne(event, transition)
  }
  else if (type === 'animated2') {
    return injectThemeToggleCSS()
  }
  else {
    isDark.value = !isDark.value
  }
}
</script>

<template>
  <a class="select-none" title="Toggle Color Scheme" @click="(e) => toggleTheme(e, 'animated2')">
    <div i-ri-sun-line dark:i-ri-moon-line />
  </a>
</template>
