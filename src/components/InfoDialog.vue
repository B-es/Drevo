<template>
  <Transition name="fade">
    <div v-if="visible" class="info-dialog-overlay" @click.self="close">
      <div class="info-dialog">
        <!-- Хедер с именем -->
        <div class="dialog-header">
          <div class="person-name">
            <h2>{{ fullName }}</h2>
            <div class="name-variants" v-if="data.maidenName">
              <span class="maiden-name"> (дев. {{ data.maidenName }}) </span>
            </div>
          </div>

          <button class="close-button" @click="close" aria-label="Закрыть">&times;</button>
        </div>

        <!-- Основной контент -->
        <div class="dialog-content">
          <!-- Фото и основная информация -->
          <div class="main-info">
            <!-- Фото -->
            <div class="photo-section" v-if="data.photo">
              <img
                :src="data.photo"
                :alt="fullName"
                class="person-photo"
                @error="handleImageError"
              />
            </div>

            <!-- Информация -->
            <div class="info-grid">
              <!-- Даты жизни -->
              <div class="info-row">
                <span class="label">Дата рождения:</span>
                <span class="value">{{ formattedBirthDate }}</span>
                <span class="place" v-if="data.birthPlace">, {{ data.birthPlace }}</span>
              </div>

              <div class="info-row" v-if="data.deathDate">
                <span class="label">Дата смерти:</span>
                <span class="value">{{ formattedDeathDate }}</span>
                <span class="place" v-if="data.deathPlace">, {{ data.deathPlace }}</span>
              </div>

              <div class="info-row" v-if="age">
                <span class="label">Прожил(а):</span>
                <span class="value">{{ age }} {{ ageText }}</span>
              </div>

              <!-- Пол -->
              <div class="info-row">
                <span class="label">Пол:</span>
                <span class="value">{{ genderText }}</span>
              </div>
            </div>
          </div>

          <!-- Биография -->
          <div class="bio-section" v-if="data.bio">
            <h3 class="section-title">Биография</h3>
            <div class="bio-text">{{ data.bio }}</div>
          </div>
        </div>

        <!-- Простой футер с кнопкой закрыть -->
        <div class="dialog-footer">
          <button class="close-btn" @click="close">Закрыть</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NodeData } from '@/types'

interface Props {
  data: NodeData
  visible: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Компьютеды
const fullName = computed(() => {
  return `${props.data.firstName} ${props.data.lastName}`
})

const formattedBirthDate = computed(() => {
  return formatDate(props.data.birthDate)
})

const formattedDeathDate = computed(() => {
  return props.data.deathDate ? formatDate(props.data.deathDate) : null
})

const age = computed(() => {
  if (!props.data.deathDate) return null

  const birth = new Date(props.data.birthDate)
  const death = new Date(props.data.deathDate)
  let age = death.getFullYear() - birth.getFullYear()
  const monthDiff = death.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
    age--
  }
  return age
})

const ageText = computed(() => {
  if (!age.value) return ''
  const lastDigit = age.value % 10
  const lastTwoDigits = age.value % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'лет'
  if (lastDigit === 1) return 'год'
  if (lastDigit >= 2 && lastDigit <= 4) return 'года'
  return 'лет'
})

const genderText = computed(() => {
  const genderMap: Record<string, string> = {
    male: 'Мужской',
    female: 'Женский',
    m: 'Мужской',
    f: 'Женский',
    мужской: 'Мужской',
    женский: 'Женский',
  }
  return genderMap[props.data.gender?.toLowerCase()] || props.data.gender
})

// Методы
const close = () => {
  emit('close')
}

const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // Заглушка для фото
  img.src =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2Y1ZjVmNSIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjQwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNjAiIHk9IjYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM3NzciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4/PC90ZXh0Pjwvc3ZnPg=='
}
</script>

<style scoped>
/* Оверлей */
.info-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(2px);
}

/* Диалог */
.info-dialog {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;
  overflow: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Анимация появления/исчезновения */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Хедер */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.person-name h2 {
  margin: 0 0 6px 0;
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
  line-height: 1.2;
}

.maiden-name {
  color: #7f8c8d;
  font-size: 15px;
  font-style: italic;
  display: block;
  margin-top: 4px;
}

/* Кнопка закрытия */
.close-button {
  background: none;
  border: none;
  font-size: 28px;
  color: #95a5a6;
  cursor: pointer;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  flex-shrink: 0;
  margin-left: 10px;
}

.close-button:hover {
  background: #ecf0f1;
  color: #e74c3c;
}

/* Контент */
.dialog-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Основная информация */
.main-info {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

@media (max-width: 640px) {
  .main-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

/* Фото */
.photo-section {
  width: 160px;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.person-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.person-photo:hover {
  transform: scale(1.03);
}

/* Информационная сетка */
.info-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: baseline;
}

.label {
  flex: 0 0 140px;
  font-weight: 600;
  color: #555;
  font-size: 15px;
  text-align: right;
  white-space: nowrap;
  padding-right: 8px;
}

.label::after {
  content: ':';
}

/* value и place как inline элементы в одной строке */
.value-place {
  flex: 1;
  display: inline; /* или оставить как есть для flex */
}

.value {
  color: #2c3e50;
  font-size: 16px;
  font-weight: 500;
}

.place {
  color: #7f8c8d;
  font-size: 14.5px;
  font-style: italic;
  margin-left: 8px; /* Вплотную к value */
}

/* Биография */
.bio-section {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-top: 8px;
}

.section-title {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
}

.bio-text {
  line-height: 1.7;
  color: #444;
  white-space: pre-line;
  font-size: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.bio-text::-webkit-scrollbar {
  width: 6px;
}

.bio-text::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.bio-text::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

/* Футер */
.dialog-footer {
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  text-align: center;
}

.close-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
}

.close-btn:hover {
  background: #2980b9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.close-btn:active {
  transform: translateY(0);
}

/* Адаптивность */
@media (max-width: 640px) {
  .info-dialog {
    max-height: 95vh;
  }

  .dialog-header {
    padding: 20px 20px 12px;
  }

  .person-name h2 {
    font-size: 20px;
  }

  .dialog-content {
    padding: 20px;
  }

  .photo-section {
    width: 140px;
    height: 180px;
  }

  .label {
    min-width: 120px;
    font-size: 14px;
  }

  .value {
    font-size: 15px;
  }

  .bio-section {
    padding: 16px;
  }

  .close-btn {
    width: 100%;
    max-width: 200px;
  }
}

/* Темная тема (опционально) */
@media (prefers-color-scheme: dark) {
  .info-dialog {
    background: #2c3e50;
    color: #ecf0f1;
  }

  .dialog-header {
    background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
    border-bottom-color: #34495e;
  }

  .person-name h2 {
    color: #ecf0f1;
  }

  .maiden-name {
    color: #bdc3c7;
  }

  .close-button {
    color: #bdc3c7;
  }

  .close-button:hover {
    background: #34495e;
    color: #e74c3c;
  }

  .photo-section {
    background: #34495e;
    border-color: #4a6572;
  }

  .label {
    color: #bdc3c7;
  }

  .value {
    color: #ecf0f1;
  }

  .place {
    color: #95a5a6;
  }

  .bio-section {
    background: #34495e;
  }

  .section-title {
    color: #ecf0f1;
    border-bottom-color: #4a6572;
  }

  .bio-text {
    color: #ecf0f1;
  }

  .dialog-footer {
    background: #34495e;
    border-top-color: #4a6572;
  }

  .close-btn {
    background: #3498db;
  }
}
</style>
