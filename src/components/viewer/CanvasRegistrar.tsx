import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useScreenshotStore } from '../../store/screenshotStore'

export function CanvasRegistrar() {
  const { gl } = useThree()
  const registerCanvas = useScreenshotStore(s => s.registerCanvas)

  useEffect(() => {
    registerCanvas(gl.domElement)
  }, [gl, registerCanvas])

  return null
}
