import { useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useCameraStore } from '../../store/cameraStore'
import type { CameraPreset } from '../../store/cameraStore'
import { useViewerStore } from '../../store/viewerStore'

const PRESET_DIRECTIONS: Record<CameraPreset, THREE.Vector3> = {
  front:  new THREE.Vector3(0, 0, 1),
  back:   new THREE.Vector3(0, 0, -1),
  left:   new THREE.Vector3(-1, 0, 0),
  right:  new THREE.Vector3(1, 0, 0),
  top:    new THREE.Vector3(0, 1, 0),
  bottom: new THREE.Vector3(0, -1, 0),
  iso:    new THREE.Vector3(1, 1, 1).normalize(),
}

export function CameraPresetEffect() {
  const { camera, controls } = useThree()
  const model = useViewerStore(s => s.currentModel)
  const registerApplyPreset = useCameraStore(s => s.registerApplyPreset)

  useEffect(() => {
    registerApplyPreset((preset) => {
      const orbitControls = controls as any
      if (!orbitControls) return

      let center = new THREE.Vector3(0, 0, 0)
      let distance = 5

      if (model) {
        const box = new THREE.Box3().setFromObject(model.object)
        center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180)
        distance = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5
      }

      const dir = PRESET_DIRECTIONS[preset]
      const newPos = center.clone().add(dir.clone().multiplyScalar(distance))

      const startPos = camera.position.clone()
      const startTarget = orbitControls.target.clone()
      const duration = 300
      const startTime = performance.now()

      function animate() {
        const elapsed = performance.now() - startTime
        const t = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - t, 3)

        camera.position.lerpVectors(startPos, newPos, ease)
        orbitControls.target.lerpVectors(startTarget, center, ease)
        orbitControls.update()

        if (t < 1) requestAnimationFrame(animate)
      }
      animate()
    })
  }, [camera, controls, model, registerApplyPreset])

  return null
}
