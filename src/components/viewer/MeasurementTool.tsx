import * as THREE from 'three'
import { ThreeEvent } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import { useMeasurementStore } from '../../store/measurementStore'
import { useViewerStore } from '../../store/viewerStore'

function formatDistance(dist: number, unitMode: 'model' | 'mm', mmPerUnit: number): string {
  if (unitMode === 'mm') {
    return `${(dist * mmPerUnit).toFixed(2)} mm`
  }
  return `${dist.toFixed(3)} units`
}

export function MeasurementTool() {
  const model = useViewerStore((s) => s.currentModel)
  const { enabled, draftPoint, items, unitMode, mmPerUnit, pickPoint } = useMeasurementStore()

  if (!enabled || !model) return null

  const box = new THREE.Box3().setFromObject(model.object)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation()
    pickPoint([e.point.x, e.point.y, e.point.z])
  }

  return (
    <group>
      {/* Invisible bounding box mesh for click detection */}
      <mesh
        position={[center.x, center.y, center.z]}
        onPointerDown={handlePointerDown}
      >
        <boxGeometry args={[size.x, size.y, size.z]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Draft point indicator */}
      {draftPoint && (
        <mesh position={draftPoint}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color="#ffcc00" />
        </mesh>
      )}

      {/* Completed measurements */}
      {items.map((m) => {
        const mid: [number, number, number] = [
          (m.a[0] + m.b[0]) / 2,
          (m.a[1] + m.b[1]) / 2,
          (m.a[2] + m.b[2]) / 2,
        ]
        const dist = formatDistance(m.distanceModel, unitMode, mmPerUnit)
        return (
          <group key={m.id}>
            <Line points={[m.a, m.b]} color="#ffcc00" lineWidth={2} />
            <mesh position={m.a}>
              <sphereGeometry args={[0.015, 6, 6]} />
              <meshBasicMaterial color="#ffcc00" />
            </mesh>
            <mesh position={m.b}>
              <sphereGeometry args={[0.015, 6, 6]} />
              <meshBasicMaterial color="#ffcc00" />
            </mesh>
            <Html position={mid} center distanceFactor={3}>
              <div className="bg-mm-green-dark/90 text-mm-gold text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none font-mono">
                {dist}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}
