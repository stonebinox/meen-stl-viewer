import { useViewerStore } from '../../store/viewerStore'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatNumber(n: number): string {
  return Math.round(n).toLocaleString()
}

function formatDimension(v: number): string {
  return v.toFixed(2)
}

interface InfoRowProps {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-baseline justify-between py-1.5 border-b border-gray-800">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs text-gray-200 font-mono ml-2 truncate max-w-[150px] text-right">{value}</span>
    </div>
  )
}

export function ModelInfoPanel() {
  const model = useViewerStore(s => s.currentModel)
  const status = useViewerStore(s => s.status)

  return (
    <div className="absolute right-0 top-0 h-full w-70 bg-gray-900/90 backdrop-blur-sm border-l border-gray-700 flex flex-col z-10" style={{ width: '280px' }}>
      <div className="px-3 py-2 border-b border-gray-700">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Model Info</span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {status === 'loading' && (
          <div className="text-xs text-gray-500 text-center py-4">Loading…</div>
        )}
        {status === 'idle' && !model && (
          <div className="text-xs text-gray-600 text-center py-4">No model loaded</div>
        )}
        {model && (
          <>
            <InfoRow label="File" value={model.fileName} />
            <InfoRow label="Format" value={model.format.toUpperCase()} />
            <InfoRow label="Size" value={formatFileSize(model.fileSize)} />
            <InfoRow
              label="Dimensions"
              value={`${formatDimension(model.bounds.size.x)} × ${formatDimension(model.bounds.size.y)} × ${formatDimension(model.bounds.size.z)}`}
            />
            <InfoRow label="Triangles" value={formatNumber(model.meta.triangleCount)} />
            <InfoRow label="Vertices" value={formatNumber(model.meta.vertexCount)} />
            <InfoRow label="Meshes" value={formatNumber(model.meta.meshCount)} />

            <div className="mt-3 text-xs text-gray-600 leading-relaxed">
              Dimensions shown in model units (interpreted as mm). Three.js is unitless.
            </div>
          </>
        )}
      </div>
    </div>
  )
}
