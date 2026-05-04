import { useRecentFilesStore } from '../../store/recentFilesStore'

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function RecentFilesPanel() {
  const { files, removeRecentFile, clearRecentFiles } = useRecentFilesStore()

  if (files.length === 0) {
    return (
      <div className="px-3 py-3">
        <div className="text-xs text-mm-green-muted text-center">No recent files</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {files.map(f => (
        <div key={f.id} className="flex items-center gap-2 px-3 py-2 hover:bg-mm-green/30 group">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-mm-cream-dim truncate">{f.name}</div>
            <div className="text-xs text-mm-green-muted">{f.format.toUpperCase()} · {formatSize(f.size)} · {formatDate(f.openedAt)}</div>
          </div>
          <button
            onClick={() => removeRecentFile(f.id)}
            className="opacity-0 group-hover:opacity-100 text-mm-green-muted hover:text-mm-cream text-xs shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
      <div className="px-3 py-2 border-t border-mm-green/40">
        <button onClick={clearRecentFiles} className="text-xs text-mm-green-muted hover:text-mm-cream transition-colors">
          Clear all
        </button>
        <div className="text-xs text-mm-green-muted/60 mt-1">Recent files are metadata only — you cannot reopen files from here.</div>
      </div>
    </div>
  )
}
