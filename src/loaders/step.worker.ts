// eslint-disable-next-line @typescript-eslint/no-explicit-any
const workerSelf = self as any

type TessellationPreset = 'preview' | 'balanced' | 'high'

interface WorkerRequest {
  buffer: ArrayBuffer
  preset: TessellationPreset
}

interface ShapeData {
  positions: Float32Array
  normals: Float32Array
  indices: Uint32Array
  name: string
}

interface WorkerResponse {
  type: 'progress' | 'success' | 'error'
  message?: string
  shapes?: ShapeData[]
  error?: string
}

const presets: Record<TessellationPreset, { linear: number; angular: number }> = {
  preview:  { linear: 1.0, angular: 0.5 },
  balanced: { linear: 0.2, angular: 0.2 },
  high:     { linear: 0.05, angular: 0.1 },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let oc: any = null

// Safe delete helper — some OC objects may not have .delete()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function del(obj: any) {
  try { obj?.delete?.() } catch { /* already freed or not an embind object */ }
}

async function initOC() {
  // Import the emscripten JS module directly (CJS-style factory)
  // and the WASM binary as a URL so Vite copies it as an asset
  const wasmUrl = new URL(
    'opencascade.js/dist/opencascade.wasm.wasm',
    import.meta.url
  ).href

  // Dynamically import the emscripten glue JS as a module
  // It exports a default factory function
  const { default: opencascadeFactory } = await import('opencascade.js/dist/opencascade.wasm.js')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (opencascadeFactory as any)({
    locateFile(path: string) {
      if (path.endsWith('.wasm')) {
        return wasmUrl
      }
      return path
    },
  })
}

function mapErrorMessage(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  if (msg.includes('__cxa_can_catch') || msg.includes('__cxa_') || msg.includes('OOM') || msg.includes('memory')) {
    return 'Model too large or complex for the CAD engine. Try a simpler file or reduce tessellation quality.'
  }
  return msg
}

workerSelf.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { buffer, preset } = e.data
  const fileName = 'model.step'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let reader: any = null

  try {
    if (!oc) {
      workerSelf.postMessage({ type: 'progress', message: 'Initializing CAD engine…' } satisfies WorkerResponse)
      oc = await initOC()
    }

    workerSelf.postMessage({ type: 'progress', message: 'Parsing STEP file…' } satisfies WorkerResponse)

    oc.FS.createDataFile('/', fileName, new Uint8Array(buffer), true, true, true)

    reader = new oc.STEPControl_Reader_1()
    const status = reader.ReadFile(fileName)
    if (status !== oc.IFSelect_ReturnStatus.IFSelect_RetDone) {
      throw new Error('Failed to read STEP file')
    }
    // Transfer all roots — opencascade.js v1.x may not have Message_ProgressRange
    const numRoots = reader.NbRootsForTransfer()
    for (let r = 1; r <= numRoots; r++) {
      reader.TransferRoot(r)
    }

    const shapes: ShapeData[] = []
    const { linear, angular } = presets[preset]

    const numShapes = reader.NbShapes()
    for (let i = 1; i <= numShapes; i++) {
      const shape = reader.Shape(i)
      const mesher = new oc.BRepMesh_IncrementalMesh_2(shape, linear, false, angular, true)

      const positions: number[] = []
      const normals: number[] = []
      const indices: number[] = []
      let indexOffset = 0

      const expFace = new oc.TopExp_Explorer_2(
        shape,
        oc.TopAbs_ShapeEnum.TopAbs_FACE,
        oc.TopAbs_ShapeEnum.TopAbs_SHAPE
      )

      for (; expFace.More(); expFace.Next()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let face: any = null, location: any = null, triangulation: any = null, tri: any = null, trsf: any = null
        try {
          face = oc.TopoDS.Face_1(expFace.Current())
          location = new oc.TopLoc_Location_1()
          triangulation = oc.BRep_Tool.Triangulation(face, location)

          if (triangulation.IsNull()) continue

          tri = triangulation.get()
          const numNodes = tri.NbNodes()
          const numTris = tri.NbTriangles()
          trsf = location.IsIdentity() ? null : location.Transformation()

          for (let n = 1; n <= numNodes; n++) {
            const pnt = tri.Node(n)
            try {
              if (trsf) pnt.Transform(trsf)
              positions.push(pnt.X(), pnt.Y(), pnt.Z())
              normals.push(0, 1, 0)
            } finally {
              del(pnt)
            }
          }

          const reversed = face.Orientation_1() === oc.TopAbs_Orientation.TopAbs_REVERSED

          for (let t = 1; t <= numTris; t++) {
            const triangle = tri.Triangle(t)
            try {
              const n1 = triangle.Value(1)
              const n2 = triangle.Value(2)
              const n3 = triangle.Value(3)
              const base = indexOffset
              if (reversed) {
                indices.push(base + n1 - 1, base + n3 - 1, base + n2 - 1)
              } else {
                indices.push(base + n1 - 1, base + n2 - 1, base + n3 - 1)
              }
            } finally {
              del(triangle)
            }
          }

          indexOffset += numNodes
        } finally {
          del(trsf)
          del(tri)
          del(triangulation)
          del(location)
          del(face)
        }
      }

      del(expFace)
      del(mesher)

      if (positions.length > 0) {
        shapes.push({
          positions: new Float32Array(positions),
          normals: new Float32Array(normals),
          indices: new Uint32Array(indices),
          name: `Shape_${i}`,
        })
      }

      del(shape)
    }

    del(reader)
    reader = null

    if (shapes.length === 0) {
      throw new Error('No geometry extracted from STEP file')
    }

    const transfer: Transferable[] = shapes.flatMap(s => [s.positions.buffer, s.normals.buffer, s.indices.buffer])
    workerSelf.postMessage({ type: 'success', shapes } satisfies WorkerResponse, transfer)

  } catch (err) {
    del(reader)
    reader = null

    workerSelf.postMessage({
      type: 'error',
      error: mapErrorMessage(err),
    } satisfies WorkerResponse)
  } finally {
    try { oc?.FS?.unlink?.('/' + fileName) } catch { /* already removed or never created */ }
  }
}
