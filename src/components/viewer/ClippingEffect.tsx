import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useViewerStore } from '../../store/viewerStore'
import { useClipStore } from '../../store/clipStore'
import { useRenderModeStore } from '../../store/renderModeStore'

const AXIS_NORMALS: Record<string, THREE.Vector3> = {
  x: new THREE.Vector3(1, 0, 0),
  y: new THREE.Vector3(0, 1, 0),
  z: new THREE.Vector3(0, 0, 1),
}

export function ClippingEffect() {
  const { gl } = useThree()
  const model = useViewerStore(s => s.currentModel)
  const { enabled, axis, normalized, flipped } = useClipStore()
  const renderMode = useRenderModeStore(s => s.mode)
  const planeRef = useRef(new THREE.Plane())

  useEffect(() => {
    gl.localClippingEnabled = true
  }, [gl])

  useEffect(() => {
    if (!model) return

    const box = new THREE.Box3().setFromObject(model.object)
    const min = box.min
    const max = box.max

    // Map normalized 0..1 to world coordinate on the axis
    const axisMin = axis === 'x' ? min.x : axis === 'y' ? min.y : min.z
    const axisMax = axis === 'x' ? max.x : axis === 'y' ? max.y : max.z
    const worldPos = axisMin + normalized * (axisMax - axisMin)

    const normal = AXIS_NORMALS[axis].clone()
    if (flipped) normal.negate()
    planeRef.current.set(normal, -worldPos * (flipped ? -1 : 1))

    // Apply to all mesh materials
    model.object.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return
      const mesh = child as THREE.Mesh
      const applyClip = (mat: THREE.Material) => {
        mat.clippingPlanes = enabled ? [planeRef.current] : []
        mat.clipShadows = true
        mat.needsUpdate = true
      }
      if (Array.isArray(mesh.material)) mesh.material.forEach(applyClip)
      else applyClip(mesh.material as THREE.Material)
    })
  }, [model, enabled, axis, normalized, flipped, renderMode])

  return null
}
