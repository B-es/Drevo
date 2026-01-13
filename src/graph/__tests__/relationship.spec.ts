import { describe, it, expect } from 'vitest'
import { applyRelationship } from '@/graph/relationship'
import type { NodeData } from '@/types'

function createPerson(id: string): NodeData {
  return {
    id,
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
    siblings: [],
    parents: [],
    spouses: [],
    children: [],
    photo: '',
  }
}

describe('applyRelationship', () => {
  it('creates parent-child relationship by default (choice = 1)', () => {
    const parent = createPerson('parent')
    const child = createPerson('child')

    const result = applyRelationship(parent, child, '1')

    expect(result.updatedFrom.children).toContain('child')
    expect(result.updatedTo.parents).toContain('parent')

    expect(result.updatedFrom.parents).toHaveLength(0)
    expect(result.updatedTo.children).toHaveLength(0)
  })

  it('creates spouse relationship (choice = 2)', () => {
    const a = createPerson('a')
    const b = createPerson('b')

    const result = applyRelationship(a, b, '2')

    expect(result.updatedFrom.spouses).toContain('b')
    expect(result.updatedTo.spouses).toContain('a')

    expect(result.updatedFrom.children).toHaveLength(0)
    expect(result.updatedFrom.parents).toHaveLength(0)
  })

  it('creates sibling relationship (choice = 3)', () => {
    const a = createPerson('a')
    const b = createPerson('b')

    const result = applyRelationship(a, b, '3')

    expect(result.updatedFrom.siblings).toContain('b')
    expect(result.updatedTo.siblings).toContain('a')

    expect(result.updatedFrom.parents).toHaveLength(0)
    expect(result.updatedFrom.children).toHaveLength(0)
  })

  it('returns new objects (does not mutate original)', () => {
    const from = createPerson('from')
    const to = createPerson('to')

    const originalFrom = structuredClone(from)
    const originalTo = structuredClone(to)

    applyRelationship(from, to, '1')

    expect(from).toEqual(originalFrom)
    expect(to).toEqual(originalTo)
  })

  it('returns edges array', () => {
    const from = createPerson('from')
    const to = createPerson('to')

    const result = applyRelationship(from, to, '1')

    expect(Array.isArray(result.edges)).toBe(true)
    expect(result.edges.length).toBeGreaterThan(0)
  })
})
