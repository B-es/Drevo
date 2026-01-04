<script setup lang="ts">
import type { NodeData } from '@/types'
import { computed, ref } from 'vue'

const props = defineProps<{
  collapsed: boolean
  nodeData: NodeData
}>()

const fullName = computed(() => props.nodeData.firstName + ' ' + props.nodeData.lastName)

function onContextMenu(e: PointerEvent) {
  e.preventDefault()
  emit('on-right-click', props.nodeData)
}

const emit = defineEmits(['on-right-click'])
</script>

<template>
  <div
    v-on:contextmenu="onContextMenu"
    class="tree-node"
    :style="{
      border: collapsed ? '2px solid grey' : '',
      borderColor: nodeData.gender === 'male' ? 'cyan' : 'pink',
    }"
  >
    <div
      class="photo-node"
      :style="{
        backgroundImage: 'url(' + nodeData.photo + ')',
      }"
    ></div>
    <p class="text-node">
      {{ fullName }}
    </p>
  </div>
</template>

<style scoped>
.text-node {
  font-size: large;
}

.photo-node {
  width: 100%;
  height: 100px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
}

.tree-node {
  position: relative;
  border: 2px solid grey;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 5px;
}
</style>
