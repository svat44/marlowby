import {
  Color, InstancedMesh, MathUtils, Matrix4, Euler, Quaternion, Vector3,
  type BufferGeometry, type Material,
} from 'three'

export type V3 = [number, number, number]

/** 0 to 1 across [a, b], eased in and out. */
export const seg = (p: number, a: number, b: number) => MathUtils.smoothstep(p, a, b)
export const v = (x: number, y: number, z: number) => new Vector3(x, y, z)

/** Small seeded random generator, so every visit builds the same world. */
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Inst = { p: V3; s?: V3; r?: V3; c?: string | Color }

/** Many copies of one shape in a single draw call. */
export function instanced(
  geometry: BufferGeometry,
  material: Material,
  list: Inst[],
  shadows: { cast?: boolean; receive?: boolean } = {},
) {
  const mesh = new InstancedMesh(geometry, material, list.length)
  const m = new Matrix4()
  const q = new Quaternion()
  const e = new Euler()
  const color = new Color()
  list.forEach((it, i) => {
    q.setFromEuler(e.set(...(it.r ?? [0, 0, 0])))
    m.compose(new Vector3(...it.p), q, new Vector3(...(it.s ?? [1, 1, 1])))
    mesh.setMatrixAt(i, m)
    if (it.c !== undefined) mesh.setColorAt(i, color.set(it.c))
  })
  mesh.castShadow = !!shadows.cast
  mesh.receiveShadow = !!shadows.receive
  mesh.computeBoundingSphere()
  return mesh
}
