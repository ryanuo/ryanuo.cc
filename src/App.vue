<script setup lang="ts">
import mermaid from 'mermaid'
// import { MarkdownItDiagramDomScript } from '../../markdown-it-diagram/src/dom' // test only
import { MarkdownItDiagramDomScript } from 'markdown-it-diagram/dom'
import { useImagePreview } from '~/hooks/useImagePreview'

const route = useRoute()
const { imageModel } = useImagePreview()

onBeforeMount(() => {
  import('./lang-modal.ts' as any)
})

onMounted(async () => {
  mermaid.initialize({ startOnLoad: false })
  await mermaid.run()
  await MarkdownItDiagramDomScript()
})

onKeyStroke('Escape', (e) => {
  if (imageModel.value) {
    imageModel.value = undefined
    e.preventDefault()
  }
})
</script>

<template>
  <NavBar />
  <main class="of-x-hidden px-7 py-10">
    <RouterView />
    <Footer v-if="route.path" />
  </main>

  <Transition name="fade">
    <div
      v-if="imageModel"

      fixed bottom-0 left-0 right-0 top-0 z-500 p-6 backdrop-blur-7
      @click="imageModel = undefined"
    >
      <div absolute bottom-0 left-0 right-0 top-0 z--1 bg-black:30 />
      <img
        :src="imageModel.src"
        :alt="imageModel.alt"

        h-full w-full object-contain
      >
    </div>
  </Transition>
</template>

<style scoped></style>
