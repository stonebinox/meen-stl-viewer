import { useEffect } from 'react'
import * as THREE from 'three'
import { useViewerStore } from '../../store/viewerStore'
import { useMaterialOverrideStore } from '../../store/materialOverrideStore'
import { useRenderModeStore } from '../../store/renderModeStore'

export function MaterialOverrideEffect() {
  const model = useViewerStore(s => s.currentModel)
  const overrides = useMaterialOverrideStore(s => s.overrides)
  const renderMode = useRenderModeStore(s => s.mode)

  useEffect(() => {
    if (!model) return
    // Color overrides only apply in solid mode; other modes take priority
    if (renderMode !== 'solid') return

    model.object.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return
      const mesh = child as THREE.Mesh
      const uuid = mesh.uuid

      if (!mesh.userData.originalMaterial) {
        mesh.userData.originalMaterial = Array.isArray(mesh.material)
          ? mesh.material.map((m: THREE.Material) => m)
          : mesh.material
      }

      if (overrides[uuid]) {
        if (!mesh.userData.overrideMaterial) {
          mesh.userData.overrideMaterial = new THREE.MeshStandardMaterial({
            metalness: 0.1,
            roughness: 0.7,
          })
        }
        const overrideMat = mesh.userData.overrideMaterial as THREE.MeshStandardMaterial
        overrideMat.color.set(overrides[uuid])
        mesh.material = overrideMat
      } else {
        if (mesh.userData.originalMaterial) {
          mesh.material = mesh.userData.originalMaterial as THREE.Material | THREE.Material[]
        }
      }
    })
  }, [model, overrides, renderMode])

  return null
}
