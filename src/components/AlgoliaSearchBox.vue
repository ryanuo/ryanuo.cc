<script setup lang="ts">
import '@docsearch/css'
import docsearch from '@docsearch/js'
import { nextTick, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import type { DocSearchProps } from './doc-search'

type AlgoliaSearchOptions = DocSearchProps

const props = defineProps<{
  algolia: AlgoliaSearchOptions
}>()

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()

onMounted(update)
watch(locale, update)

async function update() {
  await nextTick()
  const options = props.algolia
  initialize({
    ...options,
    searchParameters: {
      ...options.searchParameters,
      facetFilters: [
        ...(options.searchParameters?.facetFilters ?? []),
        `tags:${locale.value}`,
      ],
    },
  })
}

type DocSearchProps1 = Parameters<typeof docsearch>[0]
function initialize(userOptions: AlgoliaSearchOptions) {
  const options = Object.assign<
    {},
    AlgoliaSearchOptions,
    Partial<DocSearchProps1>
  >({}, userOptions, {
    container: '#docsearch',

    navigator: {
      navigate({ itemUrl }: unknown) {
        const { pathname: hitPathname } = new URL(
          window.location.origin + itemUrl,
        )

        // router doesn't handle same-page navigation so we use the native
        // browser location API for anchor navigation
        if (route.path === hitPathname)
          window.location.assign(window.location.origin + itemUrl)
        else
          router.go(itemUrl)
      },
    },

    transformItems(items: any) {
      return items.map((item: any) => {
        return Object.assign({}, item, {
          url: getRelativePath(item.url),
        })
      })
    },

    hitComponent({ hit, children }: any) {
      return {
        __v: null,
        type: 'a',
        ref: undefined,
        constructor: undefined,
        key: undefined,
        props: { href: hit.url, children },
      }
    },
  }) as DocSearchProps

  docsearch(options)
}

function getRelativePath(url: string) {
  const { pathname, hash } = new URL(url, location.origin)
  return pathname.replace(/\.html$/, '' ? '' : '.html') + hash
}
</script>

<template>
  <div id="docsearch" />
</template>
