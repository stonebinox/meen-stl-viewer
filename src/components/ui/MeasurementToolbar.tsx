import { useMeasurementStore } from '../../store/measurementStore'

export function MeasurementToolbar() {
  const { enabled, setEnabled, unitMode, setUnitMode, items, clearAll, clearDraft, draftPoint } =
    useMeasurementStore()

  return (
    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 flex flex-col gap-2 min-w-[180px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Measure</span>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`px-2 py-0.5 text-xs rounded ${enabled ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-400'}`}
        >
          {enabled ? 'Active' : 'Off'}
        </button>
      </div>

      {enabled && (
        <>
          <div className="flex gap-1">
            <button
              onClick={() => setUnitMode('model')}
              className={`flex-1 py-1 text-xs rounded ${unitMode === 'model' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'}`}
            >
              Units
            </button>
            <button
              onClick={() => setUnitMode('mm')}
              className={`flex-1 py-1 text-xs rounded ${unitMode === 'mm' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300'}`}
            >
              mm
            </button>
          </div>

          {draftPoint && (
            <div className="text-xs text-yellow-400">Click second point…</div>
          )}

          <div className="text-xs text-gray-500">
            {items.length} measurement{items.length !== 1 ? 's' : ''}
          </div>

          <div className="flex gap-1">
            {draftPoint && (
              <button
                onClick={clearDraft}
                className="flex-1 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
            {items.length > 0 && (
              <button
                onClick={clearAll}
                className="flex-1 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Clear all
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
