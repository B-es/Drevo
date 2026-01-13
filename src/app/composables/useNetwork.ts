import { ref, onMounted } from 'vue'

export function useNetwork() {
  const networkRef = ref<any>(null)
  const network = ref<any>(null)

  const initNetwork = () => {
    if (networkRef.value?.network) {
      network.value = networkRef.value.network
    }
  }

  onMounted(initNetwork)

  return { networkRef, network, initNetwork }
}
