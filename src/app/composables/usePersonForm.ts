import { ref, computed, watch } from 'vue'
import type { NodeData } from '@/types'

export function usePersonForm(node?: NodeData) {
  const arrayFields = ['siblings', 'parents', 'spouses', 'children'] as const

  const defaultFormData = (): NodeData => ({
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
    siblings: [],
    parents: [],
    spouses: [],
    children: [],
    photo: '',
  })

  const formData = ref<NodeData>(defaultFormData())
  const imageError = ref(false)

  // заполняем форму если передан node
  const initForm = (nodeData?: NodeData) => {
    imageError.value = false
    if (nodeData?.id) {
      formData.value = JSON.parse(JSON.stringify(nodeData))
    } else {
      formData.value = {
        ...defaultFormData(),
        id: `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }
    }
  }

  initForm(node)

  const isEditMode = computed(() => !!formData.value.id)

  // computed строки для массивов
  const arrayStrings = computed(() => {
    const obj: Record<string, string> = {}
    arrayFields.forEach((f) => (obj[f] = formData.value[f].join(', ')))
    return obj
  })

  const updateArray = (key: (typeof arrayFields)[number], event: Event) => {
    const val = (event.target as HTMLInputElement).value
    formData.value[key] = val
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
  }

  const handleImageError = () => {
    imageError.value = true
  }

  const save = (): NodeData => {
    // очищаем пустые строки в массивах
    arrayFields.forEach((field) => {
      formData.value[field] = formData.value[field].filter((id) => id.trim() !== '')
    })
    return JSON.parse(JSON.stringify(formData.value))
  }

  return {
    formData,
    imageError,
    isEditMode,
    arrayFields,
    arrayStrings,
    updateArray,
    handleImageError,
    initForm,
    save,
  }
}
