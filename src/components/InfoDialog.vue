<template>
  <Transition name="fade">
    <div v-if="visible" class="info-dialog-overlay" @click.self="close">
      <div class="info-dialog">
        <!-- Хедер с именем -->
        <div class="dialog-header">
          <div class="person-name">
            <h2>{{ fullName }}</h2>
            <span v-if="data?.maidenName" class="maiden-name"> (дев. {{ data.maidenName }}) </span>
          </div>

          <button class="close-button" @click="close" aria-label="Закрыть">&times;</button>
        </div>

        <!-- Контент -->
        <div class="dialog-content">
          <div class="main-info">
            <!-- Фото -->
            <div class="photo-section" v-if="photoSrc">
              <img :src="photoSrc" :alt="fullName" class="person-photo" @error="handleImageError" />
            </div>

            <!-- Основная информация -->
            <div class="info-grid">
              <div class="info-row">
                <span class="label">Дата рождения:</span>
                <span class="value">{{ formattedBirthDate }}</span>
                <span class="place" v-if="data?.birthPlace"> {{ data.birthPlace }}</span>
              </div>

              <div class="info-row" v-if="data?.deathDate">
                <span class="label">Дата смерти:</span>
                <span class="value">{{ formattedDeathDate }}</span>
                <span class="place" v-if="data.deathPlace"> {{ data.deathPlace }}</span>
              </div>

              <div class="info-row" v-if="age !== null">
                <span class="label">Прожил(а):</span>
                <span class="value">{{ age }} {{ ageText }}</span>
              </div>

              <div class="info-row">
                <span class="label">Пол:</span>
                <span class="value">{{ genderText }}</span>
              </div>

              <!-- Массивные связи -->
              <div class="info-row" v-if="data?.parents?.length">
                <span class="label">Родители:</span>
                <span class="value">{{ data.parents.join(', ') }}</span>
              </div>
              <div class="info-row" v-if="data?.spouses?.length">
                <span class="label">Супруги:</span>
                <span class="value">{{ data.spouses.join(', ') }}</span>
              </div>
              <div class="info-row" v-if="data?.children?.length">
                <span class="label">Дети:</span>
                <span class="value">{{ data.children.join(', ') }}</span>
              </div>
              <div class="info-row" v-if="data?.siblings?.length">
                <span class="label">Братья/сестры:</span>
                <span class="value">{{ data.siblings.join(', ') }}</span>
              </div>
            </div>
          </div>

          <!-- Биография -->
          <div class="bio-section" v-if="data?.bio">
            <h3 class="section-title">Биография</h3>
            <div class="bio-text">{{ data.bio }}</div>
          </div>
        </div>

        <!-- Футер -->
        <div class="dialog-footer">
          <button class="close-btn" @click="close">Закрыть</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NodeData } from '@/types'

interface Props {
  data?: NodeData
  visible: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const imageError = ref(false)

const close = () => emit('close')

const fullName = computed(() => `${props.data?.firstName || ''} ${props.data?.lastName || ''}`)

const formatDate = (date: string | Date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

const formattedBirthDate = computed(() => formatDate(props.data?.birthDate || ''))
const formattedDeathDate = computed(() =>
  props.data?.deathDate ? formatDate(props.data.deathDate) : null,
)

const age = computed<number | null>(() => {
  if (!props.data?.birthDate || !props.data?.deathDate) return null
  const birth = new Date(props.data.birthDate)
  const death = new Date(props.data.deathDate)
  let years = death.getFullYear() - birth.getFullYear()
  const monthDiff = death.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) years--
  return years
})

const ageText = computed(() => {
  if (age.value === null) return ''
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
  }
  return genderMap[props.data?.gender?.toLowerCase() || ''] || props.data?.gender || ''
})

// Фотка с fallback
const photoSrc = computed(() => {
  if (!props.data?.photo || imageError.value) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2Y1ZjVmNSIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjQwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNjAiIHk9IjYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM3NzciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4/PC90ZXh0Pjwvc3ZnPg=='
  }
  return props.data.photo
})

const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
/* Переходы */
.info-dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.25s ease forwards;
}

.info-dialog {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.3s ease forwards;
  display: flex;
  flex-direction: column;
}

/* Хедер */
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
}

.person-name h2 {
  margin: 0;
  font-size: 1.6rem;
}

.maiden-name {
  font-size: 0.9rem;
  font-weight: 400;
  opacity: 0.85;
}

.close-button {
  font-size: 26px;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.2s;
}
.close-button:hover {
  background-color: rgba(255, 255, 255, 0.35);
  transform: scale(1.1);
}

/* Контент */
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 24px;
}

.main-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.photo-section {
  flex-shrink: 0;
  max-width: 180px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.photo-section:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.person-photo {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

/* Основная информация */
.info-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px 24px;
}

.info-row {
  display: flex;
  flex-direction: column;
}

.label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.value,
.place {
  font-size: 0.93rem;
  color: #4a5568;
}

/* Биография */
.bio-section {
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2d3748;
}

.bio-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #4a5568;
}

/* Футер */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
}

.close-btn {
  padding: 10px 26px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  background: #edf2f7;
  color: #4a5568;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s,
    transform 0.1s;
}
.close-btn:hover {
  background: #e2e8f0;
  color: #2d3748;
  transform: translateY(-1px);
}
.close-btn:active {
  transform: translateY(0);
}

/* Анимации */
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

/* Адаптив */
@media (max-width: 768px) {
  .main-info {
    flex-direction: column;
    align-items: center;
  }
  .info-grid {
    grid-template-columns: 1fr;
  }
  .photo-section {
    max-width: 100%;
    height: auto;
  }
}
</style>
