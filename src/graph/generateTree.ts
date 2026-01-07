import type { NodeData } from '../types'
import { type Node, type Edge } from 'vue-vis-network2'
import { generateEdges } from './edgeUtils'
import { nodeToNode } from './nodeMapper'

export function generateTree(nodes: Array<NodeData>) {
  const visNodes: Node[] = nodes.map(nodeToNode)
  const visEdges: Edge[] = generateEdges(nodes)

  return [visNodes, visEdges]
}
