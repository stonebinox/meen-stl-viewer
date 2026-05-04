import { useMeasurementStore } from '../../store/measurementStore'

export function MeasurementToolbar() {
  const { enabled, setEnabled, unitMode, setUnitMode, items, clearAll, clearDraft, draftPoint } =
    useMeasurementStore()

  return (
    <div className="bg-ml-charcoal/80 backdrop-blur-sm rounded-lg p-3 flex flex-col gap-2 min-w-[180px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-serif text-ml-gold uppercase tracking-wider">Measure</span>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`px-2 py-0.5 text-xs rounded transition-colors ${enabled ? 'bg-ml-gold text-ml-black font-medium' : 'bg-ml-gunmetal text-ml-silver'}`}
        >
          {enabled ? 'Active' : 'Off'}
        </button>
      </div>

      {enabled && (
        <>
          <div className="flex gap-1">
            <button
              onClick={() => setUnitMode('model')}
              className={`flex-1 py-1 text-xs rounded transition-colors ${unitMode === 'model' ? 'bg-ml-gold text-ml-black font-medium' : 'bg-ml-gunmetal text-ml-platinum'}`}
            >
              Units
            </button>
            <button
              onClick={() => setUnitMode('mm')}
              className={`flex-1 py-1 text-xs rounded transition-colors ${unitMode === 'mm' ? 'bg-ml-gold text-ml-black font-medium' : 'bg-ml-gunmetal text-ml-platinum'}`}
            >
              mm
            </button>
          </div>

          {draftPoint && (
            <div className="text-xs text-ml-gold">Click second point…</div>
          )}

          <div className="text-xs text-ml-silver">
            {items.length} measurement{items.length !== 1 ? 's' : ''}
          </div>

          <div className="flex gap-1">
            {draftPoint && (
              <button
                onClick={clearDraft}
                className="flex-1 py-1 text-xs rounded bg-ml-gunmetal text-ml-platinum hover:bg-white/[0.1] transition-colors"
              >
                Cancel
              </button>
            )}
            {items.length > 0 && (
              <button
                onClick={clearAll}
                className="flex-1 py-1 text-xs rounded bg-ml-gunmetal text-ml-platinum hover:bg-white/[0.1] transition-colors"
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
