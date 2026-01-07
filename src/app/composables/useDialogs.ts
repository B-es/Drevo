import { ref } from 'vue'
import type { NodeData } from '@/types'

export function useDialogs() {
  const selected = ref<NodeData | undefined>()
  const infoVisible = ref(false)
  const editVisible = ref(false)

  const openInfo = (p?: NodeData) => {
    selected.value = p
    infoVisible.value = true
  }
  const openEdit = (p?: NodeData) => {
    selected.value = p
    editVisible.value = true
  }
  const closeInfo = () => (infoVisible.value = false)
  const closeEdit = () => (editVisible.value = false)

  return { selected, infoVisible, editVisible, openInfo, openEdit, closeInfo, closeEdit }
}
