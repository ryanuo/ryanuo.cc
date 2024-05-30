import { ref } from 'vue'

export function useImagePreview() {
  const imageModel = ref<HTMLImageElement | undefined>()

  useEventListener('click', async (e) => {
    const path = Array.from(e.composedPath())
    const first = path[0]
    if (!(first instanceof HTMLElement))
      return
    if (first.tagName !== 'IMG')
      return
    if (first.classList.contains('no-preview'))
      return
    if (
      path.some(
        el =>
          el instanceof HTMLElement && ['A', 'BUTTON'].includes(el.tagName),
      )
    )
      return
    if (
      !path.some(
        el => el instanceof HTMLElement && el.classList.contains('prose'),
      )
    )
      return

    // Do not open image when they are moving. Mainly for mobile to avoid conflict with hovering behavior.
    const pos = first.getBoundingClientRect()
    await new Promise(resolve => setTimeout(resolve, 50))
    const newPos = first.getBoundingClientRect()
    if (pos.left !== newPos.left || pos.top !== newPos.top)
      return

    imageModel.value = first as HTMLImageElement
  })

  return { imageModel }
}
