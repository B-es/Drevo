<template>
  <div class="tree-space">
    <vue-vis-network
      ref="networkRef"
      :nodes="nodes"
      :edges="edges"
      :options="defaultNetworkOptions"
      @oncontext="handleRightClick"
      @doubleClick="handleLeftDoubleClick"
      @click="handleCTRLLeftClick"
      @selectNode="handleSelectedNode"
      style="height: 100%"
    />
  </div>
  <edit-dialog
    @close="closeEdit"
    :visible="editVisible"
    :node="selected"
    @save="savePerson"
  ></edit-dialog>
  <info-dialog :visible="infoVisible" :data="selected" @close="closeInfo" />
  <panel @load="handleLoad" @save="handleSave" @saveSVG="handleSaveSVG"></panel>
</template>

<script setup lang="ts">
import '@/styles/treeStyles.css'
import { ref } from 'vue'

import { defaultNetworkOptions } from '@/app/config/networkOptions'

import InfoDialog from '@/components/InfoDialog.vue'
import EditDialog from '@/components/EditDialog.vue'
import Panel from '@/components/Panel.vue'

import { VueVisNetwork, type Node, type Edge, type NetworkBaseEvent } from 'vue-vis-network2'
import type { NodeData } from '@/types'

import { generateTree } from '@/graph/generateTree'
import { nodeToNode } from '@/graph/nodeMapper'
import { generateEdgesForNode, removeDuplicateEdges } from '@/graph/edgeUtils'

import { useDialogs } from '@/app/composables/useDialogs'
import { useFileDownload } from '@/app/composables/useFileDownload'
import { useRelationships } from '@/app/composables/useRelationships'
import { useNetwork } from '@/app/composables/useNetwork'
import DataManager from '@/data/DataManager'

const dataManager = new DataManager()

const { selected, infoVisible, editVisible, openInfo, openEdit, closeInfo, closeEdit } =
  useDialogs()
const { download } = useFileDownload()
const { addRelation } = useRelationships(dataManager)
const { networkRef, network } = useNetwork()

const updateEdgesForPerson = (person: NodeData, isAdd: boolean) => {
  const allNodes = dataManager.getAll()
  if (isAdd) {
    const newEdges = generateEdgesForNode(person, allNodes)
    edges.value = [...edges.value, ...newEdges]
  } else {
    edges.value = edges.value.filter((edge) => edge.from !== person.id && edge.to !== person.id)
    const newEdges = generateEdgesForNode(person, allNodes)
    edges.value = [...edges.value, ...removeDuplicateEdges(edges.value, newEdges)]
  }
}

const savePerson = (person: NodeData, isAdd: boolean) => {
  if (isAdd) {
    dataManager.add(person)
    nodes.value.push(nodeToNode(person))
  } else {
    dataManager.update(person.id, person)
    const index = nodes.value.findIndex((n) => n.id === person.id)
    if (index !== -1) nodes.value[index] = nodeToNode(person)
    console.log(nodes, person)
  }
  updateEdgesForPerson(person, isAdd)
}

function loadTreeFromContent(content?: string) {
  dataManager.load(content)
  const [n, e] = generateTree(dataManager.getAll()) as [Node[], Edge[]]
  nodes.value = n
  edges.value = e
}

const nodes = ref<Node[]>([])
const edges = ref<Edge[]>([])

loadTreeFromContent()

function getNodeDataSafe(id: string) {
  const node = dataManager.getById(id)
  if (!node) console.warn(`Node with id ${id} not found`)
  return node as NodeData | undefined
}

const handleRightClick = (params: NetworkBaseEvent<string, string>) => {
  params.event.preventDefault()

  if (!params.nodes.length) return
  const id = params.nodes[0] as string
  openInfo(getNodeDataSafe(id))
}

const handleLeftDoubleClick = (params: NetworkBaseEvent<string, string>) => {
  if (!params.nodes.length) return openEdit()
  const id = params.nodes[0] as string
  openEdit(getNodeDataSafe(id))
}

const handleSelectedNode = (params: NetworkBaseEvent<string, string>) => {
  const isCTRLPressed = params.event.changedPointers[0].ctrlKey
  if (isCTRLPressed) return
  selected.value = getNodeDataSafe(params.nodes[0] as string)
}

const handleCTRLLeftClick = (params: NetworkBaseEvent<string, string>) => {
  if (!params.nodes.length) return
  const isCTRLPressed = params.event.changedPointers[0].ctrlKey
  const nodeId = params.nodes[0] as string
  console.log('Zapusk s CTRL', isCTRLPressed)
  if (isCTRLPressed && selected.value) {
    const node = getNodeDataSafe(nodeId)
    if (!node) return
    const newEdges = addRelation({ ...selected.value }, { ...node })
    edges.value = [...edges.value, ...newEdges]
  }
}

const handleSave = () => {
  download(dataManager.toJSON(), `tree-data-${new Date().toISOString().split('T')[0]}.json`)
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

<style></style>
