import { useScreenshotStore } from '../../store/screenshotStore'

export function ScreenshotButton() {
  const { bgMode, setBgMode, exportPng, isExporting, error } = useScreenshotStore()

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <button
          onClick={() => setBgMode('transparent')}
          className={`flex-1 py-1 text-xs rounded transition-colors ${bgMode === 'transparent' ? 'bg-ml-gold text-ml-black font-medium' : 'bg-ml-gunmetal text-ml-platinum'}`}
        >
          Transparent
        </button>
        <button
          onClick={() => setBgMode('white')}
          className={`flex-1 py-1 text-xs rounded transition-colors ${bgMode === 'white' ? 'bg-ml-gold text-ml-black font-medium' : 'bg-ml-gunmetal text-ml-platinum'}`}
        >
          White BG
        </button>
      </div>
      <button
        onClick={exportPng}
        disabled={isExporting}
        className="py-1.5 text-xs rounded bg-ml-gunmetal text-ml-white hover:bg-white/[0.1] disabled:opacity-50 transition-colors"
      >
        {isExporting ? 'Exporting…' : 'Export PNG'}
      </button>
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  )
}
