<template>
  <div class="chat-wrapper" :class="{ collapsed: !isOpen }">
    <!-- КНОПКА РОБОТА -->
    <button class="robot-button" :class="{ hided: !isOpen }" @click="toggle">🤖</button>
    <div class="chat-panel">
      <div class="chat-header">
        <h3>
          <button class="robot-button" :class="{ showed: isOpen }" @click="toggle">🤖</button>
          Поумочник
        </h3>
      </div>

      <div class="chat-messages">
        <div v-for="m in messages" :key="m.id" class="message" :class="m.role">
          <div class="bubble">
            {{ m.content }}
          </div>
        </div>

        <div v-if="loading" class="message assistant">
          <div class="bubble typing">Печатает…</div>
        </div>
      </div>

      <form class="chat-input" @submit.prevent="onSend">
        <input v-model="text" placeholder="Запомни, а то забудешь..." />
        <button :disabled="loading">Отправить</button>
        <button
          type="button"
          :disabled="loading || messages.length === 0"
          v-on:click="clearMessages"
        >
          0
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTreeChat } from '@/app/composables/useTreeChat'
import DataManager from '@/data/DataManager'

const dataManager = new DataManager()

const { messages, loading, sendMessage, clearMessages } = useTreeChat(() => dataManager.toJSON())

const text = ref('')

const onSend = async () => {
  const res = sendMessage(text.value)
  text.value = ''
  await res
}

const isOpen = ref(false)
const toggle = () => (isOpen.value = !isOpen.value)
</script>
<style scoped>
.chat-panel {
  width: 100%;
  height: 100%;
  background: #1e1e1e;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.chat-header {
  padding: 14px 16px;
  border-bottom: 1px solid #333;
  color: white;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 14px;
  background: #2d2d2d;
  line-height: 1.4;
}

.message.user .bubble {
  background: #e54646;
}

.message.assistant .bubble {
  color: white;
}

.typing {
  opacity: 0.7;
  font-style: italic;
}

.chat-input {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #333;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: none;
  outline: none;
}

.chat-input button {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: #e54646;
  color: white;
  cursor: pointer;
}

.chat-wrapper {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 460px;
  height: 500px;
  transition: all 0.3s ease;
  z-index: 3000;
}

/* РОБОТ */
.robot-button {
  width: 56px;
  height: 56px;
  border-radius: 20%;
  font-size: 28px;
  border: none;
  cursor: pointer;
  background-color: transparent;
  display: none;
}

.robot-button.hided {
  position: absolute;
  right: 0;
  bottom: 0;
  background: white;
  transition: background 0.1s linear;
}

.robot-button.hided:hover {
  background-color: transparent;
}

.robot-button.showed {
  display: inline-block;
  transition: background 0.1s linear;
}

.robot-button.showed:hover {
  background-color: white;
}

/* ===== СВЁРНУТО ===== */
.chat-wrapper.collapsed {
  width: 56px;
  height: 56px;
}

/* скрываем панель */
.chat-wrapper.collapsed .chat-panel {
  opacity: 0;
  pointer-events: none;
  transform: scale(0.9);
}

/* показываем робота */
.chat-wrapper.collapsed .robot-button {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===== АНИМАЦИЯ ===== */
.chat-panel {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
</style>
