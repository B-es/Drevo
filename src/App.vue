<template>
  <div class="tree-space">
    <vue-vis-network
      ref="networkRef"
      :nodes="nodes"
      :edges="edges"
      :options="options"
      @oncontext="handleRightClick"
      @doubleClick="handleLeftDoubleClick"
      @click="handleCTRLLeftClick"
      @selectNode="handleSelectedNode"
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
  <panel @load="handleLoad" @save="handleSave" @saveSVG="handleSaveSVG"></panel>
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
} from 'vue-vis-network2'

import {
  generateTree,
  nodeToNode,
  generateEdgesForNode,
  removeDuplicateEdges,
  addSpecificEdge,
} from './generateTree'

import DataManager from './data/DataManager'
import Panel from './components/Panel.vue'

const selectedPerson = ref<NodeData>()
const infoDialogVisible = ref(false)
const editDialogVisible = ref(false)
const dataManager = new DataManager(undefined)

const openDialog = (person: NodeData | undefined, type: 'info' | 'edit') => {
  selectedPerson.value = person
  if (type === 'info') infoDialogVisible.value = true
  else editDialogVisible.value = true
}

const updateEdgesForPerson = (person: NodeData, isAdd: boolean) => {
  if (isAdd) {
    const newEdges = generateEdgesForNode(person, dataManager.getData)
    edges.value = [...edges.value, ...newEdges]
  } else {
    edges.value = edges.value.filter((edge) => edge.from !== person.id && edge.to !== person.id)
    const newEdges = generateEdgesForNode(person, dataManager.getData)
    edges.value = [...edges.value, ...removeDuplicateEdges(edges.value, newEdges)]
  }
}

const savePerson = (person: NodeData, isAdd: boolean) => {
  if (isAdd) {
    dataManager.add(person)
    nodes.value.push(nodeToNode(person))
  } else {
    dataManager.update(person.id, person)
  }
  updateEdgesForPerson(person, isAdd)
}

function loadTreeFromContent(content: string | undefined) {
  dataManager.load(content)
  const [n, e] = generateTree(dataManager.getData) as [Node[], Edge[]]
  nodes.value = n
  edges.value = e
}

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

loadTreeFromContent(undefined)

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

const networkRef = ref(null)

function getNodeDataSafe(id: string) {
  const node = dataManager.getNodeDataById(id)
  if (!node) console.warn(`Node with id ${id} not found`)
  return node as NodeData | undefined
}

const handleRightClick = (params: NetworkBaseEvent<string, string>) => {
  params.event.preventDefault()

  if (!params.nodes.length) return
  const id = params.nodes[0] as string
  openDialog(getNodeDataSafe(id), 'info')
}

const handleLeftDoubleClick = (params: NetworkBaseEvent<string, string>) => {
  if (!params.nodes.length) return openDialog(undefined, 'edit')
  const id = params.nodes[0] as string
  openDialog(getNodeDataSafe(id), 'edit')
}

const handleSelectedNode = (params: NetworkBaseEvent<string, string>) => {
  const isCTRLPressed = params.event.changedPointers[0].ctrlKey
  if (isCTRLPressed) return
  selectedPerson.value = getNodeDataSafe(params.nodes[0] as string)
}

function addRelationship(from: NodeData, to: NodeData, choice: string) {
  let type: 'parent' | 'spous' | 'sibling' = 'parent'
  switch (choice) {
    case '2':
      type = 'spous'
      from.spouses.push(to.id)
      to.spouses.push(from.id)
      break
    case '3':
      type = 'sibling'
      from.siblings.push(to.id)
      to.siblings.push(from.id)
      break
  }
  edges.value = [...edges.value, ...addSpecificEdge(from.id, to.id, type)]
  dataManager.update(from.id, from)
  dataManager.update(to.id, to)
}

function askRelationshipType(): string {
  return prompt('1-Родитель/Ребёнок\n2-Муж/Жена\n3-Брат/Сестра', '1') || '1'
}

const handleCTRLLeftClick = (params: NetworkBaseEvent<string, string>) => {
  if (!params.nodes.length) return
  const isCTRLPressed = params.event.changedPointers[0].ctrlKey
  const nodeId = params.nodes[0] as string

  if (isCTRLPressed && selectedPerson.value) {
    const node = getNodeDataSafe(nodeId)
    if (!node) return
    addRelationship(selectedPerson.value, node, askRelationshipType())
  }
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

function downloadFile(content: string, fileName: string, type = 'application/json') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const handleSave = () => {
  downloadFile(dataManager.getDataJson, `tree-data-${new Date().toISOString().split('T')[0]}.json`)
  alert('Данные сохранены в файл')
}

const handleLoad = () => {
  // Создаем input для выбора файла
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'

  input.onchange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        loadTreeFromContent(content)
        alert('Данные успешно загружены!')
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
        alert('Ошибка при загрузке файла. Проверьте формат данных.')
      }
    }

    reader.readAsText(file)
  }

  input.click()
}

const handleSaveSVG = async () => {
  alert('Политика CORS')
}
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
  background-color: #424242;
}
</style>
