<template>
  <div class="tree-space">
    <vue-vis-network
      ref="networkRef"
      :nodes="nodes"
      :edges="edges"
      :options="options"
      @oncontext="handleRightClick"
      @doubleClick="handleLeftDoubleClick"
      style="height: 100%"
    />
  </div>
  <edit-dialog
    @close="editDialogVisible = false"
    :visible="editDialogVisible"
    :node="selectedPerson"
    @save="savePerson"
  ></edit-dialog>
  <info-dialog
    :visible="infoDialogVisible"
    :data="selectedPerson"
    @close="infoDialogVisible = false"
  />
</template>

<script setup lang="ts">
import InfoDialog from './components/InfoDialog.vue'
import EditDialog from './components/EditDialog.vue'
import type { NodeData } from './types'
import { onMounted, ref } from 'vue'
import {
  VueVisNetwork,
  type Node,
  type Edge,
  type Options,
  type NetworkBaseEvent,
  type NetworkClickEvent,
} from 'vue-vis-network2'

import {
  generateTree,
  nodeToNode,
  generateEdges,
  generateEdgesForNode,
  removeDuplicateEdges,
} from './generateTree'

import DataManager from './data/DataManager'

const selectedPerson = ref<NodeData>()
const infoDialogVisible = ref(false)
const editDialogVisible = ref(false)

const openInfoDialog = (person: NodeData) => {
  selectedPerson.value = person
  infoDialogVisible.value = true
}

const openEditDialog = (person: NodeData | undefined) => {
  selectedPerson.value = person
  editDialogVisible.value = true
}

const savePerson = (person: NodeData, isAdd: boolean) => {
  console.log(person, isAdd)

  if (isAdd) {
    // Добавляем новую персону
    dataManager.add(person)
    nodes.value.push(nodeToNode(person))

    // Генерируем связи только для новой персоны
    const newEdges = generateEdgesForNode(person, dataManager.getData)
    edges.value = [...edges.value, ...newEdges]
  } else {
    // Обновляем существующую персону

    // Обновляем данные
    dataManager.update(person.id, person)

    // Удаляем старые связи этой персоны
    edges.value = edges.value.filter((edge) => edge.from !== person.id && edge.to !== person.id)

    // Генерируем новые связи для обновленной персоны
    const newEdges = generateEdgesForNode(person, dataManager.getData)

    // Добавляем новые связи, избегая дубликатов
    const uniqueNewEdges = removeDuplicateEdges(edges.value, newEdges)
    edges.value = [...edges.value, ...uniqueNewEdges]
  }
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

const handleRightClick = (params: NetworkBaseEvent<string, string>) => {
  params.event.preventDefault()

  if (!params.nodes.length) return
  const id = params.nodes[0] as string
  openInfoDialog(dataManager.getNodeDataById(id) as NodeData)
}

const handleLeftDoubleClick = (params: NetworkBaseEvent<string, string>) => {
  if (!params.nodes.length) return openEditDialog(undefined)
  const id = params.nodes[0] as string
  openEditDialog(dataManager.getNodeDataById(id) as NodeData)
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
