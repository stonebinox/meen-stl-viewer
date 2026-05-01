import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

interface ViewerCanvasProps {
  children?: React.ReactNode
}

export function ViewerCanvas({ children }: ViewerCanvasProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 45, near: 0.01, far: 5000, position: [3, 3, 3] }}
      gl={{ preserveDrawingBuffer: true, alpha: false }}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  )
}
