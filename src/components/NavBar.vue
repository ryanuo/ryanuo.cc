<script setup lang="ts">
function toTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

const { y: scroll } = useWindowScroll();
</script>

<template>
  <header class="header z-40">
    <RouterLink
      class="w-8 h-8 absolute xl:fixed m-7 mb-0 select-none outline-none flex flex-items-center"
      to="/"
      focusable="false"
    >
      <Logo />
    </RouterLink>

    <button
      title="Scroll to top"
      fixed
      right-3
      bottom-3
      w-10
      h-10
      hover:op100
      rounded-full
      hover-bg-hex-8883
      transition
      duration-300
      z-100
      print:hidden
      :class="scroll > 300 ? 'op30' : 'op0! pointer-events-none'"
      @click="toTop()"
    >
      <div i-ri-arrow-up-line />
    </button>
    <nav class="nav">
      <div class="spacer" />
      <div class="right" print:op0>
        <a href="https://m.ziliao88.top/" target="_blank" title="Blog">
          <span class="lt-md:hidden">Blog</span>
          <div i-ri-article-line md:hidden />
        </a>
        <RouterLink to="/projects" title="Projects">
          <span class="lt-md:hidden">Projects</span>
          <div i-ri-lightbulb-line class="md:hidden" />
        </RouterLink>
        <RouterLink to="/demos" title="Demos">
          <span class="lt-md:hidden">Demos</span>
          <div i-ri-screenshot-line class="md:hidden" />
        </RouterLink>
        <a
          href="https://twitter.com/ryanoaco"
          target="_blank"
          title="Twitter"
          class="lt-md:hidden"
        >
          <div i-ri-twitter-x-fill />
        </a>
        <a
          href="https://github.com/rr210"
          target="_blank"
          title="GitHub"
          class="lt-md:hidden"
        >
          <div i-uil-github-alt />
        </a>
        <a href="/feed.xml" target="_blank" title="RSS" class="lt-md:hidden">
          <div
            i-la-rss-square
            style="font-size: 1.25rem; margin: 0 -0.125rem"
          />
        </a>
        <ToggleTheme />
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header h1 {
  margin-bottom: 0;
}

.logo {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
}

.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav > * {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}
</style>
