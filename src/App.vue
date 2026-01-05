<template>
  <div class="tree-space">
    <vue-vis-network
      ref="networkRef"
      :nodes="nodes"
      :edges="edges"
      :options="options"
      @oncontext="handleClick"
      style="height: 100%"
    />
  </div>
  <InfoDialog
    v-model:visible="dialogVisible"
    :data="selectedPerson"
    @close="dialogVisible = false"
  />
</template>

<script setup lang="ts">
import InfoDialog from './components/InfoDialog.vue'
import type { NodeData } from './types'
import { onMounted, ref } from 'vue'
import {
  VueVisNetwork,
  type Node,
  type Edge,
  type Options,
  type NetworkBaseEvent,
} from 'vue-vis-network2'

import { generateTree } from './generateTree'

import DataManager from './data/DataManager'

const selectedPerson = ref<NodeData>()
const dialogVisible = ref(false)

const openDialog = (person: NodeData) => {
  selectedPerson.value = person
  dialogVisible.value = true
}

const dataManager = new DataManager()

const [n, e] = generateTree(dataManager.getData) as [Node[], Edge[]]

const nodes = ref<Node[]>(n)
const edges = ref<Edge[]>(e)
console.log(e)

const options = ref<Options>({
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
    size: 16,
  },
  edges: {
    smooth: false,
  },
})

const networkRef = ref()

const handleClick = (params: NetworkBaseEvent<string, string>) => {
  params.event.preventDefault()

  if (!params.nodes.length) return
  const id = params.nodes[0] as string
  openDialog(dataManager.getNodeDataById(id) as NodeData)
}

onMounted(() => {
  // Get vis-network instance
  const network = networkRef.value.network
  console.log('Network instance:', network)

  // Get node data
  const node = networkRef.value.getNode(1)
  console.log('Node 1:', node)

  // Get edge data
  const edge = networkRef.value.getEdge(1)
  console.log('Edge 1:', edge)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; /* если нужно убрать скролл */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}

.tree-space {
  margin: 0;
  width: 100%;
  height: 100%;
}

.tree-container {
  margin: 0;
  border: 1px solid gray;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
