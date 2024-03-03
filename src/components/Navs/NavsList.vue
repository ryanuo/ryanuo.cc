<script setup lang="ts">
interface Project {
  desc: string;
  name: string;
  link: string;
  icon: string;
  image: string;
}
const props = defineProps<{ projects: Record<string, any[]> }>();
const usedNavs = useStorage<Project[]>("used-navs", []);

function slug(name: string) {
  return name.toLowerCase().replace(/[\s\\\/]+/g, "-");
}

const pros: ComputedRef<Record<string, Project[]>> = computed(() => {
  return {
    "Recently Used": usedNavs ? usedNavs.value : [],
    ...props.projects,
  };
});

const handleNav = (obj: Project) => {
  if (usedNavs.value.findIndex((v) => slug(v.name) === slug(obj.name)) === -1) {
    usedNavs.value.push(obj);
  }
};
</script>

<template>
  <div class="max-w-300 mx-auto">
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
      <ul class="list-disc list-inside flex flex-wrap flex-justify-between">
        <li
          v-for="project in pros[key]"
          :key="project.name"
          class="mb-2 list-none w-68"
          @click="() => handleNav(project)"
        >
          <NavItem :project="project" />
        </li>
      </ul>
    </div>
  </div>
</template>
