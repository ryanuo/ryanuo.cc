<script setup lang="ts">
import { ref } from 'vue'

const oils = ref<any>(null)
const loading = ref(false)
const error = ref<string>('')
const provinces = ref([
  '安徽',
  '北京',
  '重庆',
  '福建',
  '甘肃',
  '广东',
  '广西',
  '贵州',
  '海南',
  '河北',
  '黑龙江',
  '河南',
  '湖北',
  '湖南',
  '江苏',
  '江西',
  '吉林',
  '辽宁',
  '内蒙古',
  '宁夏',
  '青海',
  '陕西',
  '上海',
  '山东',
  '山西',
  '四川',
  '天津',
  '西藏',
  '新疆',
  '云南',
  '浙江',
])

async function fetchOilPrice(province: string[]) {
  loading.value = true
  let apiUrl
  if (import.meta.env.DEV) {
    apiUrl = '/api/oil-price'
  }
  else {
    apiUrl = 'https://api.ryanuo.cc/oil-price'
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ province }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const res = await response.json()
    oils.value = res.data.filter((i: any) => i).map((item: any) => Object.values(item))
    error.value = ''
  }
  catch (e) {
    console.error('Error fetching oil price:', e)
    error.value = 'Failed to fetch oil price data'
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOilPrice(['山西', '四川', '河南', '广东'])
})
</script>

<template>
  <div>
    <div v-if="loading" class="mt-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><circle cx="12" cy="2" r="0" fill="currentColor"><animate attributeName="r" begin="0" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(45 12 12)"><animate attributeName="r" begin="0.125s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(90 12 12)"><animate attributeName="r" begin="0.25s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(135 12 12)"><animate attributeName="r" begin="0.375s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(180 12 12)"><animate attributeName="r" begin="0.5s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(225 12 12)"><animate attributeName="r" begin="0.625s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(270 12 12)"><animate attributeName="r" begin="0.75s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle><circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(315 12 12)"><animate attributeName="r" begin="0.875s" calcMode="spline" dur="1s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" /></circle></svg>
    </div>
    <div v-if="error">
      {{ error }}
    </div>
    <div v-if="!loading && oils">
      <table>
        <tr>
          <th>Province</th>
          <th>0(￥)</th>
          <th>89(￥)</th>
          <th>92(￥)</th>
          <th>95(￥)</th>
          <th>98(￥)</th>
        </tr>
        <tr v-for="(oilItem, index) in oils" :key="index">
          <td v-for="(oil, index) in oilItem" :key="index">
            {{ oil }}
          </td>
        </tr>
      </table>
    </div>
    <div>
      <ul class="flex flex-wrap cursor-pointer gap-1 underline underline-coolGray">
        <li v-for="(item, index) in provinces" :key="index" @click="() => fetchOilPrice([item])">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>
