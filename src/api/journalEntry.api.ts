import { apiClient } from './client'
import type { JournalEntry, NewJournalEntry, SearchJournalEntry } from '../domain/journalEntry/JournalEntry'

function normalizeSearchParams(search: Partial<SearchJournalEntry>) {
  return {
    start: search.start ? Date.parse(search.start) : null,
    end: search.end ? Date.parse(search.end) : null,
  }
}

export const journalEntryApi = {

  getAll(search: Partial<SearchJournalEntry> = {}) {
    return apiClient.get<JournalEntry[]>('journal/', {
        params: {
            ...normalizeSearchParams(search),
        },
    });
  },

  create(entry: NewJournalEntry) {

    return apiClient.post<JournalEntry>(
      'journal',
      entry
    )
  },

  update(entry: JournalEntry) {

    return apiClient.put<JournalEntry>(
      'journal',
      entry
    )
  },

  delete(id: string) {

    return apiClient.delete(
      `/journal/${id}`
    )
  },
}