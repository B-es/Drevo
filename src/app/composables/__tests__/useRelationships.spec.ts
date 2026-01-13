import { useRelationships } from '../useRelationships'
import { describe, it, expect, vi } from 'vitest'

describe('useRelationships', () => {
  it('calls dataManager.update and returns edges', () => {
    const dataManagerMock = { update: vi.fn() }
    const from = {
      id: 'a',
      firstName: 'A',
      children: [],
      parents: [],
      spouses: [],
      siblings: [],
    } as any
    const to = {
      id: 'b',
      firstName: 'B',
      children: [],
      parents: [],
      spouses: [],
      siblings: [],
    } as any

    // Передаем кастомный askType, чтобы не вызывать prompt
    const relationships = useRelationships(dataManagerMock, () => '2') // '2' = spouse
    const edges = relationships.addRelation(from, to)

    expect(dataManagerMock.update).toHaveBeenCalledTimes(2)
    expect(edges.length).toBeGreaterThan(0)
    expect(edges[0].from).toBe('a')
    expect(edges[0].to).toBe('b')
  })
})
