<template>
  <div class="save-load-panel">
    <button @click="handleSave" class="panel-button save-button">
      <span class="button-icon">💾</span>
      Сохранить
    </button>
    <button @click="handleLoad" class="panel-button load-button">
      <span class="button-icon">📂</span>
      Загрузить
    </button>
    <SVGSaveButton @save="handleSaveSVG"></SVGSaveButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SVGSaveButton from './SVGSaveButton.vue'

const emit = defineEmits<{
  save: []
  load: []
  saveSVG: []
}>()

const handleSave = () => {
  emit('save')
}

const handleLoad = () => {
  emit('load')
}

const handleSaveSVG = () => {
  emit('saveSVG')
}
</script>

<style scoped>
.save-load-panel {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 10px;
  z-index: 1000;
}

.panel-button {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.panel-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.panel-button:active {
  transform: translateY(0);
}

.save-button {
  background-color: #4caf50;
  color: white;
}

.save-button:hover {
  background-color: #45a049;
}

.load-button {
  background-color: #2196f3;
  color: white;
}

.load-button:hover {
  background-color: #1976d2;
}

.button-icon {
  font-size: 16px;
}
</style>
