<script lang="ts" setup>
import { useLanguage } from "@/hooks/useLanguage";
import { formatDateToMarDD } from "@/utils";
import dayjs from "dayjs";

const routes = useRouter();
const { isChinese } = useLanguage();

const postsRoutes = computed(() => {
  const lang = isChinese.value ? "/zh" : "";

  return routes
    .getRoutes()
    .filter((route) => {
      const { path } = route;
      return (
        path.includes("/posts") &&
        path.startsWith(lang + "/posts") &&
        !path.endsWith(".html") &&
        !["/zh/posts", "/posts"].includes(path)
      );
    })
    .map((route) => {
      const { title, date } = route.meta.frontmatter as FrontmatterPostType;
      return { title, path: route.path, date };
    })
    .sort(
      (a, b) =>
        new Date(b.date as string).getTime() -
        new Date(a.date as string).getTime()
    );
});

const isYearGroup = (date?: string, preDate?: string) => {
  const year = dayjs(date).format("YYYY");
  const preYear = dayjs(preDate).format("YYYY");
  return year !== preYear;
};
</script>
<template>
  <ul>
    <li
      v-for="(post, index) in postsRoutes"
      :key="post.path"
      class="before:content-none!"
    >
      <div
        v-if="isYearGroup(post.date, postsRoutes[index - 1]?.date)"
        class="select-none relative h20 pointer-events-none slide-enter"
      >
        <span
          class="text-8em color-transparent absolute left--3rem top--2rem font-bold text-stroke-2 text-stroke-hex-aaa op10"
          >{{ dayjs(post.date).format("YYYY") }}</span
        >
      </div>
      <a :href="post.path" class="font-normal">{{ post.title }}</a>
      <span class="text-gray-500 dark:text-gray-400 ml-2 inline-flex text-sm">{{
        formatDateToMarDD(post.date)
      }}</span>
    </li>
  </ul>
</template>
