import type { ModelFormat } from '../types/viewer'

export function detectFormat(fileName: string): ModelFormat | null {
  const ext = fileName.split('.').pop()?.toLowerCase()
  const map: Record<string, ModelFormat> = {
    stl: 'stl', glb: 'glb', gltf: 'gltf',
    obj: 'obj', fbx: 'fbx', ply: 'ply',
    stp: 'stp', step: 'step',
  }
  return map[ext ?? ''] ?? null
}
