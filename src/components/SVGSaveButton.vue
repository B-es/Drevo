<template>
  <button @click="handleSaveSVG" class="svg-save-button">
    <span class="button-icon">🖼️</span>
    Сохранить как SVG
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  save: []
}>()

const isLoading = ref(false)

const handleSaveSVG = () => {
  emit('save')
}
</script>

<style scoped>
.svg-save-button {
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
  background-color: #9c27b0;
  color: white;
}

.svg-save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background-color: #7b1fa2;
}

.svg-save-button:active {
  transform: translateY(0);
}

.svg-save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-icon {
  font-size: 16px;
}
</style>
