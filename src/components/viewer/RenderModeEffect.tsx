import { useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useViewerStore } from '../../store/viewerStore'
import { useRenderModeStore } from '../../store/renderModeStore'

export function RenderModeEffect() {
  const model = useViewerStore(s => s.currentModel)
  const mode = useRenderModeStore(s => s.mode)
  const { gl } = useThree()

  useEffect(() => {
    if (!model) return
    gl.localClippingEnabled = true

    // Collect meshes FIRST, then process — modifying children during
    // Object3D.traverse() corrupts the iteration and crashes.
    const meshes: THREE.Mesh[] = []
    model.object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh)
    })

    for (const mesh of meshes) {
      if (!mesh.geometry) continue

      // Cache original material on first encounter
      if (!mesh.userData.originalMaterial) {
        mesh.userData.originalMaterial = mesh.material
      }
      const original = mesh.userData.originalMaterial as THREE.Material | THREE.Material[]

      // Remove any existing edge mesh
      if (mesh.userData.edgeMesh) {
        mesh.parent?.remove(mesh.userData.edgeMesh)
        ;(mesh.userData.edgeMesh as THREE.LineSegments).geometry.dispose()
        const edgeMat = (mesh.userData.edgeMesh as THREE.LineSegments).material
        if (edgeMat instanceof THREE.Material) edgeMat.dispose()
        mesh.userData.edgeMesh = null
      }

      try {
        switch (mode) {
          case 'solid': {
            mesh.visible = true
            mesh.material = original
            break
          }

          case 'wireframe': {
            mesh.visible = false
            const edges = new THREE.EdgesGeometry(mesh.geometry, 15)
            const line = new THREE.LineSegments(
              edges,
              new THREE.LineBasicMaterial({ color: '#4a9eff' })
            )
            line.position.copy(mesh.position)
            line.rotation.copy(mesh.rotation)
            line.scale.copy(mesh.scale)
            mesh.parent?.add(line)
            mesh.userData.edgeMesh = line
            break
          }

          case 'solid+wireframe': {
            mesh.visible = true
            const applyOffset = (mat: THREE.Material) => {
              mat.polygonOffset = true
              mat.polygonOffsetFactor = 1
              mat.polygonOffsetUnits = 1
            }
            if (Array.isArray(original)) original.forEach(applyOffset)
            else applyOffset(original as THREE.Material)
            mesh.material = original

            const edges = new THREE.EdgesGeometry(mesh.geometry, 15)
            const line = new THREE.LineSegments(
              edges,
              new THREE.LineBasicMaterial({ color: '#222', depthWrite: false })
            )
            line.position.copy(mesh.position)
            line.rotation.copy(mesh.rotation)
            line.scale.copy(mesh.scale)
            mesh.parent?.add(line)
            mesh.userData.edgeMesh = line
            break
          }

          case 'normals': {
            mesh.visible = true
            if (!mesh.userData.normalMaterial) {
              mesh.userData.normalMaterial = new THREE.MeshNormalMaterial()
            }
            if (!mesh.geometry.attributes['normal']) {
              try { mesh.geometry.computeVertexNormals() } catch { /* skip */ }
            }
            mesh.material = mesh.userData.normalMaterial as THREE.Material
            break
          }

          case 'xray': {
            mesh.visible = true
            if (!mesh.userData.xrayMaterial) {
              mesh.userData.xrayMaterial = new THREE.MeshStandardMaterial({
                color: '#8fbfdf',
                transparent: true,
                opacity: 0.25,
                depthWrite: false,
                depthTest: true,
                side: THREE.DoubleSide,
              })
            }
            mesh.material = mesh.userData.xrayMaterial as THREE.Material
            break
          }
        }
      } catch {
        // If a single mesh fails, skip it rather than crashing the whole effect
        mesh.visible = false
      }
    }
  }, [model, mode, gl])

  return null
}
