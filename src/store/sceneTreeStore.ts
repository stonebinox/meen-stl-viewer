import { create } from 'zustand'
import * as THREE from 'three'

export type SceneNodeType = 'group' | 'mesh' | 'object3d'

export interface SceneTreeNode {
  id: string
  name: string
  type: SceneNodeType
  parentId: string | null
  childIds: string[]
  depth: number
  visible: boolean
  selectable: boolean
  objectUuid: string
}

interface SceneTreeState {
  modelId: string | null
  rootIds: string[]
  nodesById: Record<string, SceneTreeNode>
  expanded: Record<string, boolean>
  selectedNodeId: string | null
}

interface SceneTreeActions {
  setTree: (payload: { modelId: string; rootIds: string[]; nodesById: Record<string, SceneTreeNode> }) => void
  toggleExpanded: (nodeId: string) => void
  setSelectedNode: (nodeId: string | null) => void
  toggleVisibility: (nodeId: string, objectMap: Map<string, THREE.Object3D>) => void
  clearTree: () => void
}

export const useSceneTreeStore = create<SceneTreeState & SceneTreeActions>()((set, get) => ({
  modelId: null,
  rootIds: [],
  nodesById: {},
  expanded: {},
  selectedNodeId: null,

  setTree: ({ modelId, rootIds, nodesById }) => {
    const expanded: Record<string, boolean> = {}
    for (const id of rootIds) {
      expanded[id] = true
    }
    set({ modelId, rootIds, nodesById, expanded, selectedNodeId: null })
  },

  toggleExpanded: (nodeId) => {
    const { expanded } = get()
    set({ expanded: { ...expanded, [nodeId]: !expanded[nodeId] } })
  },

  setSelectedNode: (nodeId) => {
    set({ selectedNodeId: nodeId })
  },

  toggleVisibility: (nodeId, objectMap) => {
    const { nodesById } = get()
    const node = nodesById[nodeId]
    if (!node) return

    const obj = objectMap.get(node.objectUuid)
    if (!obj) return

    obj.visible = !obj.visible

    set({
      nodesById: {
        ...nodesById,
        [nodeId]: { ...node, visible: obj.visible },
      },
    })
  },

  clearTree: () => {
    set({
      modelId: null,
      rootIds: [],
      nodesById: {},
      expanded: {},
      selectedNodeId: null,
    })
  },
}))
