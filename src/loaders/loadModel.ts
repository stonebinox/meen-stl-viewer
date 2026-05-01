import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import type { ModelFormat, LoadedModel, ViewerError } from '../types/viewer'
import { computeModelStats } from '../utils/computeModelStats'

export async function loadModel(
  file: File,
  format: ModelFormat
): Promise<LoadedModel> {
  const url = URL.createObjectURL(file)
  try {
    let object: THREE.Object3D

    if (format === 'stl') {
      const loader = new STLLoader()
      const geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
        loader.load(url, resolve, undefined, reject)
      })
      if (!geometry.attributes.normal) geometry.computeVertexNormals()
      const material = new THREE.MeshStandardMaterial({ color: '#bfc7d5', metalness: 0.1, roughness: 0.7 })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.castShadow = true
      mesh.receiveShadow = true
      object = new THREE.Group()
      object.add(mesh)
    } else if (format === 'glb' || format === 'gltf') {
      const loader = new GLTFLoader()
      const gltf = await new Promise<{ scene: THREE.Object3D }>((resolve, reject) => {
        loader.load(url, resolve, undefined, reject)
      })
      object = gltf.scene
      object.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    } else if (format === 'obj') {
      try {
        const loader = new OBJLoader()
        const loaded = await new Promise<THREE.Group>((resolve, reject) => {
          loader.load(url, resolve, undefined, reject)
        })
        loaded.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            if (!mesh.material || Array.isArray(mesh.material) === false) {
              mesh.material = new THREE.MeshStandardMaterial({ color: '#bfc7d5', metalness: 0.1, roughness: 0.7 })
            }
            mesh.castShadow = true
            mesh.receiveShadow = true
          }
        })
        object = loaded
      } catch (e) {
        if ((e as ViewerError).code) throw e
        const err: ViewerError = {
          code: 'PARSE_FAILED',
          message: `Failed to parse OBJ file: ${(e as Error).message ?? 'Unknown error'}`,
          fileName: file.name,
        }
        throw err
      }
    } else if (format === 'fbx') {
      try {
        const loader = new FBXLoader()
        const loaded = await new Promise<THREE.Group>((resolve, reject) => {
          loader.load(url, (group) => resolve(group as THREE.Group), undefined, reject)
        })
        loaded.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        const box = new THREE.Box3().setFromObject(loaded)
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        if (maxDim > 100) {
          const scale = 5 / maxDim
          loaded.scale.setScalar(scale)
        }
        object = loaded
      } catch (e) {
        if ((e as ViewerError).code) throw e
        const err: ViewerError = {
          code: 'PARSE_FAILED',
          message: `Failed to parse FBX file: ${(e as Error).message ?? 'Unknown error'}`,
          fileName: file.name,
        }
        throw err
      }
    } else if (format === 'ply') {
      try {
        const loader = new PLYLoader()
        const geometry = await new Promise<THREE.BufferGeometry>((resolve, reject) => {
          loader.load(url, resolve, undefined, reject)
        })
        if (!geometry.attributes.normal) geometry.computeVertexNormals()
        const hasVertexColors = !!geometry.attributes.color
        const material = new THREE.MeshStandardMaterial({
          color: hasVertexColors ? 0xffffff : '#bfc7d5',
          vertexColors: hasVertexColors,
          metalness: 0.1,
          roughness: 0.7,
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.castShadow = true
        mesh.receiveShadow = true
        const group = new THREE.Group()
        group.add(mesh)
        object = group
      } catch (e) {
        if ((e as ViewerError).code) throw e
        const err: ViewerError = {
          code: 'PARSE_FAILED',
          message: `Failed to parse PLY file: ${(e as Error).message ?? 'Unknown error'}`,
          fileName: file.name,
        }
        throw err
      }
    } else if (format === 'stp' || format === 'step') {
      const { loadStep } = await import('./loadStep')
      object = await loadStep(file, {
        preset: 'balanced',
        onProgress: (msg) => console.log('[STEP]', msg),
      })
    } else {
      const exhaustiveFormat: string = format
      const err: ViewerError = {
        code: 'PARSE_FAILED',
        message: `${exhaustiveFormat.toUpperCase()} loader not yet implemented. Supported: STL, GLB/GLTF.`,
        fileName: file.name,
      }
      throw err
    }

    const { bounds, meta } = computeModelStats(object, format)

    return {
      fileName: file.name,
      fileSize: file.size,
      format,
      object,
      bounds,
      meta: { ...meta, format },
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}
