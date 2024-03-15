<script lang="ts" setup>
import { calculateWorkYears } from "@/utils/";

const lang = useStorage("lang", "");
const workYear = computed(() => {
  const num = calculateWorkYears(2022, 8) as number;
  return lang.value === "zh-CN" ? numberToChinese(num) : numberToEnglish(num);
});
function numberToEnglish(num: number): string {
  const englishNumbers = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ]; // 英文数字数组
  return englishNumbers[num] || num.toString();
}

function numberToChinese(num: number): string {
  const chineseNumbers = [
    "〇",
    "一",
    "两",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
  ]; // 中文数字数组
  return chineseNumbers[num] || num.toString();
}
</script>
<template>
  <span>{{ workYear }}</span>
</template>
