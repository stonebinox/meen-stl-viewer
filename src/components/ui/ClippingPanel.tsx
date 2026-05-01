import { useClipStore, ClipAxis } from '../../store/clipStore'
import { useViewerStore } from '../../store/viewerStore'

export function ClippingPanel() {
  const model = useViewerStore(s => s.currentModel)
  const { enabled, axis, normalized, flipped, setEnabled, setAxis, setNormalized, toggleFlipped } = useClipStore()

  if (!model) return null

  return (
    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 flex flex-col gap-2 min-w-[180px]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Section</span>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`px-2 py-0.5 text-xs rounded ${enabled ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
        >
          {enabled ? 'On' : 'Off'}
        </button>
      </div>

      {enabled && (
        <>
          {/* Axis selector */}
          <div className="flex gap-1">
            {(['x', 'y', 'z'] as ClipAxis[]).map(a => (
              <button
                key={a}
                onClick={() => setAxis(a)}
                className={`flex-1 py-1 text-xs rounded font-mono uppercase ${
                  axis === a ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {a}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="flex flex-col gap-1">
            <input
              type="range"
              min={0} max={1} step={0.001}
              value={normalized}
              onChange={e => setNormalized(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <span className="text-xs text-gray-500 text-center">{(normalized * 100).toFixed(1)}%</span>
          </div>

          {/* Flip */}
          <button
            onClick={toggleFlipped}
            className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            {flipped ? 'Flip ↑' : 'Flip ↓'}
          </button>
        </>
      )}
    </div>
  )
}
