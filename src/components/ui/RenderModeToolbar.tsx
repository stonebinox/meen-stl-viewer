import { useRenderModeStore, RenderMode } from '../../store/renderModeStore'

const MODES: { value: RenderMode; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'wireframe', label: 'Wire' },
  { value: 'solid+wireframe', label: 'S+W' },
  { value: 'normals', label: 'Normals' },
  { value: 'xray', label: 'X-Ray' },
]

export function RenderModeToolbar() {
  const { mode, setMode } = useRenderModeStore()
  return (
    <div className="flex gap-1">
      {MODES.map(m => (
        <button
          key={m.value}
          onClick={() => setMode(m.value)}
          className={`px-2 py-1 text-xs rounded ${
            mode === m.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
