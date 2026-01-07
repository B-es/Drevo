import type { NodeData } from '@/types'
import { addSpecificEdge } from './edgeUtils'
import type { Edge } from 'vue-vis-network2'

export type RelationshipType = 'parent' | 'spouse' | 'sibling'

export function applyRelationship(
  from: NodeData,
  to: NodeData,
  choice: string,
): { updatedFrom: NodeData; updatedTo: NodeData; edges: Edge[] } {
  let type: RelationshipType = 'parent'

  if (choice === '2') type = 'spouse'
  if (choice === '3') type = 'sibling'

  const fromId = from.id
  const toId = to.id

  const updatedFrom = { ...from }
  const updatedTo = { ...to }

  switch (type) {
    case 'spouse':
      updatedFrom.spouses.push(toId)
      updatedTo.spouses.push(fromId)
      break
    case 'sibling':
      updatedFrom.siblings.push(toId)
      updatedTo.siblings.push(fromId)
      break
    case 'parent':
      updatedFrom.children.push(toId)
      updatedTo.parents.push(fromId)
      break
  }

  return {
    updatedFrom,
    updatedTo,
    edges: addSpecificEdge(fromId, toId, type),
  }
}
