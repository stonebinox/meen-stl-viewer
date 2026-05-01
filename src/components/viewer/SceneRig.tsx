import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useViewerStore } from '../../store/viewerStore'

export function SceneRig() {
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const environmentPreset = useViewerStore((s) => s.environmentPreset)
  const registerFitToView = useViewerStore((s) => s.registerFitToView)
  const registerResetCamera = useViewerStore((s) => s.registerResetCamera)

  const perspectiveCamera = camera as THREE.PerspectiveCamera

  useEffect(() => {
    registerFitToView((model?: THREE.Object3D) => {
      const controls = controlsRef.current
      if (!controls) return

      if (model) {
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = perspectiveCamera.fov * (Math.PI / 180)
        const cameraDistance = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5
        const direction = perspectiveCamera.position.clone().sub(controls.target).normalize()
        perspectiveCamera.position.copy(center.clone().add(direction.multiplyScalar(cameraDistance)))
        controls.target.copy(center)
        controls.update()
        perspectiveCamera.near = cameraDistance / 100
        perspectiveCamera.far = cameraDistance * 100
        perspectiveCamera.updateProjectionMatrix()
      } else {
        perspectiveCamera.position.set(3, 3, 3)
        controls.target.set(0, 0, 0)
        controls.update()
      }
    })

    registerResetCamera(() => {
      const controls = controlsRef.current
      if (!controls) return
      perspectiveCamera.position.set(3, 3, 3)
      controls.target.set(0, 0, 0)
      controls.update()
    })
  }, [registerFitToView, registerResetCamera, perspectiveCamera])

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={0.1}
        maxDistance={2000}
      />
      <Environment preset={environmentPreset} />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <gridHelper args={[20, 20, '#333', '#222']} />
    </>
  )
}
