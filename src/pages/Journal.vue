<script setup lang="ts">
import { computed, ref } from 'vue'
import { useJournalEntry } from '../composables/useJournalEntry'
import { MEAL_TYPE, type MealType } from '../domain/journalEntry/JournalEntry'
import AppButton from '../components/ui/AppButton.vue'

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const { entries, isError, isLoading, createJournalEntry } = useJournalEntry()
const selectedDate = ref('')
const isSubmitting = ref(false)
const formError = ref('')
const form = ref<{ title: string; mealType: MealType; notes: string }>({
  title: '',
  mealType: MEAL_TYPE.LUNCH,
  notes: '',
})

function toDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateInputValue(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getWeekStart(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  return start
}

function getWeekStartValue(value: string) {
  return toDateInputValue(getWeekStart(parseDateInputValue(value)))
}

function formatLongDate(date: Date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const weekGroups = computed(() => {
  const weekStartValues = new Set([
    getWeekStartValue(toDateInputValue(new Date())),
    ...entries.value
      .map(entry => entryDateKey(entry.plannedAt))
      .filter(Boolean)
      .map(getWeekStartValue),
  ])

  return [...weekStartValues]
    .sort((left, right) => right.localeCompare(left))
    .map(weekStartValue => {
      const startDate = parseDateInputValue(weekStartValue)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 6)

      return {
        key: weekStartValue,
        title: `Semaine du ${formatLongDate(startDate)} au ${formatLongDate(endDate)}`,
        days: days.map((label, index) => {
          const date = new Date(startDate)
          date.setDate(date.getDate() + index)

          return {
            label,
            value: toDateInputValue(date),
            displayDate: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
          }
        }),
      }
    })
})

function openEntryForm(date: string) {
  selectedDate.value = date
  form.value = { title: '', mealType: MEAL_TYPE.LUNCH, notes: '' }
  formError.value = ''
}

function closeEntryForm() {
  selectedDate.value = ''
  formError.value = ''
}

function entryDateKey(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : toDateInputValue(date)
}

function getEntriesForCell(date: string, mealType: MealType) {
  return entries.value.filter(entry => entryDateKey(entry.plannedAt) === date && entry.mealType === mealType)
}

async function submitEntry() {
  const title = form.value.title.trim()
  if (!title || !selectedDate.value) {
    formError.value = 'Veuillez renseigner un titre et une date.'
    return
  }

  const [year, month, day] = selectedDate.value.split('-').map(Number)
  const plannedAt = new Date(year, month - 1, day, 12).toISOString()

  isSubmitting.value = true
  formError.value = ''

  try {
    const createdEntry = await createJournalEntry({
      title,
      plannedAt,
      mealType: form.value.mealType,
      notes: form.value.notes.trim(),
    })

    if (createdEntry) closeEntryForm()
    else formError.value = 'Impossible de créer cette entrée. Réessayez.'
  } finally {
    isSubmitting.value = false
  }
}

</script>
<template>
  <div class="mx-auto max-w-7xl px-6 py-8">
    <h1 class="mb-6 font-display text-3xl font-semibold text-olive">Journal de la semaine</h1>

    <div v-if="isLoading" class="py-8 text-sm text-muted">Chargement du journal...</div>
    <div v-else-if="isError" class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
      Impossible de charger le journal.
    </div>
    <div v-else class="space-y-8">
      <section v-for="week in weekGroups" :key="week.key">
        <h2 class="mb-3 font-display text-xl font-semibold text-olive">{{ week.title }}</h2>
        <div class="overflow-x-auto rounded-xl border border-line bg-surface">
          <table class="w-full min-w-xl border-collapse text-left">
            <thead class="border-b border-line bg-sage/30 text-xs uppercase text-olive">
              <tr>
                <th scope="col" class="px-4 py-3">Jour</th>
                <th scope="col" class="px-4 py-3">Midi</th>
                <th scope="col" class="px-4 py-3">Soir</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="day in week.days"
                :key="day.value"
                class="cursor-pointer border-b border-line last:border-0 hover:bg-sage/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-olive"
                tabindex="0"
                @click="openEntryForm(day.value)"
                @keydown.enter.prevent="openEntryForm(day.value)"
                @keydown.space.prevent="openEntryForm(day.value)"
              >
                <th scope="row" class="whitespace-nowrap px-4 py-4 font-semibold text-ink">
                  {{ day.label }} <span class="ml-1 text-xs font-normal text-muted">{{ day.displayDate }}</span>
                </th>
                <td class="px-4 py-4 text-sm text-ink">
                  <div v-for="entry in getEntriesForCell(day.value, MEAL_TYPE.LUNCH)" :key="entry.id">{{ entry.title }}</div>
                  <span v-if="getEntriesForCell(day.value, MEAL_TYPE.LUNCH).length === 0" class="text-muted">+ Ajouter</span>
                </td>
                <td class="px-4 py-4 text-sm text-ink">
                  <div v-for="entry in getEntriesForCell(day.value, MEAL_TYPE.DINNER)" :key="entry.id">{{ entry.title }}</div>
                  <span v-if="getEntriesForCell(day.value, MEAL_TYPE.DINNER).length === 0" class="text-muted">+ Ajouter</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <section v-if="selectedDate" class="mt-8 rounded-xl border border-line bg-surface p-5 sm:p-6">
      <h2 class="mb-5 font-display text-2xl font-semibold text-olive">Nouvelle entrée</h2>
      <form class="space-y-4" @submit.prevent="submitEntry">
        <div class="form-row">
          <div class="form-group mb-0">
            <label for="journal-title">Titre</label>
            <input id="journal-title" v-model="form.title" type="text" required maxlength="160" />
          </div>
          <div class="form-group mb-0">
            <label for="journal-date">Date</label>
            <input id="journal-date" v-model="selectedDate" class="w-full rounded-md border border-line bg-white px-4 py-3" type="date" required />
          </div>
          <div class="form-group mb-0">
            <label for="journal-meal-type">Créneau</label>
            <select id="journal-meal-type" v-model="form.mealType">
              <option :value="MEAL_TYPE.LUNCH">Midi</option>
              <option :value="MEAL_TYPE.DINNER">Soir</option>
            </select>
          </div>
        </div>
        <div class="form-group mb-0">
          <label for="journal-notes">Notes</label>
          <textarea id="journal-notes" v-model="form.notes" rows="3" />
        </div>
        <p v-if="formError" class="text-sm text-red-700" role="alert">{{ formError }}</p>
        <div class="flex flex-wrap gap-3">
          <AppButton type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Enregistrement...' : 'Créer l’entrée' }}
          </AppButton>
          <AppButton type="button" variant="outline" :disabled="isSubmitting" @click="closeEntryForm">Annuler</AppButton>
        </div>
      </form>
    </section>
  </div>
</template>