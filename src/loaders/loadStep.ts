import * as THREE from 'three'
import type { ViewerError } from '../types/viewer'

type TessellationPreset = 'preview' | 'balanced' | 'high'

interface StepLoadOptions {
  preset?: TessellationPreset
  onProgress?: (message: string) => void
}

export async function loadStep(
  file: File,
  options: StepLoadOptions = {}
): Promise<THREE.Group> {
  const { preset = 'balanced', onProgress } = options

  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('./step.worker.ts', import.meta.url),
      { type: 'module' }
    )

    const buffer = file.arrayBuffer()

    buffer.then((buf) => {
      worker.postMessage({ buffer: buf, preset }, [buf])
    })

    worker.onmessage = (e) => {
      const data = e.data

      if (data.type === 'progress') {
        onProgress?.(data.message)
        return
      }

      if (data.type === 'error') {
        worker.terminate()
        const err: ViewerError = {
          code: 'PARSE_FAILED',
          message: data.error ?? 'Failed to process STEP file',
          fileName: file.name,
        }
        reject(err)
        return
      }

      if (data.type === 'success') {
        worker.terminate()
        const group = new THREE.Group()
        group.name = file.name

        for (const shape of data.shapes) {
          const geometry = new THREE.BufferGeometry()
          geometry.setAttribute('position', new THREE.BufferAttribute(shape.positions, 3))
          geometry.setAttribute('normal', new THREE.BufferAttribute(shape.normals, 3))
          geometry.setIndex(new THREE.BufferAttribute(shape.indices, 1))
          geometry.computeVertexNormals()

          const material = new THREE.MeshStandardMaterial({
            color: '#8fa8c0',
            metalness: 0.15,
            roughness: 0.6,
          })
          const mesh = new THREE.Mesh(geometry, material)
          mesh.name = shape.name
          mesh.castShadow = true
          mesh.receiveShadow = true
          group.add(mesh)
        }

        resolve(group)
      }
    }

    worker.onerror = (err) => {
      worker.terminate()
      const viewerErr: ViewerError = {
        code: 'PARSE_FAILED',
        message: `STEP worker error: ${err.message}`,
        fileName: file.name,
      }
      reject(viewerErr)
    }
  })
}
