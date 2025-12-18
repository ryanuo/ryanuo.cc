<script lang="ts" setup>
import { onMounted } from 'vue'

// 高德地图类型声明（可选）
declare global {
  interface Window {
    _AMapSecurityConfig?: {
      securityJsCode: string
    }
  }
}

declare const AMapLoader: any

// 加载地图函数
interface Place {
  name: string
  location?: number[]
  dateShort?: string
  detail?: string
}

// https://lbs.amap.com/tools/picker
// 简单地点列表（基于 train.md），使用合理近似经纬度
const PLACES: Place[] = [
  { name: '石家庄', location: [114.522656, 38.040616], dateShort: '2025-12-10', detail: '河北博物馆、金缕玉衣' },
  { name: '正定', location: [114.561061, 38.162039], dateShort: '2025-12-11', detail: '正定古城 / 夜市' },
  { name: '宿州', location: [116.9636, 33.6468], dateShort: '2025-12-11', detail: '宿州（见朋友）' },
  { name: '合肥', location: [117.2272, 31.8206], dateShort: '2025-12-12', detail: '合柴1972、安徽博物馆' },
  { name: '徐州', location: [117.2841, 34.2044], dateShort: '2025-12-13', detail: '富国街、宝莲寺、云龙山' },
  { name: '平遥古城', location: [112.1750, 37.2006], dateShort: '2025-11-14', detail: '平遥古城' },
  { name: '郑州海洋馆', location: [113.6654, 34.7570], dateShort: '2025-03-14', detail: '观看海洋表演' },
  { name: '郑州动物园', location: [113.6600, 34.7550], dateShort: '2024-12-28', detail: '动物园' },
  { name: '郑州植物园', location: [113.6620, 34.7540], dateShort: '2024-12-22', detail: '植物园' },
  { name: '洛阳·老君山', location: [112.4651, 34.6646], dateShort: '2024-11-24', detail: '老君山' },
  { name: '只有河南·戏剧幻城', location: [114.002921, 34.799139], dateShort: '2024-08-02', detail: '戏剧幻城' },
  { name: '西安', location: [108.9398, 34.3416], dateShort: '2024-05-18', detail: '西安城墙、回民街' },
  { name: '泰山', location: [117.0982, 36.2575], dateShort: '2023-03-24', detail: '夜爬泰山、拍日出' },
  { name: '绵山', location: [112.9586, 37.6074], dateShort: '2020-05-19', detail: '绵山' },
]

// https://console.amap.com/dev/key/app
function loadMap(): void {
  window._AMapSecurityConfig = {
    securityJsCode: import.meta.env.VITE_GEO_SECURITY_JS_CODE || '',
  }

  const loaderScript = document.createElement('script')
  loaderScript.src = 'https://webapi.amap.com/loader.js'

  loaderScript.onload = () => {
    AMapLoader.load({
      key: import.meta.env.VITE_GEO_KEY || '',
      version: '2.0',
    })
      .then((AMap: any) => {
        const map = new AMap.Map('mapView', {
          center: [116.397428, 39.90923],
          zoom: 5,
          mapStyle: 'amap://styles/whitesmoke',
          resizeEnable: true,
          zoomEnable: true,
          dragEnable: true,
          doubleClickZoom: true,
          scrollWheel: true,
          touchZoom: true,
        })

        // 存放 marker 引用，便于通过页面按钮删除
        ;(window as any)._travelMarkers = (window as any)._travelMarkers || new Map<string, any>()
        ;(window as any).clearMarker = (id: string) => {
          const m = (window as any)._travelMarkers.get(id)
          if (m) {
            try {
              m.setMap(null)
            }
            catch {
              // ignore
            }
            (window as any)._travelMarkers.delete(id)
          }
        }

        PLACES.forEach((place) => {
          // 使用 HTML 字符串作为 marker 内容，这样可以自定义结构和交互
          const id = `marker_${place.name.replace(/\s+/g, '_')}_${Math.random().toString(36).slice(2, 8)}`
          const markerContent = `
            <div class="custom-content-marker">
              <img class="no-preview" src="https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png" alt="${place.name}" />
            </div>
          `

          const marker = new AMap.Marker({
            position: new AMap.LngLat(place.location?.[0], place.location?.[1]),
            title: place.name,
            // 将 html 传给 content
            content: markerContent,
            // 以 content 的 [center bottom] 为原点，微调以对齐尖点
            offset: new AMap.Pixel(-12, -34),
          })

          marker.setMap(map)
          ;(window as any)._travelMarkers.set(id, marker)

          const detailInfo = new AMap.InfoWindow({
            content: `<div style="padding:8px 10px;line-height:1.3;max-width:260px"><strong style=\"display:block;margin-bottom:6px\">${place.name}</strong><div style=\"font-size:13px;color:#444\">${place.detail || ''}</div><div style=\"margin-top:6px;font-size:12px;color:#888\">${place.dateShort || ''}</div></div>`,
            offset: new AMap.Pixel(0, 0),
          })

          marker.on('mouseover', () => detailInfo.open(map, marker.getPosition()))
          marker.on('mouseout', () => detailInfo.close())
        })

        try {
          map.setFitView()
        }
        catch {
          // ignore
        }

        // 添加工具栏以显示缩放按钮（兼容性保护）
        try {
          const toolbar = new AMap.ToolBar()
          map.addControl(toolbar)
        }
        catch {
          // ignore
        }

        console.warn('高德地图加载并添加标记完成')
      })
      .catch((error: any) => console.error('高德地图加载失败:', error))
  }

  loaderScript.onerror = (error: any) => console.error('高德地图 Loader 加载错误:', error)

  document.head.appendChild(loaderScript)
}

onMounted(() => loadMap())
</script>

<template>
  <div id="mapView" style="width: 100%; height: 500px;" />
</template>

<style>
.custom-content-marker {
  position: relative;
  width: 25px;
  height: 34px;
}

.custom-content-marker img {
  width: 100%;
  height: 100%;
}
</style>
