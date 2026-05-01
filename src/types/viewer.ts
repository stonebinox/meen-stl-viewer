import type * as THREE from 'three'

export type ModelFormat = 'stl' | 'glb' | 'gltf' | 'obj' | 'fbx' | 'ply' | 'stp' | 'step'

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

export type ViewerErrorCode =
  | 'UNSUPPORTED_FORMAT'
  | 'PARSE_FAILED'
  | 'EMPTY_FILE'
  | 'STEP_NOT_IMPLEMENTED'

export interface ViewerError {
  code: ViewerErrorCode
  message: string
  fileName?: string
}

export interface ModelBounds {
  box: THREE.Box3
  center: THREE.Vector3
  size: THREE.Vector3
  radius: number
}

export interface ModelMeta {
  format: ModelFormat
  hasAnimations: boolean
  materialCount: number
  meshCount: number
  triangleCount: number
  vertexCount: number
}

export interface LoadedModel {
  fileName: string
  fileSize: number
  format: ModelFormat
  object: THREE.Object3D
  bounds: ModelBounds
  meta: ModelMeta
}
