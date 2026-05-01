import { useCameraStore } from '../../store/cameraStore'
import type { CameraPreset } from '../../store/cameraStore'

const PRESETS: { value: CameraPreset; label: string; key?: string }[] = [
  { value: 'front', label: 'Front', key: '1' },
  { value: 'back', label: 'Back' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right', key: '3' },
  { value: 'top', label: 'Top', key: '7' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'iso', label: 'Iso', key: '0' },
]

export function ViewPresetButtons() {
  const applyPreset = useCameraStore(s => s.applyPreset)
  return (
    <div className="flex gap-1 flex-wrap">
      {PRESETS.map(p => (
        <button
          key={p.value}
          onClick={() => applyPreset(p.value)}
          title={p.key ? `Shortcut: ${p.key}` : undefined}
          className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500"
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
