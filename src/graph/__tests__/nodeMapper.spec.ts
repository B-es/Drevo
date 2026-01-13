import { describe, it, expect } from 'vitest'
import { nodeToNode } from '@/graph/nodeMapper'
import type { NodeData } from '@/types'

describe('nodeToNode', () => {
  it('maps NodeData to Node correctly with default image', () => {
    const node: NodeData = {
      id: '1',
      firstName: 'Alice',
      lastName: 'Smith',
      patronymic: '',
      maidenName: '',
      birthDate: '1990-01-01',
      birthPlace: '',
      deathDate: '',
      deathPlace: '',
      gender: 'female',
      bio: '',
      siblings: [],
      parents: [],
      spouses: [],
      children: [],
      photo: '',
    }

    const result = nodeToNode(node)

    expect(result.id).toBe(node.id)
    expect((result.font as { color: string }).color).toBe('white')
    expect(result.shape).toBe('circularImage')
    expect(result.label).toContain('Alice Smith')
    expect(result.image).toContain('https://avatars.mds.yandex.net')
    expect((result.shadow as { color: string }).color).toBe('magenta') // женский пол
  })

  it('uses custom photo if provided', () => {
    const node: NodeData = {
      id: '2',
      firstName: 'Bob',
      lastName: 'Brown',
      patronymic: '',
      maidenName: '',
      birthDate: '1985-05-10',
      birthPlace: '',
      deathDate: '',
      deathPlace: '',
      gender: 'male',
      bio: '',
      siblings: [],
      parents: [],
      spouses: [],
      children: [],
      photo: 'https://example.com/photo.jpg',
    }

    const result = nodeToNode(node)
    expect(result.image).toBe(node.photo)
    expect((result.shadow as { color: string }).color).toBe('red') // мужской пол
  })

  it('sets shadow to gray if deathDate is defined', () => {
    const node: NodeData = {
      id: '3',
      firstName: 'Charlie',
      lastName: 'Doe',
      patronymic: '',
      maidenName: '',
      birthDate: '1970-01-01',
      birthPlace: '',
      deathDate: '2020-01-01',
      deathPlace: '',
      gender: 'male',
      bio: '',
      siblings: [],
      parents: [],
      spouses: [],
      children: [],
      photo: '',
    }

    const result = nodeToNode(node)
    expect((result.shadow as { color: string }).color).toBe('gray')
    expect(result.label).toContain('1970-2020')
  })
})
