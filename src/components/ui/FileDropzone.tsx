import { useRef, useCallback } from 'react'
import { useViewerStore } from '../../store/viewerStore'

export function FileDropzone() {
  const inputRef = useRef<HTMLInputElement>(null)
  const status = useViewerStore((s) => s.status)
  const dragActive = useViewerStore((s) => s.dragActive)
  const error = useViewerStore((s) => s.error)
  const currentModel = useViewerStore((s) => s.currentModel)
  const loadFile = useViewerStore((s) => s.loadFile)
  const setDragActive = useViewerStore((s) => s.setDragActive)
  const clearError = useViewerStore((s) => s.clearError)

  const handleFile = useCallback((file: File) => {
    void loadFile(file)
  }, [loadFile])

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [setDragActive])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [setDragActive])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [setDragActive])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [setDragActive, handleFile])

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }, [handleFile])

  const openPicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  if (status === 'loading') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-mm-green-darker/80 z-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-mm-green border-t-mm-gold rounded-full animate-spin" />
          <p className="text-mm-cream-dim text-sm tracking-wide">
            Loading {currentModel?.fileName ?? ''}...
          </p>
        </div>
      </div>
    )
  }

  if (currentModel && status === 'success') {
    return (
      <>
        <input
          ref={inputRef}
          type="file"
          accept=".stl,.glb,.gltf,.obj,.fbx,.ply,.stp,.step"
          className="hidden"
          onChange={onInputChange}
        />
        <button
          onClick={openPicker}
          className="absolute top-4 left-20 z-10 px-3 py-1.5 text-xs tracking-wide rounded bg-mm-green-dark/80 backdrop-blur-sm text-mm-cream-dim hover:text-mm-cream hover:bg-mm-green/80 transition-colors"
        >
          Load new file
        </button>
      </>
    )
  }

  return (
    <div
      className={[
        'absolute inset-0 z-10 flex items-center justify-center',
        dragActive ? 'bg-mm-green-darker/90' : 'bg-mm-green-darker/75',
      ].join(' ')}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={openPicker}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".stl,.glb,.gltf,.obj,.fbx,.ply,.stp,.step"
        className="hidden"
        onChange={onInputChange}
      />

      <div
        className={[
          'flex flex-col items-center gap-6 p-12 rounded-xl border-2 border-dashed transition-all cursor-pointer select-none',
          dragActive
            ? 'border-mm-gold/60 bg-mm-gold/5'
            : 'border-mm-green/40 bg-mm-green-dark/20 hover:border-mm-green/70',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center gap-2">
          <svg
            className="w-12 h-12 text-mm-green-muted"
            fill="none"
            viewBox="0 0 48 48"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M24 8v24m0-24l-8 8m8-8l8 8M8 36h32"
            />
          </svg>
          <p className="text-mm-cream font-serif text-lg tracking-wide">
            Drop a 3D file or click to browse
          </p>
          <p className="text-mm-green-muted text-xs tracking-widest uppercase">
            STL · GLB · GLTF · OBJ · FBX · PLY · STP
          </p>
        </div>

        {error && (
          <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg bg-red-900/20 border border-red-500/30">
            <p className="text-red-400 text-sm font-medium">{error.message}</p>
            <button
              className="text-mm-green-muted text-xs hover:text-mm-cream transition-colors mt-1"
              onClick={(e) => {
                e.stopPropagation()
                clearError()
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        <button
          className="px-6 py-2 rounded-lg bg-mm-gold/10 hover:bg-mm-gold/20 text-mm-gold text-sm tracking-wide transition-colors border border-mm-gold/30"
          onClick={(e) => {
            e.stopPropagation()
            openPicker()
          }}
        >
          Browse files
        </button>
      </div>
    </div>
  )
}
