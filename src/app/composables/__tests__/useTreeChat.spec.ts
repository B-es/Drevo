import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTreeChat } from '../useTreeChat'
import type { ChatMessage } from '@/types/chat'
import * as aiService from '@/services/aiService'

describe('useTreeChat', () => {
  let getTreeDataMock: () => string

  beforeEach(() => {
    getTreeDataMock = vi.fn(() => 'tree-data')
    vi.spyOn(globalThis.crypto, 'randomUUID').mockImplementation(() => 'uuid-123')
  })

  it('sends a message and receives AI response', async () => {
    // Моким askTreeMistralAI
    const askMock = vi.spyOn(aiService, 'askTreeMistralAI').mockResolvedValue('ответ нейросети')

    const { messages, loading, sendMessage } = useTreeChat(getTreeDataMock)

    const promise = sendMessage('Привет')
    expect(loading.value).toBe(true)

    await promise

    expect(loading.value).toBe(false)
    expect(messages.value).toHaveLength(2)

    // Проверяем контент сообщений
    expect(messages.value[0]).toEqual<ChatMessage>({
      id: 'uuid-123',
      role: 'user',
      content: 'Привет',
      createdAt: messages.value[0].createdAt,
    })

    expect(messages.value[1]).toEqual<ChatMessage>({
      id: 'uuid-123',
      role: 'assistant',
      content: 'ответ нейросети',
      createdAt: messages.value[1].createdAt,
    })

    // Вместо жёсткого сравнения аргументов используем matchObject
    expect(askMock).toHaveBeenCalledOnce()
    expect(askMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'mistral-medium-latest',
        client: expect.any(Object),
      }),
      expect.objectContaining({
        question: 'Привет',
        tree: 'tree-data',
        history: messages.value,
      }),
    )
  })

  it('does nothing for empty text', async () => {
    const { messages, sendMessage } = useTreeChat(getTreeDataMock)
    await sendMessage('  ')
    expect(messages.value).toHaveLength(0)
  })

  it('clearMessages empties the array', () => {
    const { messages, clearMessages } = useTreeChat(getTreeDataMock)
    messages.value.push({ id: '1', role: 'user', content: 'hi', createdAt: Date.now() })
    expect(messages.value).toHaveLength(1)
    clearMessages()
    expect(messages.value).toHaveLength(0)
  })
})
