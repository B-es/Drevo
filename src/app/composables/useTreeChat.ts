import { ref } from 'vue'
import type { ChatMessage } from '@/types/chat'
import { askTreeMistralAI } from '@/services/aiService'
import { defaultMistralAIParams } from '@/app/config/mistralAIParams'

export function useTreeChat(getTreeData: () => string) {
  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)

  const clearMessages = () => (messages.value = [])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      createdAt: Date.now(),
    }

    messages.value.push(userMessage)
    loading.value = true

    try {
      const answer = await askTreeMistralAI(defaultMistralAIParams, {
        question: text,
        tree: getTreeData(),
        history: messages.value,
      })

      messages.value.push({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: answer,
        createdAt: Date.now(),
      })
    } finally {
      loading.value = false
    }
  }

  return {
    messages,
    loading,
    sendMessage,
    clearMessages,
  }
}
