import { useScreenshotStore } from '../../store/screenshotStore'

export function ScreenshotButton() {
  const { bgMode, setBgMode, exportPng, isExporting, error } = useScreenshotStore()

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <button
          onClick={() => setBgMode('transparent')}
          className={`flex-1 py-1 text-xs rounded ${bgMode === 'transparent' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          Transparent
        </button>
        <button
          onClick={() => setBgMode('white')}
          className={`flex-1 py-1 text-xs rounded ${bgMode === 'white' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          White BG
        </button>
      </div>
      <button
        onClick={exportPng}
        disabled={isExporting}
        className="py-1.5 text-xs rounded bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:opacity-50"
      >
        {isExporting ? 'Exporting…' : '📷 Export PNG'}
      </button>
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  )
}
