import { create } from 'zustand'

export type ClipAxis = 'x' | 'y' | 'z'

interface ClipState {
  enabled: boolean
  axis: ClipAxis
  normalized: number  // 0..1, maps to model bounds
  flipped: boolean
}
interface ClipActions {
  setEnabled: (v: boolean) => void
  setAxis: (a: ClipAxis) => void
  setNormalized: (n: number) => void
  toggleFlipped: () => void
}

export const useClipStore = create<ClipState & ClipActions>()(set => ({
  enabled: false,
  axis: 'y',
  normalized: 0.5,
  flipped: false,
  setEnabled: (v) => set({ enabled: v }),
  setAxis: (a) => set({ axis: a }),
  setNormalized: (n) => set({ normalized: Math.max(0, Math.min(1, n)) }),
  toggleFlipped: () => set(s => ({ flipped: !s.flipped })),
}))
