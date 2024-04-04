import { onUnmounted, ref, watch } from "vue";

export function useTypewriter(initialText: Ref) {
  const typedText = ref(""); // 打字机效果的文本内容
  const typingSpeed = 20; // 打字速度，单位：毫秒
  let currentIndex = 0; // 当前显示到的字符索引
  let typingInterval: any = null; // 定时器

  const startTyping = () => {
    // 开始打字机效果
    typingInterval = setInterval(typeCharacter, typingSpeed);
  };

  const typeCharacter = () => {
    if (!initialText) return;
    // 逐个显示字符
    if (currentIndex < initialText.value.length) {
      typedText.value += initialText.value.charAt(currentIndex);
      currentIndex++;
    } else {
      // 如果已经显示完所有字符，清除定时器
      clearInterval(typingInterval);
      typingInterval = null;
    }
  };

  const restartTyping = () => {
    // 重新开始打字机效果
    clearInterval(typingInterval);
    typingInterval = null;
    currentIndex = 0;
    typedText.value = "";
    startTyping();
  };

  watch(initialText, restartTyping);

  onMounted(() => {
    // 组件挂载时开始打字机效果
    initialText.value && restartTyping();
  });

  onUnmounted(() => {
    // 组件卸载时清除定时器
    clearInterval(typingInterval);
  });

  return {
    typedText,
  };
}
