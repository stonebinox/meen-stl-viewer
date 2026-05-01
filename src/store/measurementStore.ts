import { create } from 'zustand'

type Vec3 = [number, number, number]
type UnitMode = 'model' | 'mm'

export interface Measurement {
  id: string
  a: Vec3
  b: Vec3
  distanceModel: number
}

interface MeasurementState {
  enabled: boolean
  unitMode: UnitMode
  mmPerUnit: number
  draftPoint: Vec3 | null
  items: Measurement[]
}
interface MeasurementActions {
  setEnabled: (v: boolean) => void
  setUnitMode: (m: UnitMode) => void
  setMmPerUnit: (v: number) => void
  pickPoint: (p: Vec3) => void
  clearDraft: () => void
  clearAll: () => void
}

export const useMeasurementStore = create<MeasurementState & MeasurementActions>()((set, get) => ({
  enabled: false,
  unitMode: 'model',
  mmPerUnit: 1,
  draftPoint: null,
  items: [],

  setEnabled: (v) => set({ enabled: v, draftPoint: null }),
  setUnitMode: (m) => set({ unitMode: m }),
  setMmPerUnit: (v) => set({ mmPerUnit: v }),

  pickPoint: (p) => {
    const { draftPoint, items } = get()
    if (!draftPoint) {
      set({ draftPoint: p })
    } else {
      const dx = p[0] - draftPoint[0]
      const dy = p[1] - draftPoint[1]
      const dz = p[2] - draftPoint[2]
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
      const measurement: Measurement = {
        id: crypto.randomUUID(),
        a: draftPoint,
        b: p,
        distanceModel: dist,
      }
      set({ items: [...items, measurement], draftPoint: null })
    }
  },

  clearDraft: () => set({ draftPoint: null }),
  clearAll: () => set({ items: [], draftPoint: null }),
}))
