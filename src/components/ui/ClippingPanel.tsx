import { useClipStore, ClipAxis } from '../../store/clipStore'
import { useViewerStore } from '../../store/viewerStore'

export function ClippingPanel() {
  const model = useViewerStore(s => s.currentModel)
  const { enabled, axis, normalized, flipped, setEnabled, setAxis, setNormalized, toggleFlipped } = useClipStore()

  if (!model) return null

  return (
    <div className="bg-mm-green-dark/80 backdrop-blur-sm rounded-lg p-3 flex flex-col gap-2 min-w-[180px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-serif text-mm-gold uppercase tracking-wider">Section</span>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`px-2 py-0.5 text-xs rounded transition-colors ${enabled ? 'bg-mm-gold text-mm-green-dark font-medium' : 'bg-mm-green text-mm-green-muted'}`}
        >
          {enabled ? 'On' : 'Off'}
        </button>
      </div>

      {enabled && (
        <>
          <div className="flex gap-1">
            {(['x', 'y', 'z'] as ClipAxis[]).map(a => (
              <button
                key={a}
                onClick={() => setAxis(a)}
                className={`flex-1 py-1 text-xs rounded font-mono uppercase transition-colors ${
                  axis === a ? 'bg-mm-gold text-mm-green-dark font-medium' : 'bg-mm-green text-mm-cream-dim hover:bg-mm-green-light'
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <input
              type="range"
              min={0} max={1} step={0.001}
              value={normalized}
              onChange={e => setNormalized(parseFloat(e.target.value))}
              className="w-full accent-[#c9a16f]"
            />
            <span className="text-xs text-mm-green-muted text-center">{(normalized * 100).toFixed(1)}%</span>
          </div>

          <button
            onClick={toggleFlipped}
            className="px-2 py-1 text-xs rounded bg-mm-green text-mm-cream-dim hover:bg-mm-green-light transition-colors"
          >
            {flipped ? 'Flip ↑' : 'Flip ↓'}
          </button>
        </>
      )}
    </div>
  )
}
