<script lang="ts" setup>
import { PLACES } from './data'

const centerPoint = ref([])
const centerZoom = ref(5.02)
const mapRef = ref<any>(null)

// 高德地图类型声明（可选）
declare global {
  interface Window {
    _AMapSecurityConfig?: {
      securityJsCode: string
    }
  }
}

declare const AMapLoader: any

function resetMap() {
  mapRef.value.setZoomAndCenter(centerZoom.value, centerPoint.value)
}
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

        mapRef.value = map

        // 存放 marker 引用，便于通过页面按钮删除
        ; (window as any)._travelMarkers = (window as any)._travelMarkers || new Map<string, any>()
        ; (window as any).clearMarker = (id: string) => {
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
          ; (window as any)._travelMarkers.set(id, marker)

          const detailInfo = new AMap.InfoWindow({
            content: `<div style="padding:8px 10px;line-height:1.3;max-width:260px"><strong style=\"display:block;margin-bottom:6px\">${place.name}</strong><div style=\"font-size:13px;color:#444\">${place.detail || ''}</div><div style=\"margin-top:6px;font-size:12px;color:#888\">${place.dateShort || ''}</div></div>`,
            offset: new AMap.Pixel(0, 0),
          })

          marker.on('mouseover', () => detailInfo.open(map, marker.getPosition()))
          marker.on('mouseout', () => detailInfo.close())
        })

        try {
          map.setFitView()
          setTimeout(() => {
            const currentCenter = map.getCenter().toJSON()
            const currentZoom = map.getZoom()
            centerZoom.value = currentZoom
            centerPoint.value = currentCenter
          }, 0)
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
  <div class="cursor-pointer text-center text-xs">
    <div class="p-2" @click="resetMap">
      重新加载地图
    </div>
  </div>
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
