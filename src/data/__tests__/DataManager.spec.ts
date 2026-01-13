import { describe, it, expect, beforeEach, vi } from 'vitest'
import DataManager from '../DataManager'
import type { NodeData } from '@/types'

// Фейковые данные для тестов
const samplePerson: NodeData = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  patronymic: '',
  birthDate: '1970-01-01',
  deathDate: '',
  birthPlace: '',
  deathPlace: '',
  gender: 'male',
  children: [],
  parents: [],
  spouses: [],
  siblings: [],
  bio: '',
  photo: '',
}

describe('DataManager', () => {
  let dm: DataManager

  beforeEach(() => {
    dm = new DataManager(
      JSON.stringify({ id: 'tree-1', name: 'Test Tree', individuals: [samplePerson] }),
    )
  })

  it('should load data correctly', () => {
    const all = dm.getAll()
    expect(all).toHaveLength(1)
    expect(all[0]).toEqual(samplePerson)
  })

  it('getById should return a person or undefined', () => {
    const person = dm.getById('1')
    expect(person).toEqual(samplePerson)

    const missing = dm.getById('unknown')
    expect(missing).toBeUndefined()
  })

  it('add should add a new person and not mutate input', () => {
    const newPerson = { ...samplePerson, id: '2', firstName: 'Jane' }
    dm.add(newPerson)

    expect(dm.getAll()).toHaveLength(2)
    expect(dm.getById('2')?.firstName).toBe('Jane')

    // Повторный add с тем же id не добавляет
    const consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => {})
    dm.add(newPerson)
    expect(dm.getAll()).toHaveLength(2)
    expect(consoleMock).toHaveBeenCalledOnce()
    consoleMock.mockRestore()
  })

  it('update should replace existing person', () => {
    const updated = { ...samplePerson, firstName: 'Updated' }
    dm.update('1', updated)
    expect(dm.getById('1')?.firstName).toBe('Updated')

    const consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => {})
    dm.update('unknown', updated)
    expect(consoleMock).toHaveBeenCalledOnce()
    consoleMock.mockRestore()
  })

  it('exists should return true or false', () => {
    expect(dm.exists('1')).toBe(true)
    expect(dm.exists('unknown')).toBe(false)
  })

  it('remove should delete a person by id', () => {
    dm.remove('1')
    expect(dm.getById('1')).toBeUndefined()
    expect(dm.getAll()).toHaveLength(0)
  })

  it('toJSON should return correct string', () => {
    const json = dm.toJSON()
    const parsed = JSON.parse(json)
    expect(parsed.id).toBe('tree-1')
    expect(parsed.individuals).toHaveLength(1)
    expect(parsed.individuals[0]).toEqual(samplePerson)
  })
})
