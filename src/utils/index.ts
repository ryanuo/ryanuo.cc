import dayjs from 'dayjs'

export function calculateWorkYears(startYear: number, startMonth: number) {
  // 构建起始时间和当前时间的Dayjs对象
  const startDate = dayjs(new Date(startYear, startMonth - 1)) // JavaScript中月份是从0开始的
  const currentDate = dayjs()

  // 计算两个日期之间的差值，以月为单位，然后转换为年
  const diffInMonths = currentDate.diff(startDate, 'month')

  // 将月份转换为年，并保留一位小数
  const years = diffInMonths / 12
  const fractionalPart = years % 1 // 获取年份的小数部分

  // 如果小数部分小于.5，则直接使用整数部分，否则进行四舍五入
  if (fractionalPart <= 0.5)
    return years.toFixed(1)
  else
    return Math.round(years)
}

export function slug(name: string) {
  return name.toLowerCase().replace(/[\s\\/]+/g, '-')
}

export function formatDateToMarDD(dateString?: string, year = false): string {
  if (!dateString)
    return ''
  const date = dayjs(dateString)
  const month = date.format('MMM') // 获取月份的缩写形式，比如 "Mar"
  const day = date.format('DD') // 获取日期的格式，比如 "16"
  return `${month} ${day}${year ? `. ${date.format('YYYY')}` : ''}`
}

export function openLinkInPopup(url: string) {
  if (!url)
    return
  // Check if the URL is a valid link
  window.open(url, '_blank')
}
