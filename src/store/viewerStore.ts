import { create } from 'zustand'
import * as THREE from 'three'
import type { LoadStatus, LoadedModel, ViewerError } from '../types/viewer'
import { detectFormat } from '../utils/detectFormat'
import { loadModel } from '../loaders/loadModel'

export type EnvironmentPreset = 'studio' | 'sunset' | 'warehouse'
export type ControlType = 'orbit' | 'trackball'

interface SceneState {
  environmentPreset: EnvironmentPreset
  controlType: ControlType
  fitToViewFn: ((model?: THREE.Object3D) => void) | null
  resetCameraFn: (() => void) | null
}

interface SceneActions {
  setEnvironmentPreset: (p: EnvironmentPreset) => void
  setControlType: (c: ControlType) => void
  registerFitToView: (fn: (model?: THREE.Object3D) => void) => void
  registerResetCamera: (fn: () => void) => void
  fitToView: () => void
  resetCamera: () => void
}

interface ModelState {
  status: LoadStatus
  currentModel: LoadedModel | null
  error: ViewerError | null
  dragActive: boolean
}

interface ModelActions {
  loadFile: (file: File) => Promise<void>
  clearError: () => void
  resetModel: () => void
  setDragActive: (active: boolean) => void
}

type ViewerStore = SceneState & SceneActions & ModelState & ModelActions

export const useViewerStore = create<ViewerStore>()((set, get) => ({
  environmentPreset: 'studio',
  controlType: 'orbit',
  fitToViewFn: null,
  resetCameraFn: null,

  setEnvironmentPreset: (p) => set({ environmentPreset: p }),
  setControlType: (c) => set({ controlType: c }),
  registerFitToView: (fn) => set({ fitToViewFn: fn }),
  registerResetCamera: (fn) => set({ resetCameraFn: fn }),
  fitToView: () => get().fitToViewFn?.(get().currentModel?.object),
  resetCamera: () => get().resetCameraFn?.(),

  status: 'idle',
  currentModel: null,
  error: null,
  dragActive: false,

  loadFile: async (file: File) => {
    const format = detectFormat(file.name)
    if (!format) {
      set({
        status: 'error',
        error: {
          code: 'UNSUPPORTED_FORMAT',
          message: `Unsupported file format. Supported: STL, GLB, GLTF, OBJ, FBX, PLY, STP.`,
          fileName: file.name,
        },
      })
      return
    }

    const { currentModel } = get()
    if (currentModel) {
      currentModel.object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.geometry?.dispose()
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach(m => m?.dispose())
        }
      })
    }

    set({ status: 'loading', error: null })

    try {
      const result = await loadModel(file, format)
      set({ status: 'success', currentModel: result })
    } catch (err) {
      const viewerError: ViewerError = (err as ViewerError).code
        ? (err as ViewerError)
        : { code: 'PARSE_FAILED', message: String(err), fileName: file.name }
      set({ status: 'error', error: viewerError })
    }
  },

  clearError: () => set({ error: null, status: 'idle' }),

  resetModel: () => {
    const { currentModel } = get()
    if (currentModel) {
      currentModel.object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.geometry?.dispose()
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach(m => m?.dispose())
        }
      })
    }
    set({ status: 'idle', currentModel: null, error: null })
  },

  setDragActive: (active: boolean) => set({ dragActive: active }),
}))
