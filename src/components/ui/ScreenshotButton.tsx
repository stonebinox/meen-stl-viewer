import { useScreenshotStore } from '../../store/screenshotStore'

export function ScreenshotButton() {
  const { bgMode, setBgMode, exportPng, isExporting, error } = useScreenshotStore()

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <button
          onClick={() => setBgMode('transparent')}
          className={`flex-1 py-1 text-xs rounded transition-colors ${bgMode === 'transparent' ? 'bg-mm-gold text-mm-green-dark font-medium' : 'bg-mm-green text-mm-cream-dim'}`}
        >
          Transparent
        </button>
        <button
          onClick={() => setBgMode('white')}
          className={`flex-1 py-1 text-xs rounded transition-colors ${bgMode === 'white' ? 'bg-mm-gold text-mm-green-dark font-medium' : 'bg-mm-green text-mm-cream-dim'}`}
        >
          White BG
        </button>
      </div>
      <button
        onClick={exportPng}
        disabled={isExporting}
        className="py-1.5 text-xs rounded bg-mm-green text-mm-cream hover:bg-mm-green-light disabled:opacity-50 transition-colors"
      >
        {isExporting ? 'Exporting…' : 'Export PNG'}
      </button>
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  )
}
