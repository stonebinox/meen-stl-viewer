import { create } from 'zustand'

export type RenderMode = 'solid' | 'wireframe' | 'solid+wireframe' | 'normals' | 'xray'

interface RenderModeState {
  mode: RenderMode
}
interface RenderModeActions {
  setMode: (mode: RenderMode) => void
}

export const useRenderModeStore = create<RenderModeState & RenderModeActions>()(set => ({
  mode: 'solid',
  setMode: (mode) => set({ mode }),
}))
