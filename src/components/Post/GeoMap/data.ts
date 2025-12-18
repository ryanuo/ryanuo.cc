// 加载地图函数
interface Place {
  name: string
  location?: number[]
  dateShort?: string
  detail?: string
}

// https://lbs.amap.com/tools/picker
export const PLACES: Place[] = [
  /**
   * 河北
   */
  {
    name: '石家庄',
    location: [114.522656, 38.040616],
    dateShort: '2025-12-10',
    detail: '河北-河北博物馆、金缕玉衣',
  },
  {
    name: '正定',
    location: [114.561061, 38.162039],
    dateShort: '2025-12-11',
    detail: '河北-正定古城 / 夜市',
  },
  /**
   * 安徽
   */
  {
    name: '相山国家森林公园',
    location: [116.793755, 33.990945],
    dateShort: '2025-04-14',
    detail: '安徽淮北-相山国家森林公园',
  },
  {
    name: '宿州',
    location: [116.9636, 33.6468],
    dateShort: '2025-12-11',
    detail: '宿州（见朋友）',
  },
  {
    name: '安徽博物馆',
    location: [117.220595, 31.802102],
    dateShort: '2025-12-12',
    detail: '安徽合肥-安徽博物馆',
  },
  {
    name: '合柴1972',
    location: [117.245085, 31.797911],
    dateShort: '2025-12-12',
    detail: '安徽合肥-合柴1972',
  },
  {
    name: '合肥三件套',
    location: [117.157926, 31.853557],
    dateShort: '2025-12-12',
    detail: '安徽合肥-合肥三件套',
  },
  /**
   * 江苏
   */
  {
    name: '富国街',
    location: [117.157926, 31.853557],
    dateShort: '2025-12-13',
    detail: '江苏徐州-富国街',
  },
  {
    name: '宝莲寺',
    location: [114.369982, 36.007729],
    dateShort: '2025-12-13',
    detail: '江苏徐州-宝莲寺',
  },
  {
    name: '云龙山',
    location: [117.176845, 34.237675],
    dateShort: '2025-12-13',
    detail: '江苏徐州-云龙山',
  },
  {
    name: '壹捌夜市',
    location: [117.186273, 34.268883],
    dateShort: '2025-12-13',
    detail: '江苏徐州-壹捌夜市',
  },
  /**
   * 山西
   */
  {
    name: '平遥古城',
    location: [112.1750, 37.2006],
    dateShort: '2025-11-14',
    detail: '山西-平遥古城',
  },
  {
    name: '绵山',
    location: [112.9586, 37.6074],
    dateShort: '2020-05-19',
    detail: '山西-绵山',
  },
  /**
   * 河南
   */
  {
    name: '郑州海洋馆',
    location: [113.6654, 34.7570],
    dateShort: '2025-03-14',
    detail: '河南郑州-观看海洋表演',
  },
  {
    name: '郑州动物园',
    location: [113.685214, 34.789401],
    dateShort: '2024-12-28',
    detail: '河南郑州-动物园',
  },
  {
    name: '郑州植物园',
    location: [113.536584, 34.734592],
    dateShort: '2024-12-22',
    detail: '河南郑州-植物园',
  },
  {
    name: '洛阳·老君山',
    location: [112.4651, 34.6646],
    dateShort: '2024-11-24',
    detail: '河南洛阳-老君山',
  },
  {
    name: '只有河南·戏剧幻城',
    location: [114.002921, 34.799139],
    dateShort: '2024-08-02',
    detail: '河南郑州-只有河南·戏剧幻城',
  },
  /**
   * 陕西
   */
  {
    name: '西安城墙',
    location: [108.948183, 34.2759],
    dateShort: '2024-05-18',
    detail: '陕西西安-西安城墙',
  },
  {
    name: '回民街',
    location: [108.943607, 34.26226],
    dateShort: '2024-05-18',
    detail: '陕西西安-回民街',
  },
  {
    name: '西安博物院',
    location: [108.94171, 34.238526],
    dateShort: '2024-05-18',
    detail: '陕西西安-西安博物院',
  },
  {
    name: '大雁塔',
    location: [108.964176, 34.218229],
    dateShort: '2024-05-18',
    detail: '陕西西安-大雁塔',
  },
  {
    name: '大唐不夜城',
    location: [108.964195, 34.213992],
    dateShort: '2024-05-18',
    detail: '陕西西安-大唐不夜城',
  },
  {
    name: '广济街',
    location: [108.937164, 34.260216],
    dateShort: '2024-05-19',
    detail: '陕西西安-广济街',
  },
  {
    name: '西安世博园',
    location: [109.06116, 34.322669],
    dateShort: '2024-05-19',
    detail: '陕西西安-西安世博园',
  },
  /**
   * 山东
   */
  {
    name: '泰山',
    location: [117.0982, 36.2575],
    dateShort: '2023-03-24',
    detail: '山东-夜爬泰山、拍日出',
  },

]
