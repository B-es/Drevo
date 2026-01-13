import { describe, it, expect } from 'vitest'
import { useDialogs } from '../useDialogs'
import type { NodeData } from '@/types'

describe('useDialogs', () => {
  it('initializes with default state', () => {
    const { selected, infoVisible, editVisible } = useDialogs()

    expect(selected.value).toBeUndefined()
    expect(infoVisible.value).toBe(false)
    expect(editVisible.value).toBe(false)
  })

  it('openInfo sets selected and shows info', () => {
    const { selected, infoVisible, openInfo } = useDialogs()
    const node: NodeData = {
      id: '1',
      firstName: 'A',
      lastName: 'B',
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

    openInfo(node)

    expect(selected.value).toStrictEqual(node)
    expect(infoVisible.value).toBe(true)
  })

  it('openEdit sets selected and shows edit', () => {
    const { selected, editVisible, openEdit } = useDialogs()
    const node: NodeData = {
      id: '2',
      firstName: 'X',
      lastName: 'Y',
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
    }

    openEdit(node)

    expect(selected.value).toStrictEqual(node)
    expect(editVisible.value).toBe(true)
  })

  it('closeInfo hides info dialog', () => {
    const { infoVisible, openInfo, closeInfo } = useDialogs()
    openInfo()
    expect(infoVisible.value).toBe(true)
    closeInfo()
    expect(infoVisible.value).toBe(false)
  })

  it('closeEdit hides edit dialog', () => {
    const { editVisible, openEdit, closeEdit } = useDialogs()
    openEdit()
    expect(editVisible.value).toBe(true)
    closeEdit()
    expect(editVisible.value).toBe(false)
  })
})
