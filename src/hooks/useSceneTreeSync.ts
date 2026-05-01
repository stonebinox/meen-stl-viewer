import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useViewerStore } from '../store/viewerStore'
import { useSceneTreeStore, SceneTreeNode } from '../store/sceneTreeStore'

export function useSceneTreeSync() {
  const currentModel = useViewerStore(s => s.currentModel)
  const { setTree, clearTree } = useSceneTreeStore()
  const objectMapRef = useRef<Map<string, THREE.Object3D>>(new Map())

  useEffect(() => {
    if (!currentModel) {
      clearTree()
      objectMapRef.current.clear()
      return
    }

    const nodesById: Record<string, SceneTreeNode> = {}
    const objectMap = new Map<string, THREE.Object3D>()
    const rootIds: string[] = []

    function traverse(obj: THREE.Object3D, parentId: string | null, depth: number) {
      const id = obj.uuid
      objectMap.set(obj.uuid, obj)

      const type: SceneTreeNode['type'] =
        (obj as THREE.Mesh).isMesh ? 'mesh' :
        obj.type === 'Group' ? 'group' : 'object3d'

      const childIds = obj.children.map(c => c.uuid)

      nodesById[id] = {
        id,
        name: obj.name?.trim() || `${type} ${Object.keys(nodesById).length}`,
        type,
        parentId,
        childIds,
        depth,
        visible: obj.visible,
        selectable: (obj as THREE.Mesh).isMesh,
        objectUuid: obj.uuid,
      }

      if (parentId === null) rootIds.push(id)
      obj.children.forEach(child => traverse(child, id, depth + 1))
    }

    traverse(currentModel.object, null, 0)
    objectMapRef.current = objectMap
    setTree({ modelId: currentModel.fileName, rootIds, nodesById })
  }, [currentModel, setTree, clearTree])

  return objectMapRef
}
