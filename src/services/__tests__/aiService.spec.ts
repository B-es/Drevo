import { describe, it, expect, vi } from 'vitest'
import type { MistralInitParams } from '@/app/config/mistralAIParams'
import type { ChatMessage } from '@/types/chat'
import * as aiService from '../aiService'

describe('aiService', () => {
  const testParams = {
    question: 'Кто отец А?',
    tree: 'ABCDE',
    history: [] as ChatMessage[],
  }

  it('calls client.chat.complete and returns content', async () => {
    const mockComplete = vi.fn().mockResolvedValue({
      choices: [{ message: { content: 'ответ нейросети' } }],
    })

    const initParams: MistralInitParams = {
      client: { chat: { complete: mockComplete } } as any,
      model: 'test-model',
    }

    const result = await aiService.askTreeMistralAI(initParams, testParams)

    expect(mockComplete).toHaveBeenCalledOnce()
    expect(result).toBe('ответ нейросети')
  })

  it('returns fallback string "Ошибка API" if choices empty', async () => {
    const mockComplete = vi.fn().mockResolvedValue({
      choices: [],
    })

    const initParams: MistralInitParams = {
      client: { chat: { complete: mockComplete } } as any,
      model: 'test-model',
    }

    const result = await aiService.askTreeMistralAI(initParams, testParams)
    expect(result).toBe('Ошибка API')
  })

  it('askTreeAITest returns mock answer string', async () => {
    const result = await aiService.askTreeAITest(testParams)
    expect(result).toContain('Я вижу, что в древе сейчас 5 персон.')
    expect(result).toContain(testParams.question)
  })
})
