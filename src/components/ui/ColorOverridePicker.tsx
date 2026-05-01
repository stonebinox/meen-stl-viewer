import { HexColorPicker } from 'react-colorful'
import { useMaterialOverrideStore } from '../../store/materialOverrideStore'
import { useViewerStore } from '../../store/viewerStore'

export function ColorOverridePicker() {
  const { pickerOpen, selectedMeshUuid, overrides, setOverride, clearOverride, clearAll, closePicker } =
    useMaterialOverrideStore()
  const model = useViewerStore(s => s.currentModel)

  if (!pickerOpen || !selectedMeshUuid || !model) return null

  const currentColor = overrides[selectedMeshUuid] ?? '#bfc7d5'

  let meshName = 'Mesh'
  model.object.traverse(child => {
    if (child.uuid === selectedMeshUuid && child.name) meshName = child.name
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={closePicker}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl flex flex-col gap-3"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white truncate max-w-[180px]">{meshName}</span>
          <button onClick={closePicker} className="text-gray-400 hover:text-white ml-4">✕</button>
        </div>

        <HexColorPicker color={currentColor} onChange={c => setOverride(selectedMeshUuid, c)} />

        <div className="flex gap-2">
          <button
            onClick={() => clearOverride(selectedMeshUuid)}
            className="flex-1 py-1.5 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            Reset mesh
          </button>
          <button
            onClick={() => { clearAll(); closePicker() }}
            className="flex-1 py-1.5 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            Reset all
          </button>
        </div>
      </div>
    </div>
  )
}
