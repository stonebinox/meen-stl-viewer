import { forwardRef } from 'react'
import * as THREE from 'three'

export type ModelRootRef = THREE.Group

interface ModelRootProps {
  children?: React.ReactNode
}

export const ModelRoot = forwardRef<ModelRootRef, ModelRootProps>(function ModelRoot(
  { children },
  ref
) {
  return <group ref={ref}>{children}</group>
})
