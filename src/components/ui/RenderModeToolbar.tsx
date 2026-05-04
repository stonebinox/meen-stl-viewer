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
              ? 'bg-mm-gold text-mm-green-dark font-medium'
              : 'bg-mm-green text-mm-cream-dim hover:bg-mm-green-light hover:text-mm-cream'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
