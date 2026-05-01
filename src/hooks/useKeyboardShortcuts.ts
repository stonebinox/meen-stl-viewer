import { useEffect } from 'react'
import { useCameraStore } from '../store/cameraStore'
import { useViewerStore } from '../store/viewerStore'
import { useRenderModeStore } from '../store/renderModeStore'

function isEditableTarget(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
    target.isContentEditable
}

export function useKeyboardShortcuts() {
  const applyPreset = useCameraStore(s => s.applyPreset)
  const fitToView = useViewerStore(s => s.fitToView)
  const resetCamera = useViewerStore(s => s.resetCamera)
  const { mode, setMode } = useRenderModeStore()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat || isEditableTarget(e)) return

      switch (e.code) {
        case 'Numpad1': case 'Digit1': applyPreset('front'); break
        case 'Numpad3': case 'Digit3': applyPreset('right'); break
        case 'Numpad7': case 'Digit7': applyPreset('top'); break
        case 'Numpad0': case 'Digit0': applyPreset('iso'); break
        case 'KeyF': fitToView(); break
        case 'KeyR': resetCamera(); break
        case 'KeyW':
          setMode(mode === 'wireframe' ? 'solid' : 'wireframe')
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [applyPreset, fitToView, resetCamera, mode, setMode])
}
