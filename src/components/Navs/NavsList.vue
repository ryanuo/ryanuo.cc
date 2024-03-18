<script setup lang="ts">
import { omit } from "lodash-es";
import { useI18n } from "vue-i18n";
interface Project {
  desc: string;
  name: string;
  link: string;
  icon: string;
  image: string;
  tags: string[];
}
const props = defineProps<{ projects: Record<string, any[]> }>();
const usedNavs = useStorage<Project[]>("used-navs", []);
const { t } = useI18n();

const el = ref<HTMLElement | null>(null);
// 使用 useStorage 保存坐标位置
const tocPosition = useStorage("draggablePosition", { x: 18, y: 130 });
const { style, x, y } = useDraggable(el, {
  initialValue: { x: tocPosition.value.x, y: tocPosition.value.y },
});

watch([x, y], ([newX, newY]) => {
  tocPosition.value.x = newX;
  tocPosition.value.y = newY;
});

function slug(name: string) {
  return name.toLowerCase().replace(/[\s\\\/]+/g, "-");
}

const pros: ComputedRef<Record<string, Project[]>> = computed(() => {
  if (usedNavs.value.length === 0) {
    return props.projects;
  } else {
    return {
      [`${t("tabs.used", "Recently Used")}`]: usedNavs.value,
      ...props.projects,
    };
  }
});

const handleNav = (obj: Project) => {
  const newObj = omit(obj, ["desc"]);
  // 查找 obj 在 usedNavs 中的索引
  const index = usedNavs.value.findIndex(
    (v) => slug(v.name) === slug(newObj.name)
  );

  if (index !== -1) {
    // 如果 obj 已存在，先移除它
    usedNavs.value.splice(index, 1);
    // 然后将它添加到数组的开头
    usedNavs.value.unshift(newObj);
  } else {
    // 如果 obj 不存在于数组中
    if (usedNavs.value.length === 4) {
      // 如果数组已满（有4个元素），则移除最后一个元素
      usedNavs.value.pop();
    }
    // 将新的 obj 添加到数组的开头
    usedNavs.value.unshift(newObj);
  }
};
</script>

<template>
  <div class="max-w-300 at-lg:max-w-212 mx-auto">
    <div
      v-for="(key, cidx) in Object.keys(pros)"
      :key="slug(key)"
      slide-enter
      :style="{ '--enter-stage': cidx + 1 }"
      class="mb-6"
    >
      <h4 :id="slug(key)" class="text-2xl font-bold mb-5">
        {{ key }}
      </h4>
      <ul class="list-disc list-inside flex flex-wrap gap-x-4">
        <li
          v-for="project in pros[key]"
          :key="project.name"
          class="mb-2 list-none w-17/36 md:w-68"
          @click="() => handleNav(project)"
        >
          <NavItem :project="project" />
        </li>
      </ul>
    </div>
    <div>
      <div
        class="table-of-contents"
        ref="el"
        :style="style"
        style="position: fixed"
      >
        <div class="table-of-contents-anchor">
          <div class="i-ri-menu-2-fill cursor-move" />
        </div>
        <ul>
          <li v-for="key of Object.keys(pros)" :key="key">
            <a :href="`#${slug(key)}`">{{ key }}</a>
          </li>
        </ul>
      </div>
      <hr />
      <div class="slide-enter animate-delay-800!">
        {{
          $t(
            "tabs.issues",
            "If you have any additional navigation sites to add, please raise an"
          )
        }}
        <a
          class="border-b border-slate-300"
          href="https://github.com/rr210/harry.me/issues/new?assignees=&labels=add-sites&projects=&template=%E6%B7%BB%E5%8A%A0%E7%AB%99%E7%82%B9-add-sites.md&title=Add+Sites"
          target="_blank"
        >
          <i i-codicon-issues align-mid text-xs></i>issue.</a
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
hr {
  border-color: rgba(125, 125, 125, 0.3);
  margin-top: 3em;
  margin-bottom: 3em;
  width: 50px;
  margin: 2em auto;
}
</style>
