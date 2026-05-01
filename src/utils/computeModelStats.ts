import * as THREE from 'three'
import type { ModelBounds, ModelMeta, ModelFormat } from '../types/viewer'

export function computeModelStats(
  object: THREE.Object3D,
  format: ModelFormat
): { bounds: ModelBounds; meta: Omit<ModelMeta, 'format'> } {
  const box = new THREE.Box3().setFromObject(object)
  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())
  const radius = size.length() / 2

  let triangleCount = 0
  let vertexCount = 0
  let meshCount = 0
  const materialSet = new Set<THREE.Material>()
  const hasAnimations = false

  void format

  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      meshCount++
      const mesh = child as THREE.Mesh
      const geom = mesh.geometry
      if (geom) {
        const pos = geom.getAttribute('position')
        if (pos) {
          vertexCount += pos.count
          triangleCount += geom.index
            ? geom.index.count / 3
            : pos.count / 3
        }
      }
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach(m => m && materialSet.add(m))
    }
  })

  return {
    bounds: { box, center, size, radius },
    meta: { hasAnimations, materialCount: materialSet.size, meshCount, triangleCount, vertexCount },
  }
}
