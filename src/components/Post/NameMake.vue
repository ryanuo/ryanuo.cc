<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

interface Item { name: string, index: number }
type NameData = Record<string, Record<number, Item[]>>
type TabType = 'nan' | 'nv'
const nameDataList = reactive<NameData>({})
const tab = ref<TabType>('nan')
const isCopy = ref(false)

const state = useStorage<{ sex: TabType, name: string }[]>('my-like-name-list', [])

const { query } = useRoute()

onMounted(() => {
  fetch('/name-data.json').then(res => res.json()).then((data: Record<string, Record<string, number>>) => {
    Object.entries(data).forEach(([k, v]) => {
      if (!nameDataList[k])
        nameDataList[k] = {}

      Object.entries(v).forEach(([key, value]) => {
        if (!nameDataList[k][value])
          nameDataList[k][value] = []

        nameDataList[k][value].push({ name: key, index: nameDataList[k][value].length })
      })
    })
  })
})

const tableMaxMap = computed(() => {
  const nameMap = nameDataList[tab.value]
  if (nameMap?.[1].length > nameMap?.[2].length)
    return nameMap[1]
  return nameMap?.[2] || []
})

function remove(index: number) {
  state.value.splice(index, 1)
}

function handleMeLikeName(item: Item) {
  if (!item)
    return
  if (state.value.find(i => i.name === item.name)) {
    remove(state.value.findIndex(i => i.name === item.name))
    return
  }

  state.value.push({
    sex: tab.value,
    name: item.name,
  })
}

function renderTdName(item: Item) {
  return `${item?.name ? `${query?.xing ?? '高'}${item?.name}` : '-'}`
}

function isExit(item: Item) {
  return state.value.find(i => i.name === item?.name)
}

function getNameByIndex(item: Item, n: number) {
  return nameDataList[tab.value][n]?.[item.index]
}

async function copyToClipboard(): Promise<void> {
  try {
    const text_string = state.value.map(i => `${query?.xing ?? '高'}${i.name}`).join('\n')
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text_string)
      isCopy.value = true
      setTimeout(() => {
        isCopy.value = false
      }, 1000)
    }
    else {
      console.warn('The Current Environment Does Not Support Clipboard API')
    }
  }
  catch (err) {
    console.error('Failed To Copy To Clipboard:', err)
  }
}

const total_name = computed(() => {
  return [nameDataList[tab.value]?.[1]?.length, nameDataList?.[tab.value]?.[2]?.length]
})
</script>

<template>
  <div class="flex gap-2">
    <div
      v-for="(key, item) in Object.keys(nameDataList)"
      :key="item" class="cursor-pointer rounded-sm px-1" :class="{
        'bg-blue-100': tab === key,
        'text-blue-500': tab === key,
        'text-gray-500': tab !== key,
      }" @click="tab = (key as TabType)"
    >
      {{ key === 'nan' ? "Boy" : 'Girl' }} name
    </div>
  </div>
  <table class="gen-name mt-2!">
    <thead>
      <th>Index</th>
      <th>
        <div flex>
          Two <span class="mx-1 text-[0.75rem] text-blue">{{ total_name[0] }}</span>
        </div>
      </th>
      <th>
        <div flex>
          Three <span class="mx-1 text-[0.75rem] text-blue"> {{ total_name[1] }}</span>
        </div>
      </th>
    </thead>
    <RecycleScroller
      v-slot="{ item }"
      class="scroller"
      :items="tableMaxMap"
      :item-size="40"
      key-field="index"
    >
      <div class="h-1/3 flex items-center border-b p-2">
        <div flex-1>
          {{ item.index + 1 }}
        </div>
        <template v-for="n in [1, 2]" :key="n">
          <div class="p-l-2" flex-1 @click="handleMeLikeName(getNameByIndex(item, n))">
            {{ renderTdName(getNameByIndex(item, n)) }}
            <span :class="{ 'i-flat-color-icons-like mb-1': isExit(getNameByIndex(item, n)) }" />
          </div>
        </template>
      </div>
    </RecycleScroller>
  </table>
  <h4>
    My Like Name List
    <span
      class="mx-2 cursor-pointer hover:scale-110"
      :class="isCopy ? 'i-icon-park-twotone-correct text-green' : 'i-icon-park-twotone-copy'"
      @click="() => copyToClipboard()"
    />
  </h4>
  <table class="gen-name">
    <thead>
      <tr>
        <td>Index</td>
        <td>Name</td>
        <td>Sex</td>
        <td>Option</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(v, index) in state" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ renderTdName({ name: v.name, index }) }}</td>
        <td>{{ v.sex === 'nan' ? 'Boy' : 'Girl' }}</td>
        <td>
          <div
            class="i-material-symbols-delete-outline cursor-pointer"
            @click="() => remove(index)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style>
table.gen-name tbody {
  display: block;
  max-height: 300px;
  overflow-y: auto;
}

table.gen-name thead,
table.gen-name tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.scroller {
  max-height: 300px;
  overflow-y: auto;
}
</style>
