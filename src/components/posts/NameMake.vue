<script setup lang="ts">
type NameData = Record<string, Record<number, string[]>>
type TabType = 'nan' | 'nv'
const nameDataList = reactive<NameData>({})
const tab = ref<TabType>('nan')
const isCopy = ref(false)

const state = useStorage<{ sex: TabType, name: string }[]>('my-like-name-list', [])

const { query } = useRoute()

onMounted(() => {
  fetch('/name-data.json').then(res => res.json()).then((data) => {
    Object.entries(data).forEach(([k, v]: any) => {
      if (!nameDataList[k])
        nameDataList[k] = {}

      Object.entries(v).forEach(([key, value]: any) => {
        if (!nameDataList[k][value])
          nameDataList[k][value] = []

        nameDataList[k][value].push(key)
      })
    })
  })
})

function getName(name: Record<string, string[]>) {
  if (name?.[1].length > name?.[2].length)
    return name[1]
  return name?.[2] || []
}
function remove(index: number) {
  state.value.splice(index, 1)
}
function handleMeLikeName(name: string) {
  if (!name)
    return
  if (state.value.find(i => i.name === name)) {
    remove(state.value.findIndex(i => i.name === name))
    return
  }

  state.value.push({
    sex: tab.value,
    name,
  })
}

function renderTdName(name: string) {
  return `${name ? `${query?.xing ?? '高'}${name}` : '-'}`
}

function isExit(name: string) {
  return state.value.find(i => i.name === name)
}

function getNameByIndex(key: number, index: number) {
  return nameDataList[tab.value][index]?.[key]
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
      {{ key === 'nan' ? "Boy" : 'Girl' }} Name
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
    <tbody overflow-auto>
      <tr v-for="(v, key) in getName(nameDataList[tab])" :key="key">
        <td>{{ key + 1 }}</td>
        <template v-for="index in [1, 2]" :key="index">
          <td @click="handleMeLikeName(getNameByIndex(key, index))">
            {{ renderTdName(getNameByIndex(key, index)) }}
            <span :class="{ 'i-flat-color-icons-like mb-1': isExit(getNameByIndex(key, index)) }" />
          </td>
        </template>
      </tr>
    </tbody>
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
        <td>{{ renderTdName(v.name) }}</td>
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
  overflow-y: scroll;
}

table.gen-name thead,
table.gen-name tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}
</style>
