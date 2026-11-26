import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { MotionValue } from 'motion/react'
import {
  BoxGeometry, BufferGeometry, CylinderGeometry, DoubleSide, Float32BufferAttribute, MeshStandardMaterial, type Group,
} from 'three'
import { T } from '../data'
import { asphalt, concrete, grain, lawn, softShadow, tiled } from '../lib/textures'
import { instanced, rng, seg, type Inst, type V3 } from '../lib/util'
import { foliage, type Clump } from '../parts/foliage'
import { HeroHouse, NeighborHouse } from '../parts/House'
import { Parcel } from '../parts/Parcel'
import { Solid } from '../parts/Solid'
import { Truck } from '../parts/Truck'
import { streetBox, truckX } from '../path'

const TREES: [number, number, number][] = [
  [-33, -3, 1.1], [-27, -6, 1.25], [-24, -2.7, 0.95], [-16.4, -3.4, 1.05], [-9.5, -3.1, 1], [-4.5, -4.8, 1.2], [4.4, -3.2, 0.92],
  [10.6, -3.6, 1.15], [17.5, -2.9, 1], [25, -4.5, 1.2], [-38, -8, 1.5], [-19, -10, 1.6], [-8, -10.5, 1.7], [1, -11, 1.5],
  [9, -10, 1.7], [20, -9.5, 1.5], [32, -8, 1.4], [-30, 8.5, 1.2], [-17, 9.5, 1.35], [-3, 10, 1.2], [8, 8.5, 1.3], [19, 9, 1.2],
]

/** Individual blades on the lawns nearest the camera. */
function Grass() {
  const blades = useMemo(() => {
    const r = rng(33)
    const blade = new BufferGeometry()
    blade.setAttribute('position', new Float32BufferAttribute([-0.012, 0, 0, 0.012, 0, 0, 0.004, 0.11, 0.012], 3))
    blade.setAttribute('normal', new Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 0], 3))
    const tints = ['#6f9a3c', '#82ad48', '#567f2e', '#9ab455']
    const list: Inst[] = []
    while (list.length < 26000) {
      const x = -13 + r() * 25
      const z = r() > 0.2 ? -7.5 + r() * 6.1 : 2.55 + r() * 2.6
      const onHouse = Math.abs(x) < 2.75 && z < -2.1
      const onPath = Math.abs(x) < 0.8 && z > -2.5 && z < -1.3
      if (onHouse || onPath) continue
      const s = 0.65 + r() * 0.8
      list.push({ p: [x, 0, z], s: [s, s, s], r: [(r() - 0.5) * 0.5, r() * Math.PI, (r() - 0.5) * 0.5], c: tints[Math.floor(r() * 4)] })
    }
    return instanced(blade, new MeshStandardMaterial({ side: DoubleSide, roughness: 0.9 }), list, { receive: true })
  }, [])
  return <primitive object={blades} />
}

function Planting() {
  const meshes = useMemo(() => {
    const r = rng(45)
    const crowns: Clump[] = []
    const trunks: Inst[] = []
    const limbs: Inst[] = []
    for (const [x, z, k] of TREES) {
      trunks.push({ p: [x, 0.75 * k, z], s: [k, k, k] })
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + r()
        limbs.push({ p: [x + Math.cos(a) * 0.22 * k, 1.55 * k, z + Math.sin(a) * 0.22 * k], s: [0.42 * k, 0.6 * k, 0.42 * k], r: [Math.sin(a) * 0.65, 0, -Math.cos(a) * 0.65] })
      }
      crowns.push({ at: [x, 2.35 * k, z], size: [0.9 * k, 0.72 * k, 0.9 * k], cards: 190, card: 0.4 * k })
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + r()
        crowns.push({ at: [x + Math.cos(a) * 0.62 * k, (1.95 + r() * 0.55) * k, z + Math.sin(a) * 0.55 * k], size: [0.52 * k, 0.4 * k, 0.5 * k], cards: 62, card: 0.34 * k })
      }
    }
    const bushes: Clump[] = []
    for (const x of [-2.35, -1.92, 1.92, 2.35, -6.9 - 1.2, -6.9 + 1.2, 6.9 - 1.2, 6.9 + 1.2, -14.5, -12.3])
      bushes.push({ at: [x, 0.27, Math.abs(x) < 3 ? -2.42 : -4.95], size: [0.34, 0.27, 0.3], cards: 90, card: 0.2 })
    const bark = new MeshStandardMaterial({ color: '#5d4333', roughness: 1, bumpMap: tiled(grain(), 1, 3), bumpScale: 2 })
    const trunk = new CylinderGeometry(0.1, 0.17, 1.5, 12)
    return [
      instanced(trunk, bark, trunks, { cast: true }),
      instanced(new CylinderGeometry(0.06, 0.13, 1.5, 8), bark, limbs, { cast: true }),
      foliage(crowns, 91),
      foliage(bushes, 92),
    ]
  }, [])
  return (
    <>
      {meshes.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
    </>
  )
}

/** Picket fences along the neighbours' front yards. */
function Fences() {
  const mesh = useMemo(() => {
    const list: Inst[] = []
    for (const [from, to] of [[-30, -17.5], [-15, -3.7], [3.7, 22]])
      for (let x = from; x < to; x += 0.19) list.push({ p: [x, 0.27, -1.52] })
    for (const [from, to] of [[-30, -17.5], [-15, -3.7], [3.7, 22]])
      for (const y of [0.17, 0.39]) list.push({ p: [(from + to) / 2, y, -1.545], s: [(to - from) / 0.07, 0.09, 0.7] })
    return instanced(new BoxGeometry(0.07, 0.52, 0.03), new MeshStandardMaterial({ color: '#f4ecdc', roughness: 0.75 }), list, { cast: true, receive: true })
  }, [])
  return <primitive object={mesh} />
}

function StreetLamp({ at }: { at: V3 }) {
  return (
    <group position={at}>
      <mesh position={[0, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.05, 2.5, 12]} />
        <meshStandardMaterial color="#222a2c" metalness={0.7} roughness={0.45} />
      </mesh>
      <mesh position={[0, 2.58, 0]}>
        <sphereGeometry args={[0.13, 20, 14]} />
        <meshStandardMaterial color="#fff0c8" emissive="#ffc66b" emissiveIntensity={1.8} />
      </mesh>
      <Solid size={[0.3, 0.07, 0.3]} at={[0, 2.73, 0]} radius={0.03} color="#222a2c" metal={0.7} rough={0.45} />
    </group>
  )
}

function Mailbox() {
  return (
    <group position={[1.05, 0, -1.5]}>
      <Solid size={[0.07, 0.62, 0.07]} at={[0, 0.31, 0]} color="#5d4333" />
      <Solid size={[0.2, 0.17, 0.34]} at={[0, 0.7, 0]} radius={0.075} color="#0f4f4b" rough={0.35} metal={0.5} />
      <Solid size={[0.012, 0.15, 0.03]} at={[0.108, 0.79, 0.02]} color="#e8664e" />
      <Solid size={[0.012, 0.05, 0.1]} at={[0.108, 0.85, -0.02]} color="#e8664e" />
    </group>
  )
}

function Ground() {
  const maps = useMemo(
    () => ({ grass: tiled(lawn(), 42, 20), road: tiled(asphalt(), 46, 1.4), walk: tiled(concrete(), 150, 1), path: tiled(concrete(), 1, 1.6) }),
    [],
  )
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.006, 0]} receiveShadow>
        <planeGeometry args={[190, 90]} />
        <meshStandardMaterial map={maps.grass} bumpMap={maps.grass} bumpScale={1.5} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 1]} receiveShadow>
        <planeGeometry args={[190, 2.9]} />
        <meshStandardMaterial map={maps.road} bumpMap={maps.road} bumpScale={1.2} roughness={0.82} />
      </mesh>
      {[0.96, 1.04].map((z) => (
        <Solid key={z} size={[190, 0.004, 0.035]} at={[0, 0.011, z]} color="#d99a1e" rough={0.6} />
      ))}
      {[-0.34, 2.34].map((z) => (
        <Solid key={z} size={[190, 0.004, 0.045]} at={[0, 0.011, z]} color="#e8e4d8" rough={0.6} />
      ))}
      {[-0.53, 2.53].map((z) => (
        <Solid key={z} size={[190, 0.08, 0.16]} at={[0, 0.034, z]} radius={0.03} color="#c9c2b4" rough={0.85} />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -1.04]} receiveShadow>
        <planeGeometry args={[190, 0.82]} />
        <meshStandardMaterial map={maps.walk} roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.016, -1.9]} receiveShadow>
        <planeGeometry args={[0.95, 1]} />
        <meshStandardMaterial map={maps.path} roughness={0.92} />
      </mesh>
    </group>
  )
}

/** Soft rolling hills on the horizon. */
function Hills() {
  return (
    <>
      {[[-55, -52, 30, 7, '#6f8f6a'], [-8, -64, 38, 9.5, '#7f9c82'], [44, -54, 32, 8, '#6f8f6a'], [20, -80, 55, 15, '#93a99b'], [-45, 58, 36, 7, '#6f8f6a'], [35, 60, 40, 8, '#7f9c82']].map(
        ([x, z, wide, high, color], i) => (
          <mesh key={i} position={[x as number, -0.5, z as number]} scale={[wide as number, high as number, 12]}>
            <sphereGeometry args={[1, 48, 24]} />
            <meshStandardMaterial color={color as string} roughness={1} />
          </mesh>
        ),
      )}
    </>
  )
}

export function StreetScene({ progress }: { progress: MotionValue<number> }) {
  const truck = useRef<Group>(null)
  const parcel = useRef<Group>(null)
  const blob = useRef<Group>(null)
  const door = useRef<Group>(null)

  useFrame(({ clock }) => {
    const p = progress.get()
    const x = truckX(p)
    const rolling = p > T.planeEnd && p < T.driveEnd - 0.012 ? 1 : 0
    truck.current!.position.set(x, Math.abs(Math.sin(clock.elapsedTime * 17)) * 0.008 * rolling, 1)
    const { at, fling } = streetBox(p)
    const b = parcel.current!
    b.position.copy(at)
    b.rotation.set(fling * Math.PI * 2, -0.35 * (1 - fling) + fling * Math.PI * 2, 0)
    blob.current!.visible = fling > 0.96
    door.current!.rotation.y = 1.75 * seg(p, T.flingEnd, T.flingEnd + 0.045)
  })

  return (
    <group>
      <Ground />
      <Grass />
      <Planting />
      <Fences />
      <Hills />
      <group position={[0, 0, -4]}>
        <HeroHouse door={door} />
      </group>
      <NeighborHouse at={[-27.5, 0, -4.6]} wall="#d9b28c" roof="#4d5a63" door="#8c2f24" />
      <NeighborHouse at={[-20.4, 0, -5.1]} wall="#e8dcc2" roof="#7a463a" door="#1f4e6b" />
      <NeighborHouse at={[-12.8, 0, -5.2]} wall="#b9877a" roof="#3f4a4f" door="#f0e2c4" />
      <NeighborHouse at={[-6.9, 0, -5.6]} wall="#d8c48a" roof="#5c4a45" door="#0f4f4b" />
      <NeighborHouse at={[6.9, 0, -5.4]} wall="#8fa6bd" roof="#4a3f45" door="#c9462f" />
      <NeighborHouse at={[13.9, 0, -4.9]} wall="#e6cfae" roof="#556259" door="#33415c" />
      <NeighborHouse at={[21, 0, -5.3]} wall="#c7bfd0" roof="#6b4238" door="#0f4f4b" />
      <StreetLamp at={[-21.5, 0, -0.75]} />
      <StreetLamp at={[-11, 0, -0.75]} />
      <StreetLamp at={[-3.3, 0, -0.75]} />
      <StreetLamp at={[8.5, 0, -0.75]} />
      <Mailbox />
      <group ref={truck}>
        <Truck />
      </group>
      <group ref={parcel}>
        <group ref={blob} position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <planeGeometry args={[1.2, 0.9]} />
            <meshBasicMaterial map={softShadow()} transparent depthWrite={false} />
          </mesh>
        </group>
        <group scale={2.2}>
          <Parcel />
        </group>
      </group>
    </group>
  )
}
