import { useMeasurementStore } from '../../store/measurementStore'

export function MeasurementToolbar() {
  const { enabled, setEnabled, unitMode, setUnitMode, items, clearAll, clearDraft, draftPoint } =
    useMeasurementStore()

  return (
    <div className="bg-mm-green-dark/80 backdrop-blur-sm rounded-lg p-3 flex flex-col gap-2 min-w-[180px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-serif text-mm-gold uppercase tracking-wider">Measure</span>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`px-2 py-0.5 text-xs rounded transition-colors ${enabled ? 'bg-mm-gold text-mm-green-dark font-medium' : 'bg-mm-green text-mm-green-muted'}`}
        >
          {enabled ? 'Active' : 'Off'}
        </button>
      </div>

      {enabled && (
        <>
          <div className="flex gap-1">
            <button
              onClick={() => setUnitMode('model')}
              className={`flex-1 py-1 text-xs rounded transition-colors ${unitMode === 'model' ? 'bg-mm-gold text-mm-green-dark font-medium' : 'bg-mm-green text-mm-cream-dim'}`}
            >
              Units
            </button>
            <button
              onClick={() => setUnitMode('mm')}
              className={`flex-1 py-1 text-xs rounded transition-colors ${unitMode === 'mm' ? 'bg-mm-gold text-mm-green-dark font-medium' : 'bg-mm-green text-mm-cream-dim'}`}
            >
              mm
            </button>
          </div>

          {draftPoint && (
            <div className="text-xs text-mm-gold">Click second point…</div>
          )}

          <div className="text-xs text-mm-green-muted">
            {items.length} measurement{items.length !== 1 ? 's' : ''}
          </div>

          <div className="flex gap-1">
            {draftPoint && (
              <button
                onClick={clearDraft}
                className="flex-1 py-1 text-xs rounded bg-mm-green text-mm-cream-dim hover:bg-mm-green-light transition-colors"
              >
                Cancel
              </button>
            )}
            {items.length > 0 && (
              <button
                onClick={clearAll}
                className="flex-1 py-1 text-xs rounded bg-mm-green text-mm-cream-dim hover:bg-mm-green-light transition-colors"
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
