import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useViewerStore } from '../../store/viewerStore'

export function SceneModel() {
  const model = useViewerStore((s) => s.currentModel)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (model && groupRef.current) {
      while (groupRef.current.children.length) {
        groupRef.current.remove(groupRef.current.children[0])
      }
      groupRef.current.add(model.object)
    }
  }, [model])

  return <group ref={groupRef} />
}
