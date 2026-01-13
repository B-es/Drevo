import { Mistral } from '@mistralai/mistralai'

export interface MistralInitParams {
  client: Mistral
  model: string
}

const apiKey = import.meta.env.VITE_MISTRAL_API_KEY || 'no-key'
const client = new Mistral({ apiKey: apiKey })
const model = 'mistral-medium-latest'

export const defaultMistralAIParams: MistralInitParams = {
  client,
  model,
}
