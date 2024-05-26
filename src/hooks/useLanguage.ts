import { ref } from "vue";
import { useI18n } from "vue-i18n";

export function useLanguage() {
  const { locale } = useI18n();
  const isChinese = ref(false);

  if (locale?.value?.includes("zh"))
    isChinese.value = true;


  return {
    isChinese,
  };
}
