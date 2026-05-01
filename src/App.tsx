import { ViewerCanvas } from './components/viewer/ViewerCanvas'
import { SceneRig } from './components/viewer/SceneRig'
import { SceneModel } from './components/viewer/SceneModel'
import { RenderModeEffect } from './components/viewer/RenderModeEffect'
import { ClippingEffect } from './components/viewer/ClippingEffect'
import { CameraPresetEffect } from './components/viewer/CameraPresetEffect'
import { MaterialOverrideEffect } from './components/viewer/MaterialOverrideEffect'
import { MeasurementTool } from './components/viewer/MeasurementTool'
import { CanvasRegistrar } from './components/viewer/CanvasRegistrar'
import { ViewerHud } from './components/ui/ViewerHud'
import { FileDropzone } from './components/ui/FileDropzone'
import { SceneTreePanel } from './components/ui/SceneTreePanel'
import { ModelInfoPanel } from './components/ui/ModelInfoPanel'
import { ColorOverridePicker } from './components/ui/ColorOverridePicker'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { useUrlLoader } from './hooks/useUrlLoader'

function App() {
  useKeyboardShortcuts()
  useUrlLoader()

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a', position: 'relative' }}>
      <ViewerCanvas>
        <SceneRig />
        <SceneModel />
        <RenderModeEffect />
        <ClippingEffect />
        <CameraPresetEffect />
        <MaterialOverrideEffect />
        <MeasurementTool />
        <CanvasRegistrar />
      </ViewerCanvas>
      <SceneTreePanel />
      <ModelInfoPanel />
      <ViewerHud />
      <FileDropzone />
      <ColorOverridePicker />
    </div>
  )
}

export default App
