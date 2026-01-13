import type { ChatMessage } from '@/types/chat'
import { Mistral } from '@mistralai/mistralai'

interface AskTreeAIParams {
  question: string
  tree: string
  history: ChatMessage[]
}

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY || 'no-key'
const client = new Mistral({ apiKey: apiKey })

export async function askTreeMistralAI(params: AskTreeAIParams): Promise<string> {
  const chatResponse = await client.chat.complete({
    model: 'mistral-medium-latest',
    messages: [
      {
        role: 'user',
        content:
          'Ответы пиши по делу и без предложений о помощи' + params.question + ' ' + params.tree,
      },
    ],
  })

  return (chatResponse.choices[0]?.message.content as string) || 'Ошибка API'
}

export async function askTreeAITest(params: AskTreeAIParams): Promise<string> {
  // ⏳ имитация запроса

  await new Promise((r) => setTimeout(r, 600))

  return `
Я вижу, что в древе сейчас ${params.tree.length} персон.

Вопрос: "${params.question}"

(Здесь будет реальный ответ нейросети)
`.trim()
}
