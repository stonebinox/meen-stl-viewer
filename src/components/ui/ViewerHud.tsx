import { useState } from 'react'
import Emblem from '../../assets/emblem-dark.png'
import { useViewerStore, type EnvironmentPreset } from '../../store/viewerStore'
import { RenderModeToolbar } from './RenderModeToolbar'
import { ViewPresetButtons } from './ViewPresetButtons'
import { ClippingPanel } from './ClippingPanel'
import { MeasurementToolbar } from './MeasurementToolbar'
import { ScreenshotButton } from './ScreenshotButton'
import { RecentFilesPanel } from './RecentFilesPanel'

// Left sidebar: 256px, Right sidebar: 280px
const LEFT_OFFSET = 256
const RIGHT_OFFSET = 280
const PAD = 16

const ENVIRONMENT_OPTIONS: { label: string; value: EnvironmentPreset }[] = [
  { label: 'Studio', value: 'studio' },
  { label: 'Outdoor', value: 'sunset' },
  { label: 'Warehouse', value: 'warehouse' },
]

export function ViewerHud() {
  const [showRecent, setShowRecent] = useState(false)
  const environmentPreset = useViewerStore((s) => s.environmentPreset)
  const setEnvironmentPreset = useViewerStore((s) => s.setEnvironmentPreset)
  const fitToView = useViewerStore((s) => s.fitToView)
  const resetCamera = useViewerStore((s) => s.resetCamera)

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top-left: logo + recent files (shifted right of SceneTreePanel) */}
      <div
        className="absolute top-4 pointer-events-auto flex items-center gap-3"
        style={{ left: LEFT_OFFSET + PAD }}
      >
        <img src={Emblem} alt="Meen Motors" className="h-8" />
        <div className="relative">
          <button
            onClick={() => setShowRecent((r) => !r)}
            className="px-2 py-1 text-xs rounded bg-black/60 backdrop-blur-sm text-white/60 hover:text-white hover:bg-black/80 transition-colors"
          >
            Recent
          </button>
          {showRecent && (
            <div className="absolute top-8 left-0 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-72 max-h-80 overflow-y-auto z-50">
              <div className="px-3 py-2 border-b border-gray-700 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Files</span>
                <button
                  onClick={() => setShowRecent(false)}
                  className="text-gray-500 hover:text-gray-300 text-xs"
                >
                  ✕
                </button>
              </div>
              <RecentFilesPanel />
            </div>
          )}
        </div>
      </div>

      {/* Top-right: environment + camera controls (shifted left of ModelInfoPanel) */}
      <div
        className="absolute top-4 pointer-events-auto flex flex-col gap-2 items-end"
        style={{ right: RIGHT_OFFSET + PAD }}
      >
        <div className="flex rounded overflow-hidden bg-black/60 backdrop-blur-sm">
          {ENVIRONMENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setEnvironmentPreset(opt.value)}
              className={[
                'px-3 py-1.5 text-xs font-medium tracking-wide transition-colors',
                environmentPreset === opt.value
                  ? 'bg-white/20 text-white'
                  : 'text-white/50 hover:text-white/80',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            onClick={fitToView}
            className="px-3 py-1.5 text-xs font-medium tracking-wide rounded bg-black/60 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/80 transition-colors"
          >
            Fit to View
          </button>
          <button
            onClick={resetCamera}
            className="px-3 py-1.5 text-xs font-medium tracking-wide rounded bg-black/60 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/80 transition-colors"
          >
            Reset Camera
          </button>
        </div>
      </div>

      {/* Bottom toolbar: between the two sidebars */}
      <div
        className="absolute bottom-4 pointer-events-auto flex items-end justify-between gap-4"
        style={{ left: LEFT_OFFSET + PAD, right: RIGHT_OFFSET + PAD }}
      >
        {/* Left: shading modes + view presets */}
        <div className="flex flex-col gap-1.5 items-start">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1.5">
            <RenderModeToolbar />
          </div>
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1.5">
            <ViewPresetButtons />
          </div>
        </div>

        {/* Right: section + measure + export */}
        <div className="flex gap-2 items-end">
          <MeasurementToolbar />
          <ClippingPanel />
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 flex flex-col gap-2 min-w-[160px]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Export</span>
            <ScreenshotButton />
          </div>
        </div>
      </div>
    </div>
  )
}
