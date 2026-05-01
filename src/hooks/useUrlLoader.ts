import { useEffect } from 'react'
import { useViewerStore } from '../store/viewerStore'
import { useRecentFilesStore } from '../store/recentFilesStore'
import { getUrlParam, fetchUrlAsFile } from '../utils/urlLoader'
import { detectFormat } from '../utils/detectFormat'

export function useUrlLoader() {
  const loadFile = useViewerStore(s => s.loadFile)
  const addRecentFile = useRecentFilesStore(s => s.addRecentFile)

  useEffect(() => {
    const url = getUrlParam()
    if (!url) return

    fetchUrlAsFile(url)
      .then(file => {
        const format = detectFormat(file.name)
        if (format) {
          addRecentFile({ name: file.name, size: file.size, format })
        }
        return loadFile(file)
      })
      .catch(err => {
        console.warn('[meen-viewer] URL load failed:', err)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])  // Only on mount
}
