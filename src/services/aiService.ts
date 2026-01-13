import type { MistralInitParams } from '@/app/config/mistralAIParams'
import type { ChatMessage } from '@/types/chat'

interface AskTreeAIParams {
  question: string
  tree: string
  history: ChatMessage[]
}

export async function askTreeMistralAI(
  initParams: MistralInitParams,
  params: AskTreeAIParams,
): Promise<string> {
  const chatResponse = await initParams.client.chat.complete({
    model: initParams.model,
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
