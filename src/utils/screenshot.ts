// Must be called from within a useEffect or event handler AFTER the frame renders
export async function exportCanvasPng(
  canvas: HTMLCanvasElement,
  background: 'transparent' | 'white' = 'transparent'
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (background === 'white') {
      // Composite onto white canvas
      const offscreen = document.createElement('canvas')
      offscreen.width = canvas.width
      offscreen.height = canvas.height
      const ctx = offscreen.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, offscreen.width, offscreen.height)
      ctx.drawImage(canvas, 0, 0)
      offscreen.toBlob((blob) => {
        if (!blob) return reject(new Error('Failed to capture canvas'))
        downloadBlob(blob)
        resolve()
      }, 'image/png')
    } else {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Failed to capture canvas'))
        downloadBlob(blob)
        resolve()
      }, 'image/png')
    }
  })
}

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  a.download = `meen-viewer-${ts}.png`
  a.href = url
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
