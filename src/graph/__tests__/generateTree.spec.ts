import { describe, it, expect, vi } from 'vitest'
import type { NodeData } from '@/types'
import { generateTree } from '@/graph/generateTree'
import * as nodeMapper from '@/graph/nodeMapper'
import * as edgeUtils from '@/graph/edgeUtils'

describe('generateTree', () => {
  it('converts NodeData to vis Nodes using nodeToNode', () => {
    const nodes: NodeData[] = [
      {
        id: '1',
        firstName: 'Alice',
        lastName: 'Smith',
        patronymic: '',
        maidenName: '',
        birthDate: '',
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
      },
      {
        id: '2',
        firstName: 'Bob',
        lastName: 'Brown',
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
      },
    ]

    // Шпионы на nodeToNode и generateEdges
    const spyNodeToNode = vi
      .spyOn(nodeMapper, 'nodeToNode')
      .mockImplementation((n) => ({ id: n.id, label: `${n.firstName} ${n.lastName}` }))
    const spyGenerateEdges = vi
      .spyOn(edgeUtils, 'generateEdges')
      .mockReturnValue([{ from: '1', to: '2', color: 'red' }])

    const [visNodes, visEdges] = generateTree(nodes)

    // Проверяем, что nodeToNode вызван для всех узлов
    expect(spyNodeToNode).toHaveBeenCalledTimes(nodes.length)
    expect(visNodes).toEqual([
      { id: '1', label: 'Alice Smith' },
      { id: '2', label: 'Bob Brown' },
    ])

    // Проверяем edges
    expect(spyGenerateEdges).toHaveBeenCalledWith(nodes)
    expect(visEdges).toEqual([{ from: '1', to: '2', color: 'red' }])

    // Восстанавливаем оригиналы
    spyNodeToNode.mockRestore()
    spyGenerateEdges.mockRestore()
  })

  it('returns empty arrays if input is empty', () => {
    const [visNodes, visEdges] = generateTree([])
    expect(visNodes).toEqual([])
    expect(visEdges).toEqual([])
  })
})
