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
        <div className="text-xs text-gray-600 text-center">No recent files</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {files.map(f => (
        <div key={f.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-800/50 group">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-300 truncate">{f.name}</div>
            <div className="text-xs text-gray-600">{f.format.toUpperCase()} · {formatSize(f.size)} · {formatDate(f.openedAt)}</div>
          </div>
          <button
            onClick={() => removeRecentFile(f.id)}
            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-300 text-xs shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
      <div className="px-3 py-2 border-t border-gray-800">
        <button onClick={clearRecentFiles} className="text-xs text-gray-500 hover:text-gray-300">
          Clear all
        </button>
        <div className="text-xs text-gray-700 mt-1">Recent files are metadata only — you cannot reopen files from here.</div>
      </div>
    </div>
  )
}
