import { create } from 'zustand'

interface MaterialOverrideState {
  overrides: Record<string, string>  // meshUuid → hex color
  selectedMeshUuid: string | null
  pickerOpen: boolean
}
interface MaterialOverrideActions {
  setOverride: (uuid: string, color: string) => void
  clearOverride: (uuid: string) => void
  clearAll: () => void
  setSelectedMesh: (uuid: string | null) => void
  openPicker: (uuid: string) => void
  closePicker: () => void
}

export const useMaterialOverrideStore = create<MaterialOverrideState & MaterialOverrideActions>()((set) => ({
  overrides: {},
  selectedMeshUuid: null,
  pickerOpen: false,

  setOverride: (uuid, color) => set(s => ({ overrides: { ...s.overrides, [uuid]: color } })),
  clearOverride: (uuid) => set(s => {
    const { [uuid]: _, ...rest } = s.overrides
    return { overrides: rest }
  }),
  clearAll: () => set({ overrides: {} }),
  setSelectedMesh: (uuid) => set({ selectedMeshUuid: uuid }),
  openPicker: (uuid) => set({ selectedMeshUuid: uuid, pickerOpen: true }),
  closePicker: () => set({ pickerOpen: false }),
}))
