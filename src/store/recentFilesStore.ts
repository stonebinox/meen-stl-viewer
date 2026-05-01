import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ModelFormat } from '../types/viewer'

export interface RecentFileMeta {
  id: string
  name: string
  size: number
  format: ModelFormat
  openedAt: string  // ISO string
}

interface RecentFilesState {
  files: RecentFileMeta[]
}
interface RecentFilesActions {
  addRecentFile: (meta: Omit<RecentFileMeta, 'id' | 'openedAt'>) => void
  removeRecentFile: (id: string) => void
  clearRecentFiles: () => void
}

export const useRecentFilesStore = create<RecentFilesState & RecentFilesActions>()(
  persist(
    (set, get) => ({
      files: [],

      addRecentFile: ({ name, size, format }) => {
        const files = get().files
        // Remove existing entry with same name+size+format
        const filtered = files.filter(f => !(f.name === name && f.size === size && f.format === format))
        const newEntry: RecentFileMeta = {
          id: crypto.randomUUID(),
          name,
          size,
          format,
          openedAt: new Date().toISOString(),
        }
        // Keep max 10, newest first
        set({ files: [newEntry, ...filtered].slice(0, 10) })
      },

      removeRecentFile: (id) => set(s => ({ files: s.files.filter(f => f.id !== id) })),

      clearRecentFiles: () => set({ files: [] }),
    }),
    { name: 'meen-viewer-recent-files' }
  )
)
