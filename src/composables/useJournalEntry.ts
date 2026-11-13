import { onMounted, ref } from 'vue'
import { journalEntryApi } from '../api/journalEntry.api'
import type { JournalEntry, NewJournalEntry } from '../domain/journalEntry/JournalEntry'

export function useJournalEntry() {
  const entries = ref<JournalEntry[]>([])
  const entryResult = ref<JournalEntry>()
  const isLoading = ref(true)
  const isError = ref(false)
  const error = ref<unknown>(null)

  const fetchJournalEntries = async () => {
    isLoading.value = true
    isError.value = false
    error.value = null

    try {
      const response = await journalEntryApi.getAll()
      entries.value = response.data
    } catch (err) {
      isError.value = true
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  const createJournalEntry = async (entry: NewJournalEntry): Promise<JournalEntry | null> => {
    isLoading.value = true
    isError.value = false
    error.value = null

    try {
      const response = await journalEntryApi.create(entry)
      entryResult.value = response.data
      await fetchJournalEntries()
      return response.data
    } catch (err) {
      isError.value = true
      error.value = err
      return null
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchJournalEntries)

  return { entries, entryResult, isLoading, isError, error, refetch: fetchJournalEntries, createJournalEntry }
}
