import type { NodeData } from './types'
import { type Node, type Edge, type Options } from 'vue-vis-network2'

function flattenArray<T>(arr: T[]): T[] {
  const result: T[] = []

  function flatten(item: T | T[]): void {
    if (Array.isArray(item)) {
      item.forEach(flatten)
    } else {
      result.push(item)
    }
  }

  arr.forEach(flatten)
  return result
}

function removeReverseEdges(edges: Edge[]): Edge[] {
  const seen = new Set<string>()
  const result: Edge[] = []

  for (const edge of edges) {
    const key1 = `${edge.from}-${edge.to}`
    const key2 = `${edge.to}-${edge.from}`

    // Если еще не видели ни прямое, ни обратное соединение
    if (!seen.has(key1) && !seen.has(key2)) {
      result.push(edge)
      seen.add(key1)
    }
    // Если уже есть обратное соединение, пропускаем
  }

  return result
}

export function generateEdgesForNode(node: NodeData, allNodes: NodeData[]): Edge[] {
  const edges: Edge[] = []

  // Родители
  node.parents.forEach((parentId) => {
    edges.push({ from: parentId, to: node.id, color: 'red' })
  })

  // Супруги (только один раз, чтобы избежать дубликатов)
  node.spouses.forEach((spouseId) => {
    // Проверяем, есть ли уже обратная связь
    const spouse = allNodes.find((n) => n.id === spouseId)
    if (spouse && !spouse.spouses.includes(node.id)) {
      edges.push({ from: spouseId, to: node.id, color: 'magenta' })
    }
  })

  // Дети
  node.children.forEach((childId) => {
    edges.push({ from: node.id, to: childId, color: 'red' })
  })

  // Братья/сестры (только один раз)
  node.siblings.forEach((siblingId) => {
    const sibling = allNodes.find((n) => n.id === siblingId)
    if (sibling && !sibling.siblings.includes(node.id)) {
      edges.push({ from: node.id, to: siblingId, color: 'black' })
    }
  })

  return removeReverseEdges(edges)
}

// Функция для удаления дубликатов ребер
export function removeDuplicateEdges(existingEdges: Edge[], newEdges: Edge[]): Edge[] {
  const existingSet = new Set<string>()
  existingEdges.forEach((edge) => {
    existingSet.add(`${edge.from}-${edge.to}`)
    existingSet.add(`${edge.to}-${edge.from}`) // учитываем оба направления
  })

  return newEdges.filter((edge) => {
    const key1 = `${edge.from}-${edge.to}`
    const key2 = `${edge.to}-${edge.from}`
    return !existingSet.has(key1) && !existingSet.has(key2)
  })
}

// generateTree.ts - добавьте эту функцию
export function addSpecificEdge(
  fromId: string,
  toId: string,
  type: 'parent' | 'child' | 'spouse' | 'sibling',
): Edge[] {
  const edgeConfig = {
    parent: { from: fromId, to: toId, color: 'red' },
    child: { from: fromId, to: toId, color: 'red' },
    spouse: { from: fromId, to: toId, color: 'magenta' },
    sibling: { from: fromId, to: toId, color: 'black' },
  }

  const edges = [edgeConfig[type]]

  // Если добавляем родителя, автоматически добавляем обратную связь "ребенок"
  if (type === 'parent') {
    edges.push({ from: toId, to: fromId, color: 'red' })
  }

  return removeReverseEdges(edges)
}

export function nodeToNode(node: NodeData) {
  return {
    id: node.id,
    label: node.firstName + ' ' + node.lastName,
    shape: 'circularImage',
    image: node.photo,
  }
}

export function generateEdges(nodes: Array<NodeData>) {
  const nestedVisEdges: Edge[] = nodes
    .filter((n) => n.parents.length || n.spouses.length || n.children.length || n.siblings.length)
    .map((n) => {
      const edges = []
      if (n.parents.length) {
        edges.push(n.parents.map((p) => ({ from: p, to: n.id, color: 'red' })))
      }
      if (n.spouses.length) {
        edges.push(n.spouses.map((s) => ({ from: s, to: n.id, color: 'magenta' })))
      }
      if (n.children.length) {
        edges.push(n.children.map((c) => ({ from: n.id, to: c, color: 'red' })))
      }
      if (n.siblings.length) {
        edges.push(n.siblings.map((s) => ({ from: n.id, to: s, color: 'black' })))
      }
      return edges
    })
  const visEdges: Edge[] = removeReverseEdges(flattenArray(nestedVisEdges))

  return visEdges
}

export function generateEdgesToNode() {}

export function generateTree(nodes: Array<NodeData>) {
  const visNodes: Node[] = nodes.map(nodeToNode)
  const visEdges: Edge[] = generateEdges(nodes)

  return [visNodes, visEdges]
}
