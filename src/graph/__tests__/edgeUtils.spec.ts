import { describe, it, expect } from 'vitest'
import {
  generateEdges,
  removeDuplicateEdges,
  addSpecificEdge,
  generateEdgesForNode,
} from '../edgeUtils'
import type { NodeData } from '@/types'
import type { Edge } from 'vue-vis-network2'

const createNode = (overrides: Partial<NodeData>): NodeData => ({
  id: '',
  firstName: '',
  lastName: '',
  patronymic: '',
  maidenName: '',
  birthDate: '',
  birthPlace: '',
  deathDate: '',
  deathPlace: '',
  gender: 'male',
  bio: '',
  photo: '',
  parents: [],
  spouses: [],
  children: [],
  siblings: [],
  ...overrides,
})

describe('edgeUtils', () => {
  describe('generateEdges', () => {
    it('generates parent-child edges', () => {
      const parent = createNode({ id: 'p', children: ['c'] })
      const child = createNode({ id: 'c', parents: ['p'] })

      const edges = generateEdges([parent, child])

      expect(edges).toEqual([{ from: 'p', to: 'c', color: 'red' }])
    })

    it('removes reverse duplicate edges', () => {
      const a = createNode({ id: 'a', siblings: ['b'] })
      const b = createNode({ id: 'b', siblings: ['a'] })

      const edges = generateEdges([a, b])

      expect(edges).toHaveLength(1)
      expect(edges[0]).toEqual({ from: 'a', to: 'b', color: 'black' })
    })
  })

  describe('removeDuplicateEdges', () => {
    it('filters out existing edges (both directions)', () => {
      const existing: Edge[] = [{ from: 'a', to: 'b', color: 'red' }]
      const incoming: Edge[] = [
        { from: 'b', to: 'a', color: 'red' },
        { from: 'a', to: 'c', color: 'red' },
      ]

      const result = removeDuplicateEdges(existing, incoming)

      expect(result).toEqual([{ from: 'a', to: 'c', color: 'red' }])
    })
  })

  describe('addSpecificEdge', () => {
    it('adds spouse edge', () => {
      const edges = addSpecificEdge('a', 'b', 'spouse')

      expect(edges).toEqual([{ from: 'a', to: 'b', color: 'magenta' }])
    })

    it('adds parent edge with reverse child edge removed', () => {
      const edges = addSpecificEdge('p', 'c', 'parent')

      expect(edges).toEqual([{ from: 'p', to: 'c', color: 'red' }])
    })

    it('adds sibling edge', () => {
      const edges = addSpecificEdge('a', 'b', 'sibling')

      expect(edges).toEqual([{ from: 'a', to: 'b', color: 'black' }])
    })
  })

  describe('generateEdgesForNode', () => {
    it('generates edges only once for spouses', () => {
      const a = createNode({ id: 'a', spouses: ['b'] })
      const b = createNode({ id: 'b', spouses: ['a'] })

      const edges = generateEdgesForNode(a, [a, b])

      expect(edges).toEqual([])
    })

    it('generates parent and child edges', () => {
      const parent = createNode({ id: 'p', children: ['c'] })
      const child = createNode({ id: 'c', parents: ['p'] })

      const edges = generateEdgesForNode(child, [parent, child])

      expect(edges).toEqual([{ from: 'p', to: 'c', color: 'red' }])
    })

    it('does not duplicate sibling edge if already exists', () => {
      const a = createNode({ id: 'a', siblings: ['b'] })
      const b = createNode({ id: 'b', siblings: ['a'] })

      const edges = generateEdgesForNode(a, [a, b])

      // ожидаем пустой массив, т.к. функция предотвращает дубликат
      expect(edges).toEqual([])
    })
  })
})
