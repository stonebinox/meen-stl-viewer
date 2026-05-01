import { useSceneTreeStore } from '../../store/sceneTreeStore'
import { useSceneTreeSync } from '../../hooks/useSceneTreeSync'
import { useViewerStore } from '../../store/viewerStore'

export function SceneTreePanel() {
  const model = useViewerStore(s => s.currentModel)
  const objectMapRef = useSceneTreeSync()
  const { rootIds, nodesById, expanded, selectedNodeId, toggleExpanded, setSelectedNode, toggleVisibility } = useSceneTreeStore()

  if (!model) return null

  function flattenTree(ids: string[]): string[] {
    const result: string[] = []
    for (const id of ids) {
      result.push(id)
      const node = nodesById[id]
      if (node && node.childIds.length > 0 && expanded[id]) {
        result.push(...flattenTree(node.childIds))
      }
    }
    return result
  }

  const flatNodes = flattenTree(rootIds)

  return (
    <div className="absolute left-0 top-0 h-full w-64 bg-gray-900/90 backdrop-blur-sm border-r border-gray-700 flex flex-col z-10">
      <div className="px-3 py-2 border-b border-gray-700 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Scene</span>
        <span className="text-xs text-gray-600">{Object.keys(nodesById).length} nodes</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {flatNodes.map(id => {
          const node = nodesById[id]
          if (!node) return null
          const isSelected = selectedNodeId === id
          const isExpanded = expanded[id]
          const hasChildren = node.childIds.length > 0

          return (
            <div
              key={id}
              style={{ paddingLeft: `${8 + node.depth * 16}px` }}
              className={`flex items-center gap-1 h-7 pr-2 cursor-pointer text-xs group
                ${isSelected ? 'bg-blue-600/30 text-white' : 'text-gray-300 hover:bg-gray-700/50'}
                ${!node.visible ? 'opacity-40' : ''}`}
              onClick={() => node.selectable && setSelectedNode(id)}
            >
              <button
                className="w-4 h-4 flex items-center justify-center shrink-0 text-gray-500"
                onClick={(e) => { e.stopPropagation(); if (hasChildren) toggleExpanded(id) }}
              >
                {hasChildren ? (isExpanded ? '▾' : '▸') : ''}
              </button>

              <span className="text-gray-500 shrink-0">
                {node.type === 'mesh' ? '⬡' : node.type === 'group' ? '▤' : '○'}
              </span>

              <span className="flex-1 truncate">{node.name}</span>

              <button
                className="w-5 h-5 flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
                onClick={(e) => { e.stopPropagation(); toggleVisibility(id, objectMapRef.current) }}
                title={node.visible ? 'Hide' : 'Show'}
              >
                {node.visible ? '👁' : '🚫'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
