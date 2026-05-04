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

const POINT_LABEL_STYLE: React.CSSProperties = {
  pointerEvents: 'none',
  userSelect: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  transform: 'translateY(-36px)',
}

const BADGE_STYLE = (_letter: string): React.CSSProperties => ({
  width: 28,
  height: 28,
  borderRadius: '50%',
  background: '#c9a16f',
  color: '#1a2419',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 13,
  fontWeight: 700,
  fontFamily: 'monospace',
  boxShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 0 2px #2f3e31',
  letterSpacing: 0,
})

const DISTANCE_LABEL_STYLE: React.CSSProperties = {
  pointerEvents: 'none',
  userSelect: 'none',
  background: '#2f3e31',
  border: '1.5px solid #c9a16f',
  color: '#c9a16f',
  padding: '5px 14px',
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 700,
  fontFamily: 'monospace',
  whiteSpace: 'nowrap',
  boxShadow: '0 3px 12px rgba(0,0,0,0.95)',
  letterSpacing: '0.05em',
  transform: 'translateY(-16px)',
}

export function MeasurementTool() {
  const model = useViewerStore((s) => s.currentModel)
  const { enabled, draftPoint, items, unitMode, mmPerUnit, pickPoint } = useMeasurementStore()

  if (!enabled || !model) return null

  const box = new THREE.Box3().setFromObject(model.object)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  // Marker radius scales with the model — 2.5% of the largest dimension
  const markerRadius = Math.max(size.x, size.y, size.z) * 0.025

  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation()
    pickPoint([e.point.x, e.point.y, e.point.z])
  }

  return (
    <group>
      {/* Invisible hit mesh covering model bounds */}
      <mesh position={[center.x, center.y, center.z]} onPointerDown={handlePointerDown}>
        <boxGeometry args={[size.x, size.y, size.z]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Draft point A — waiting for second click */}
      {draftPoint && (
        <>
          <mesh position={draftPoint} renderOrder={999}>
            <sphereGeometry args={[markerRadius, 16, 16]} />
            <meshBasicMaterial color="#c9a16f" depthTest={false} />
          </mesh>
          <Html position={draftPoint} center>
            <div style={POINT_LABEL_STYLE}>
              <div style={BADGE_STYLE('A')}>A</div>
            </div>
          </Html>
        </>
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
            <Line points={[m.a, m.b]} color="#c9a16f" lineWidth={2.5} />

            {/* Point A */}
            <mesh position={m.a} renderOrder={999}>
              <sphereGeometry args={[markerRadius, 16, 16]} />
              <meshBasicMaterial color="#c9a16f" depthTest={false} />
            </mesh>
            <Html position={m.a} center>
              <div style={POINT_LABEL_STYLE}>
                <div style={BADGE_STYLE('A')}>A</div>
              </div>
            </Html>

            {/* Point B */}
            <mesh position={m.b} renderOrder={999}>
              <sphereGeometry args={[markerRadius, 16, 16]} />
              <meshBasicMaterial color="#c9a16f" depthTest={false} />
            </mesh>
            <Html position={m.b} center>
              <div style={POINT_LABEL_STYLE}>
                <div style={BADGE_STYLE('B')}>B</div>
              </div>
            </Html>

            {/* Distance label */}
            <Html position={mid} center>
              <div style={DISTANCE_LABEL_STYLE}>{dist}</div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}
