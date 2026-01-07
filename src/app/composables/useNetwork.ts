import { ref, onMounted } from 'vue'
import type { VueVisNetwork } from 'vue-vis-network2'

export function useNetwork() {
  const networkRef = ref<typeof VueVisNetwork | null>(null)
  const network = ref<any>(null)

  onMounted(() => {
    if (!networkRef.value) return
    network.value = (networkRef.value as any).network
  })

  return { networkRef, network }
}
