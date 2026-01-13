import { describe, it, expect } from 'vitest'
import { usePersonForm } from '../usePersonForm'

describe('usePersonForm', () => {
  it('initializes empty form when no node is passed', () => {
    const { formData, isEditMode } = usePersonForm()

    expect(formData.value.firstName).toBe('')
    expect(formData.value.children).toEqual([])
    // Теперь id уже создан, поэтому isEditMode будет true
    expect(isEditMode.value).toBe(true)
  })

  it('initializes form with existing node', () => {
    const node = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male',
      children: ['2'],
      parents: [],
      spouses: [],
      siblings: [],
      birthDate: '2000-01-01',
      birthPlace: '',
      deathDate: '',
      deathPlace: '',
      patronymic: '',
      maidenName: '',
      bio: '',
      photo: '',
    }

    const { formData, isEditMode } = usePersonForm(node)
    expect(formData.value.firstName).toBe('John')
    expect(formData.value.children).toEqual(['2'])
    expect(isEditMode.value).toBe(true)
  })

  it('updates array fields correctly', () => {
    const { formData, updateArray } = usePersonForm()
    const event = { target: { value: 'a, b, c' } } as unknown as Event
    updateArray('children', event)
    expect(formData.value.children).toEqual(['a', 'b', 'c'])
  })

  it('saves correctly and removes empty strings in arrays', () => {
    const { formData, save } = usePersonForm()
    formData.value.children = ['a', '', 'b']
    const saved = save()
    expect(saved.children).toEqual(['a', 'b'])
  })
})
