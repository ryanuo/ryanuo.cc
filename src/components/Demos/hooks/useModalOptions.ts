import { ref } from 'vue'

function getInitialValues() {
  return {
    teleportTo: 'body',
    displayDirective: 'if',
    hideOverlay: false,
    overlayTransition: 'vfm-fade',
    contentTransition: 'vfm-slide-up',
    clickToClose: true,
    escToClose: true,
    background: 'non-interactive',
    lockScroll: true,
    reserveScrollBarGap: true,
    swipeToClose: 'none',
    modelValue: false,
    content: {},
  }
}

export function useModalOptions() {
  const options = ref(getInitialValues()) as any
  return { options }
}
