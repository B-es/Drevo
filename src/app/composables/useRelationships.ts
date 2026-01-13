import type { Edge } from 'vue-vis-network2'
import type { NodeData } from '@/types'
import { applyRelationship } from '@/graph/relationship'

export function useRelationships(
  dataManager: { update: (id: string, node: NodeData) => void },
  askType?: () => string, // DI для тестов
) {
  // используем askType, если передан, иначе обычный prompt
  const askRelationshipType =
    askType ||
    (() => {
      return prompt('1-Родитель/Ребёнок\n2-Муж/Жена\n3-Брат/Сестра', '1') || '1'
    })

  const addRelation = (from: NodeData, to: NodeData): Edge[] => {
    // клонируем узлы, чтобы убрать реактивность
    const fromClone = JSON.parse(JSON.stringify(from)) as NodeData
    const toClone = JSON.parse(JSON.stringify(to)) as NodeData

    const result = applyRelationship(fromClone, toClone, askRelationshipType())

    // обновляем DataManager обычными объектами
    dataManager.update(result.updatedFrom.id, result.updatedFrom)
    dataManager.update(result.updatedTo.id, result.updatedTo)

    return result.edges
  }

  return { addRelation }
}
