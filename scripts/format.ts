import dayjs from "dayjs";

export function calculateWorkYears(startYear: number, startMonth: number) {
  // 构建起始时间和当前时间的Dayjs对象
  const startDate = dayjs(new Date(startYear, startMonth - 1)); // JavaScript中月份是从0开始的
  const currentDate = dayjs();

  // 计算两个日期之间的差值，以月为单位，然后转换为年
  const diffInMonths = currentDate.diff(startDate, "month");

  // 将月份转换为年，并保留一位小数
  let years = diffInMonths / 12;
  let fractionalPart = years % 1; // 获取年份的小数部分

  // 如果小数部分小于.5，则直接使用整数部分，否则进行四舍五入
  if (fractionalPart <= 0.5) {
    return years.toFixed(1);
  } else {
    return Math.round(years);
  }
}
