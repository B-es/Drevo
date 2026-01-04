<template>
  <div class="tree-space">
    <vue-tree :dataset="sampleData" :config="treeConfig">
      <template v-slot:node="{ node, collapsed }">
        <drevo-node :node-data="node" :collapsed="false" @on-right-click="openDialog"></drevo-node>
      </template>
    </vue-tree>
  </div>
  <InfoDialog
    v-model:visible="dialogVisible"
    :data="selectedPerson"
    @close="dialogVisible = false"
  />
</template>

<script setup lang="ts">
import InfoDialog from './components/InfoDialog.vue'

const sampleData: NodeData = {
  firstName: 'Иван',
  id: 'id_1',
  lastName: 'Васильев',
  maidenName: '',
  birthDate: '2003-06-10',
  birthPlace: 'Страхов',
  deathDate: 'undefined',
  deathPlace: 'Мир',
  gender: 'male',
  photo:
    'https://sun9-20.userapi.com/s/v1/ig2/SuX0UAlb6EFD-_6Nz6ZN-CRzvp-saeh2oyW1wEPBoXIjLBXmmvbsop92Ky4go2lHalYkoRmxmJHfOD-HoNQgBfof.jpg?quality=95&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x304,640x360,720x405,1080x607,1280x720,1440x810,2560x1440&from=bu&cs=2560x0',
  bio: '8',
  parents: [],
  spouses: [],
  children: [],
}

const selectedPerson = ref<NodeData | undefined>()
const dialogVisible = ref(false)

const openDialog = (person: NodeData) => {
  selectedPerson.value = person
  dialogVisible.value = true
}
</script>

<script lang="ts">
import VueTree from '@ssthouse/vue3-tree-chart'
import '@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css'
import DrevoNode from './components/DrevoNode.vue'
import type { NodeData } from './types'
import { ref } from 'vue'

export default {
  components: { VueTree },
  data() {
    return {
      treeConfig: { nodeWidth: 170, nodeHeight: 60, levelHeight: 190 },
    }
  },
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
