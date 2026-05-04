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
          className={`px-2 py-1 text-xs rounded transition-colors ${
            mode === m.value
              ? 'bg-ml-gold text-ml-black font-medium'
              : 'bg-ml-gunmetal text-ml-platinum hover:bg-white/[0.1] hover:text-ml-white'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
