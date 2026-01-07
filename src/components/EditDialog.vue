<template>
  <div v-if="visible" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-content">
      <div class="dialog-header">
        <h2>{{ isEditMode ? 'Редактировать персону' : 'Создать персону' }}</h2>
        <button class="close-btn" @click="closeDialog">×</button>
      </div>

      <form @submit.prevent="onSave">
        <div class="form-grid">
          <div
            v-for="field in fields"
            :key="field.key"
            class="form-group"
            :class="{ 'full-width': field.fullWidth }"
          >
            <label :for="field.key">
              {{ field.label }}
              <span v-if="field.required">*</span>
            </label>

            <!-- текстовые поля и массивы -->
            <input
              v-if="field.type === 'text'"
              :id="field.key"
              :placeholder="field.placeholder || ''"
              :value="
                arrayFields.includes(field.key) ? arrayStrings[field.key] : formData[field.key]
              "
              @input="onInput(field.key, $event)"
              :required="field.required || false"
            />

            <!-- select -->
            <select
              v-else-if="field.type === 'select'"
              :id="field.key"
              v-model="formData[field.key]"
            >
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <!-- textarea -->
            <textarea
              v-else-if="field.type === 'textarea'"
              :id="field.key"
              rows="4"
              :placeholder="field.placeholder || ''"
              v-model="formData[field.key]"
            ></textarea>

            <!-- превью фото -->
            <div
              v-if="field.key === 'photo' && formData.photo && !imageError"
              class="photo-preview"
            >
              <img :src="formData.photo" alt="Предпросмотр" @error="handleImageError" />
            </div>
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

<script lang="ts">
import type { NodeData } from '@/types'
import { computed, watch } from 'vue'
import { usePersonForm } from '@/app/composables/usePersonForm'

export default {
  name: 'EditDialog',
  props: {
    visible: { type: Boolean, default: false },
    node: { type: Object as () => NodeData | undefined, default: undefined },
  },
  emits: ['save', 'close'],
  setup(props, { emit }) {
    const {
      formData,
      imageError,
      isEditMode,
      arrayFields,
      arrayStrings,
      updateArray,
      handleImageError,
      initForm,
      save,
    } = usePersonForm(props.node)

    // Сброс формы при открытии
    watch(
      () => props.visible,
      (v) => {
        if (v) initForm(props.node)
      },
    )

    const fields = [
      { label: 'Имя', key: 'firstName', type: 'text', required: true },
      { label: 'Фамилия', key: 'lastName', type: 'text', required: true },
      { label: 'Отчество', key: 'patronymic', type: 'text' },
      { label: 'Девичья фамилия', key: 'maidenName', type: 'text' },
      {
        label: 'Пол',
        key: 'gender',
        type: 'select',
        options: [
          { label: 'Не указан', value: '' },
          { label: 'Мужской', value: 'male' },
          { label: 'Женский', value: 'female' },
          { label: 'Другой', value: 'other' },
        ],
      },
      { label: 'Дата рождения', key: 'birthDate', type: 'text' },
      { label: 'Место рождения', key: 'birthPlace', type: 'text' },
      { label: 'Дата смерти', key: 'deathDate', type: 'text' },
      { label: 'Место смерти', key: 'deathPlace', type: 'text' },
      { label: 'Ссылка на фото', key: 'photo', type: 'text', fullWidth: true },
      { label: 'Биография', key: 'bio', type: 'textarea', fullWidth: true },
      { label: 'Родители (ID через запятую)', key: 'parents', type: 'text' },
      { label: 'Супруги (ID через запятую)', key: 'spouses', type: 'text' },
      { label: 'Дети (ID через запятую)', key: 'children', type: 'text' },
      { label: 'Братья/Сёстры (ID через запятую)', key: 'siblings', type: 'text' },
    ]

    const closeDialog = () => emit('close')

    const onSave = () => {
      const saved = save()
      if (!saved.firstName.trim() || !saved.lastName.trim()) {
        alert('Имя и Фамилия обязательны')
        return
      }
      emit('save', saved, !props.node)
      closeDialog()
    }

    const onInput = (key: keyof NodeData, event: Event) => {
      if (arrayFields.includes(key as any)) {
        updateArray(key as any, event)
      } else {
        formData[key] = (event.target as HTMLInputElement).value
      }
    }

    return {
      formData,
      imageError,
      isEditMode,
      arrayFields,
      arrayStrings,
      handleImageError,
      fields,
      closeDialog,
      onSave,
      onInput,
    }
  },
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
