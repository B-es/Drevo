<template>
  <div v-if="visible" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-content">
      <div class="dialog-header">
        <h2>{{ isEditMode ? 'Редактировать персону' : 'Создать персону' }}</h2>
        <button class="close-btn" @click="closeDialog">×</button>
      </div>

      <form @submit.prevent="savePerson">
        <div class="form-grid">
          <!-- Основные поля -->
          <div class="form-group">
            <label for="firstName">Имя *</label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              required
              placeholder="Введите имя"
            />
          </div>

          <div class="form-group">
            <label for="lastName">Фамилия *</label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              required
              placeholder="Введите фамилию"
            />
          </div>

          <div class="form-group">
            <label for="patronymic">Отчество</label>
            <input
              id="patronymic"
              v-model="formData.patronymic"
              type="text"
              placeholder="Введите отчество"
            />
          </div>

          <div class="form-group">
            <label for="maidenName">Девичья фамилия</label>
            <input
              id="maidenName"
              v-model="formData.maidenName"
              type="text"
              placeholder="Введите девичью фамилию"
            />
          </div>

          <div class="form-group">
            <label for="gender">Пол</label>
            <select id="gender" v-model="formData.gender">
              <option value="">Не указан</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
              <option value="other">Другой</option>
            </select>
          </div>

          <!-- Даты -->
          <div class="form-group">
            <label for="birthDate">Дата рождения</label>
            <input id="birthDate" v-model="formData.birthDate" type="date" />
          </div>

          <div class="form-group">
            <label for="birthPlace">Место рождения</label>
            <input
              id="birthPlace"
              v-model="formData.birthPlace"
              type="text"
              placeholder="Введите место рождения"
            />
          </div>

          <div class="form-group">
            <label for="deathDate">Дата смерти</label>
            <input id="deathDate" v-model="formData.deathDate" type="date" />
          </div>

          <div class="form-group">
            <label for="deathPlace">Место смерти</label>
            <input
              id="deathPlace"
              v-model="formData.deathPlace"
              type="text"
              placeholder="Введите место смерти"
            />
          </div>

          <!-- Ссылка на фото -->
          <div class="form-group full-width">
            <label for="photo">Ссылка на фото</label>
            <input
              id="photo"
              v-model="formData.photo"
              type="text"
              placeholder="https://example.com/photo.jpg"
            />
            <div v-if="formData.photo" class="photo-preview">
              <img :src="formData.photo" alt="Предпросмотр фото" @error="handleImageError" />
            </div>
          </div>

          <!-- Биография -->
          <div class="form-group full-width">
            <label for="bio">Биография</label>
            <textarea
              id="bio"
              v-model="formData.bio"
              rows="4"
              placeholder="Введите биографию"
            ></textarea>
          </div>

          <!-- Списки ID связей -->
          <div class="form-group">
            <label for="parents">Родители (ID через запятую)</label>
            <input
              id="parents"
              :value="parentsString"
              @input="updateArray('parents', $event)"
              type="text"
              placeholder="person_1, person_2"
            />
          </div>

          <div class="form-group">
            <label for="spouses">Супруги (ID через запятую)</label>
            <input
              id="spouses"
              :value="spousesString"
              @input="updateArray('spouses', $event)"
              type="text"
              placeholder="person_3"
            />
          </div>

          <div class="form-group">
            <label for="children">Дети (ID через запятую)</label>
            <input
              id="children"
              :value="childrenString"
              @input="updateArray('children', $event)"
              type="text"
              placeholder="person_5, person_6"
            />
          </div>

          <div class="form-group">
            <label for="siblings">Братья/Сёстры (ID через запятую)</label>
            <input
              id="siblings"
              :value="siblingsString"
              @input="updateArray('siblings', $event)"
              type="text"
              placeholder="person_7, person_8"
            />
          </div>
        </div>

        <div class="dialog-footer">
          <button type="button" class="btn-secondary" @click="closeDialog">Отмена</button>
          <button type="submit" class="btn-primary">
            {{ isEditMode ? 'Сохранить' : 'Создать' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type PropType } from 'vue'

export interface NodeData {
  id: string
  firstName: string
  lastName: string
  patronymic: string
  maidenName: string
  birthDate: string
  birthPlace: string
  deathDate: string
  deathPlace: string
  gender: string
  photo: string
  bio: string
  siblings: Array<string>
  parents: Array<string>
  spouses: Array<string>
  children: Array<string>
}

interface Emits {
  (e: 'save', data: NodeData, isAdd: boolean): void
  (e: 'close'): void
}

interface Props {
  visible: boolean
  node?: NodeData
}

const emit = defineEmits<Emits>()
const props = withDefaults(defineProps<Props>(), {
  visible: false,
  node: undefined,
})

// Инициализация пустой формы
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
  gender: '',
  photo: '',
  bio: '',
  siblings: [],
  parents: [],
  spouses: [],
  children: [],
})

const formData = ref<NodeData>(defaultFormData())
const imageError = ref(false)

const isEditMode = computed(() => !!formData.value.id)

// Преобразование массивов в строки для отображения
const parentsString = computed(() => formData.value.parents.join(', '))
const spousesString = computed(() => formData.value.spouses.join(', '))
const childrenString = computed(() => formData.value.children.join(', '))
const siblingsString = computed(() => formData.value.siblings.join(', '))

// Обновление массива по строке
const updateArray = (
  field: keyof Pick<NodeData, 'parents' | 'spouses' | 'children' | 'siblings'>,
  event: Event,
) => {
  const input = event.target as HTMLInputElement
  const value = input.value
  formData.value[field] = value
    .split(',')
    .map((id) => id.trim())
    .filter((id) => id)
}

// Обработчик ошибки загрузки изображения
const handleImageError = () => {
  imageError.value = true
}

// Сброс формы при открытии
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      imageError.value = false
      if (props.node?.id) {
        // Копируем данные для редактирования
        formData.value = JSON.parse(JSON.stringify(props.node))
      } else {
        // Создаем новую запись
        formData.value = defaultFormData()
        formData.value.id = `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    }
  },
)

const closeDialog = () => {
  emit('close')
}

const savePerson = () => {
  if (!formData.value.firstName.trim() || !formData.value.lastName.trim()) {
    alert('Пожалуйста, заполните обязательные поля (Имя и Фамилия)')
    return
  }

  // Создаем копию данных для передачи
  const dataToSave: NodeData = JSON.parse(JSON.stringify(formData.value))
  // Очищаем пустые строки в массивах
  const arrayFields: (keyof NodeData)[] = ['siblings', 'parents', 'spouses', 'children']
  arrayFields.forEach((field) => {
    dataToSave[field] = (dataToSave[field] as string[]).filter((id) => id.trim() !== '')
  })

  emit('save', dataToSave, props.node === undefined)
  closeDialog()
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.dialog-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5e5;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px 8px 0 0;
}

.dialog-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: white;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

form {
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2;
}

label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
}

label[required]::after {
  content: ' *';
  color: #e53e3e;
}

input,
select,
textarea {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  background: #f7fafc;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #4299e1;
  background: white;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

input[type='date'] {
  min-height: 44px;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.photo-preview {
  margin-top: 12px;
  max-width: 150px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.photo-preview img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
}

.btn-primary,
.btn-secondary {
  padding: 12px 28px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: #edf2f7;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #e2e8f0;
  color: #2d3748;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: span 1;
  }

  .dialog-content {
    width: 95%;
    margin: 10px;
    max-height: 95vh;
  }

  .dialog-header {
    padding: 16px 20px;
  }

  form {
    padding: 20px;
  }
}
</style>
