import { create } from 'zustand'

type BgMode = 'transparent' | 'white'

interface ScreenshotState {
  bgMode: BgMode
  canvasRef: HTMLCanvasElement | null
  isExporting: boolean
  error: string | null
}
interface ScreenshotActions {
  setBgMode: (m: BgMode) => void
  registerCanvas: (canvas: HTMLCanvasElement) => void
  exportPng: () => Promise<void>
}

export const useScreenshotStore = create<ScreenshotState & ScreenshotActions>()((set, get) => ({
  bgMode: 'transparent',
  canvasRef: null,
  isExporting: false,
  error: null,

  setBgMode: (m) => set({ bgMode: m }),
  registerCanvas: (canvas) => set({ canvasRef: canvas }),

  exportPng: async () => {
    const { canvasRef, bgMode } = get()
    if (!canvasRef) { set({ error: 'Canvas not ready' }); return }
    set({ isExporting: true, error: null })
    try {
      const { exportCanvasPng } = await import('../utils/screenshot')
      await exportCanvasPng(canvasRef, bgMode)
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Export failed' })
    } finally {
      set({ isExporting: false })
    }
  },
}))
