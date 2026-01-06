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

const openInfoDialog = (person: NodeData) => {
  selectedPerson.value = person
  infoDialogVisible.value = true
}

const openEditDialog = (person: NodeData | undefined) => {
  selectedPerson.value = person
  editDialogVisible.value = true
}

const savePerson = (person: NodeData, isAdd: boolean) => {
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

let dataManager = new DataManager(undefined)

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
    smooth: {
      enabled: true,
      type: 'curvedCCW', // изогнутые линии
      forceDirection: 'vertical', // вертикальное направление изгиба
      roundness: 0.2, // степень изгиба
    },
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

const handleSelectedNode = (params: NetworkBaseEvent<string, string>) => {
  const isCTRLPressed = params.event.changedPointers[0].ctrlKey
  if (isCTRLPressed) return
  selectedPerson.value = dataManager.getNodeDataById(params.nodes[0] as string)
}

const handleCTRLLeftClick = (params: NetworkBaseEvent<string, string>) => {
  if (!params.nodes.length) return
  const isCTRLPressed = params.event.changedPointers[0].ctrlKey
  const nodeId = params.nodes[0]
  console.log(isCTRLPressed)

  if (selectedPerson.value === undefined) return

  if (isCTRLPressed) {
    const choice = prompt('1-Родитель/Ребёнок\n2-Муж/Жена\n3-Брат/Сестра', '1') as string
    const node = dataManager.getNodeDataById(nodeId as string)

    const fromId = selectedPerson.value.id
    const toId = nodeId as string

    let type = 'parent'
    switch (choice) {
      case '2':
        type = 'spous'
        selectedPerson.value.spouses.push(toId)
        node?.spouses.push(fromId)
        break
      case '3':
        type = 'sibling'
        selectedPerson.value.siblings.push(toId)
        node?.siblings.push(fromId)
        break
    }

    const newEdges = addSpecificEdge(fromId, toId, type)

    edges.value = [...edges.value, ...newEdges]

    dataManager.update(fromId, selectedPerson.value)
    dataManager.update(toId, node)
    console.log(node, selectedPerson.value)
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

const handleSave = () => {
  const dataToSave = dataManager.getDataJson
  // Создаем Blob и ссылку для скачивания
  const blob = new Blob([dataToSave], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'tree-data-' + new Date().toISOString().split('T')[0] + '.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

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
        dataManager = new DataManager(content)

        const [n, ed] = generateTree(dataManager.getData) as [Node[], Edge[]]
        nodes.value = n
        edges.value = ed
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
}

.tree-container {
  margin: 0;
  border: 1px solid gray;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
