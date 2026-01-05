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

export function generateTree(nodes: Array<NodeData>) {
  const visNodes: Node[] = nodes.map((n) => ({
    id: n.id,
    label: n.firstName + ' ' + n.lastName,
    shape: 'circularImage',
    image: n.photo,
  }))

  const nestedVisEdges: Edge[] = nodes
    .filter((n) => n.parents.length || n.spouses.length || n.children.length || n.siblings.length)
    .map((n) => {
      const edges = []
      if (n.parents.length) {
        console.log(n.id, 'p')
        edges.push(n.parents.map((p) => ({ from: p, to: n.id, color: 'red' })))
      }
      if (n.spouses.length) {
        console.log(n.id, 'sp')
        edges.push(n.spouses.map((s) => ({ from: s, to: n.id, color: 'magenta' })))
      }
      if (n.children.length) {
        console.log(n.id, 'c')
        edges.push(n.children.map((c) => ({ from: n.id, to: c, color: 'red' })))
      }
      if (n.siblings.length) {
        console.log(n.siblings, n.id, n.siblings.length)
        edges.push(n.siblings.map((s) => ({ from: n.id, to: s, color: 'black' })))
      }
      return edges
    })
  const visEdges = removeReverseEdges(flattenArray(nestedVisEdges))

  return [visNodes, visEdges]

  //   const edges = ref<Edge[]>([
  //   { from: 1, to: 3 },
  //   { from: 1, to: 2 },
  //   { from: 2, to: 4 },
  //   { from: 2, to: 5 },
  // ])
  //     const nodes = ref<Node[]>([
  //   {
  //     id: 1,
  //     label: 'Node 1',
  //     shape: 'circularImage',
  //     image:
  //       'https://sun9-20.userapi.com/s/v1/ig2/SuX0UAlb6EFD-_6Nz6ZN-CRzvp-saeh2oyW1wEPBoXIjLBXmmvbsop92Ky4go2lHalYkoRmxmJHfOD-HoNQgBfof.jpg?quality=95&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x304,640x360,720x405,1080x607,1280x720,1440x810,2560x1440&from=bu&cs=2560x0',
  //   },
  //   { id: 2, label: 'Node 2' },
  //   { id: 3, label: 'Node 3' },
  //   { id: 4, label: 'Node 4' },
  //   { id: 5, label: 'Node 5' },
  // ])
}
