import { create } from 'zustand'

export type CameraPreset = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'iso'

interface CameraStore {
  activePreset: CameraPreset | null
  applyPresetFn: ((preset: CameraPreset) => void) | null
  registerApplyPreset: (fn: (preset: CameraPreset) => void) => void
  applyPreset: (preset: CameraPreset) => void
}

export const useCameraStore = create<CameraStore>()((set, get) => ({
  activePreset: null,
  applyPresetFn: null,
  registerApplyPreset: (fn) => set({ applyPresetFn: fn }),
  applyPreset: (preset) => {
    get().applyPresetFn?.(preset)
    set({ activePreset: preset })
  },
}))
