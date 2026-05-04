import { useClipStore, ClipAxis } from '../../store/clipStore'
import { useViewerStore } from '../../store/viewerStore'

export function ClippingPanel() {
  const model = useViewerStore(s => s.currentModel)
  const { enabled, axis, normalized, flipped, setEnabled, setAxis, setNormalized, toggleFlipped } = useClipStore()

  if (!model) return null

  return (
    <div className="bg-ml-charcoal/80 backdrop-blur-sm rounded-lg p-3 flex flex-col gap-2 min-w-[180px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-serif text-ml-gold uppercase tracking-wider">Section</span>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`px-2 py-0.5 text-xs rounded transition-colors ${enabled ? 'bg-ml-gold text-ml-black font-medium' : 'bg-ml-gunmetal text-ml-silver'}`}
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
                  axis === a ? 'bg-ml-gold text-ml-black font-medium' : 'bg-ml-gunmetal text-ml-platinum hover:bg-white/[0.1]'
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
              className="w-full accent-[#C9A227]"
            />
            <span className="text-xs text-ml-silver text-center">{(normalized * 100).toFixed(1)}%</span>
          </div>

          <button
            onClick={toggleFlipped}
            className="px-2 py-1 text-xs rounded bg-ml-gunmetal text-ml-platinum hover:bg-white/[0.1] transition-colors"
          >
            {flipped ? 'Flip ↑' : 'Flip ↓'}
          </button>
        </>
      )}
    </div>
  )
}
