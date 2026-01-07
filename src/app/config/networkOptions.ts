import { ref } from 'vue'
import type { Options } from 'vue-vis-network2'

export const defaultNetworkOptions = ref<Options>({
  physics: {
    enabled: true,
    stabilization: {
      enabled: true,
      iterations: 500,
    },
    solver: 'forceAtlas2Based',
    forceAtlas2Based: {
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springLength: 100,
      springConstant: 0.08,
      damping: 0.4,
      avoidOverlap: 1,
    },
  },
  locale: 'ru',
  nodes: {
    shape: 'dot',
    size: 18,
  },
  edges: {
    smooth: {
      enabled: true,
      type: 'curvedCCW', // изогнутые линии
      forceDirection: 'vertical', // вертикальное направление изгиба
      roundness: 0.2, // степень изгиба
    },
  },
})
