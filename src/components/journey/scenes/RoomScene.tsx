import { useEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import {
  AdditiveBlending, BoxGeometry, BufferGeometry, CylinderGeometry, Float32BufferAttribute, LatheGeometry, MathUtils, MeshStandardMaterial,
  PlaneGeometry, Vector2, type Group,
} from 'three'
import { CITIES } from '../data'
import { grain, outdoorView, plaster, poster, puff, rug, softShadow, tiled, wood } from '../lib/textures'
import { instanced, rng, type Inst } from '../lib/util'
import { foliage } from '../parts/foliage'
import { Parcel } from '../parts/Parcel'
import { Solid } from '../parts/Solid'

export const BOX_X = [-1.62, 0, 1.62]
export const TABLE_TOP = 0.9
const FLOOR = -1

function Curtain({ x }: { x: number }) {
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(0.62, 3.9, 60, 24)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const px = pos.getX(i)
      const py = pos.getY(i)
      const tie = 1 - 0.3 * Math.exp(-((py + 0.35) ** 2) * 3)
      pos.setX(i, px * tie)
      pos.setZ(i, Math.sin(px * 42) * 0.062 + Math.sin(px * 19 + py * 1.4) * 0.02)
    }
    g.computeVertexNormals()
    return g
  }, [])
  return (
    <mesh geometry={geometry} position={[x, 1.2, -2.13]} castShadow receiveShadow>
      <meshStandardMaterial color="#e9d9bc" roughness={0.95} side={2} />
    </mesh>
  )
}

function WindowWall() {
  return (
    <group>
      <mesh position={[-4, 1.7, -2.28]}>
        <planeGeometry args={[1.7, 2.35]} />
        <meshBasicMaterial map={outdoorView()} color="#ffffff" />
      </mesh>
      {[-0.87, 0, 0.87].map((x) => (
        <Solid key={x} size={[x ? 0.12 : 0.05, 2.45, 0.1]} at={[-4 + x, 1.7, -2.24]} radius={0.015} color="#f3ead8" />
      ))}
      {[-1.2, 0, 1.2].map((y) => (
        <Solid key={y} size={[1.86, y ? 0.12 : 0.05, 0.1]} at={[-4, 1.7 + y, -2.235]} radius={0.015} color="#f3ead8" />
      ))}
      <Solid size={[2.05, 0.09, 0.26]} at={[-4, 0.44, -2.18]} radius={0.02} color="#f3ead8" />
      <Curtain x={-5.1} />
      <Curtain x={-2.92} />
      <mesh position={[-4, 3.2, -2.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.028, 0.028, 3, 16]} />
        <meshStandardMaterial color="#b5914f" metalness={1} roughness={0.3} />
      </mesh>
    </group>
  )
}

function FramedPoster({ city, x }: { city: number; x: number }) {
  return (
    <group position={[x, 2.5, -2.26]}>
      <Solid size={[0.98, 1.24, 0.07]} radius={0.014} color="#2a1c12" rough={0.45} />
      <mesh position={[0, 0, 0.038]}>
        <planeGeometry args={[0.88, 1.134]} />
        <meshStandardMaterial map={poster(city)} roughness={0.65} />
      </mesh>
    </group>
  )
}

function Table() {
  const top = useMemo(() => wood('table', [168, 112, 66], 5), [])
  const leg = useMemo(() => new CylinderGeometry(0.09, 0.052, 1.74, 20), [])
  return (
    <group>
      <Solid size={[5.5, 0.13, 1.72]} at={[0, TABLE_TOP - 0.065, 0]} radius={0.045} map={top} rough={0.42} />
      <Solid size={[5.05, 0.17, 0.08]} at={[0, 0.69, 0.66]} radius={0.02} color="#6f4526" rough={0.5} />
      <Solid size={[5.05, 0.17, 0.08]} at={[0, 0.69, -0.66]} radius={0.02} color="#6f4526" rough={0.5} />
      {[-2.5, 2.5].flatMap((x) =>
        [-0.65, 0.65].map((z) => (
          <mesh key={`${x}${z}`} geometry={leg} position={[x, -0.1, z]} rotation={[z > 0 ? -0.06 : 0.06, 0, x > 0 ? 0.07 : -0.07]} castShadow>
            <meshStandardMaterial color="#6f4526" roughness={0.45} />
          </mesh>
        )),
      )}
    </group>
  )
}

function Bookshelf() {
  const books = useMemo(() => {
    const r = rng(72)
    const colors = ['#8c2f24', '#0f4f4b', '#d9a441', '#31456a', '#e8e0cf', '#5b3a2a', '#c9624a']
    const list: Inst[] = []
    for (const y of [-0.55, 0.12, 0.79, 1.46])
      for (let x = 3.5; x < 4.85; ) {
        const w = 0.05 + r() * 0.07
        const h = 0.34 + r() * 0.2
        if (r() > 0.12) list.push({ p: [x + w / 2, y + h / 2 + 0.03, -2.06], s: [w * 0.9, h, 0.28], c: colors[Math.floor(r() * colors.length)] })
        else x += 0.12
        x += w
      }
    return instanced(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ roughness: 0.75 }), list, { cast: true, receive: true })
  }, [])
  const shelf = useMemo(() => wood('shelf', [120, 80, 50], 3), [])
  return (
    <group>
      {[-0.55, 0.12, 0.79, 1.46, 2.13].map((y) => (
        <Solid key={y} size={[1.7, 0.06, 0.42]} at={[4.18, y, -2.07]} radius={0.012} map={shelf} rough={0.55} />
      ))}
      {[3.33, 5.03].map((x) => (
        <Solid key={x} size={[0.07, 3.2, 0.44]} at={[x, 0.6, -2.07]} radius={0.015} map={shelf} rough={0.55} />
      ))}
      <primitive object={books} />
    </group>
  )
}

function FloorPlant() {
  const leaves = useMemo(
    () =>
      foliage(
        [
          { at: [-3.15, 0.35, -1.55], size: [0.42, 0.5, 0.36], cards: 170, card: 0.3 },
          { at: [-3.3, 0.85, -1.62], size: [0.28, 0.36, 0.26], cards: 80, card: 0.26 },
        ],
        73,
      ),
    [],
  )
  return (
    <group>
      <mesh position={[-3.15, -0.7, -1.55]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.24, 0.6, 32]} />
        <meshStandardMaterial color="#d9c3a0" roughness={0.7} />
      </mesh>
      <mesh position={[-3.15, -0.15, -1.55]}>
        <cylinderGeometry args={[0.03, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#4b3a26" roughness={1} />
      </mesh>
      <primitive object={leaves} />
    </group>
  )
}

function FloorLamp() {
  const shade = useMemo(() => new LatheGeometry([[0.42, 0], [0.26, 0.5]].map(([r, y]) => new Vector2(r, y)), 48), [])
  return (
    <group position={[3.05, 0, -1.65]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 3, 12]} />
        <meshStandardMaterial color="#b5914f" metalness={1} roughness={0.28} />
      </mesh>
      <mesh geometry={shade} position={[0, 1.82, 0]}>
        <meshStandardMaterial color="#f6e2bd" emissive="#ffbe6a" emissiveIntensity={0.75} side={2} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <sphereGeometry args={[0.09, 16, 12]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffd08a" emissiveIntensity={5} />
      </mesh>
    </group>
  )
}

/** A mug and a small vase to make the table feel used. */
function TableTop() {
  const vase = useMemo(
    () => new LatheGeometry([[0, 0], [0.1, 0], [0.14, 0.09], [0.12, 0.2], [0.055, 0.29], [0.07, 0.34]].map(([r, y]) => new Vector2(r, y)), 40),
    [],
  )
  const sprigs = useMemo(() => foliage([{ at: [-2.46, 1.42, -0.2], size: [0.17, 0.16, 0.15], cards: 55, card: 0.13 }], 74), [])
  return (
    <group>
      <mesh geometry={vase} position={[-2.46, TABLE_TOP, -0.2]} castShadow>
        <meshPhysicalMaterial color="#e8664e" roughness={0.25} clearcoat={1} side={2} />
      </mesh>
      <primitive object={sprigs} />
      <group position={[2.47, TABLE_TOP, 0.22]}>
        <mesh position={[0, 0.095, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.082, 0.19, 32]} />
          <meshPhysicalMaterial color="#f3e9d7" roughness={0.22} clearcoat={1} />
        </mesh>
        <mesh position={[0.1, 0.1, 0]}>
          <torusGeometry args={[0.05, 0.016, 12, 32]} />
          <meshPhysicalMaterial color="#f3e9d7" roughness={0.22} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0.186, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.08, 32]} />
          <meshStandardMaterial color="#3a2012" roughness={0.15} />
        </mesh>
      </group>
    </group>
  )
}

/** Slow motes of dust catching the window light. */
function Dust() {
  const ref = useRef<Group>(null)
  const geometry = useMemo(() => {
    const r = rng(75)
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(Array.from({ length: 450 }, (_, i) => (r() - 0.5) * [9, 3.4, 4][i % 3]), 3))
    return g
  }, [])
  useFrame(({ clock }) => {
    ref.current!.position.y = 1.5 + Math.sin(clock.elapsedTime * 0.12) * 0.15
    ref.current!.rotation.y = Math.sin(clock.elapsedTime * 0.05) * 0.1
  })
  return (
    <group ref={ref}>
      <points geometry={geometry}>
        <pointsMaterial map={puff(1)} size={0.025} color="#ffe2b0" transparent opacity={0.5} depthWrite={false} blending={AdditiveBlending} />
      </points>
    </group>
  )
}

function Room() {
  const maps = useMemo(
    () => ({ floor: tiled(wood('floor', [138, 94, 62], 8), 6, 4), wall: tiled(plaster(), 8, 4), bumps: tiled(grain(), 10, 6) }),
    [],
  )
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR, 2]} receiveShadow>
        <planeGeometry args={[36, 24]} />
        <meshStandardMaterial map={maps.floor} bumpMap={maps.floor} bumpScale={0.7} roughness={0.46} />
      </mesh>
      <mesh position={[0, 5, -2.34]} receiveShadow>
        <planeGeometry args={[36, 14]} />
        <meshStandardMaterial map={maps.wall} bumpMap={maps.bumps} bumpScale={0.35} color="#1c6661" roughness={0.93} />
      </mesh>
      {/* wainscoting */}
      <Solid size={[36, 1.25, 0.04]} at={[0, -0.37, -2.31]} color="#12504c" rough={0.62} />
      <Solid size={[36, 0.09, 0.12]} at={[0, 0.28, -2.28]} radius={0.025} color="#15605b" rough={0.5} />
      <Solid size={[36, 0.2, 0.1]} at={[0, -0.9, -2.28]} radius={0.02} color="#15605b" rough={0.5} />
      {Array.from({ length: 19 }, (_, i) => -10.8 + i * 1.2).map((x) => (
        <group key={x} position={[x, -0.32, -2.28]}>
          {[0.4, -0.4].map((y) => (
            <Solid key={y} size={[0.94, 0.045, 0.03]} at={[0, y, 0]} radius={0.01} color="#176560" rough={0.5} />
          ))}
          {[0.47, -0.47].map((side) => (
            <Solid key={side} size={[0.045, 0.84, 0.03]} at={[side, 0, 0]} radius={0.01} color="#176560" rough={0.5} />
          ))}
        </group>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR + 0.012, 0.35]} receiveShadow>
        <planeGeometry args={[7.2, 3.9]} />
        <meshStandardMaterial map={rug()} roughness={1} />
      </mesh>
      <WindowWall />
      <FramedPoster city={0} x={-2.05} />
      <FramedPoster city={2} x={2.05} />
      <Table />
      <TableTop />
      <Bookshelf />
      <FloorPlant />
      <FloorLamp />
      <Dust />
    </group>
  )
}

function RoomBox({ i, picked, onPick }: { i: number; picked: number | null; onPick: (i: number) => void }) {
  const group = useRef<Group>(null)
  const open = useRef(0)
  const hover = useRef(false)

  useEffect(() => () => { document.body.style.cursor = '' }, [])

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.05)
    open.current = MathUtils.damp(open.current, picked === i ? 1 : 0, 2.1, step)
    const g = group.current!
    const lifted = hover.current && picked === null
    g.position.y = MathUtils.damp(g.position.y, lifted ? 0.11 : 0, 8, step)
    g.rotation.y = MathUtils.damp(g.rotation.y, picked === i ? 0 : [0.2, 0, -0.2][i] * (lifted ? 0.4 : 1), 5, step)
  })

  const point = (on: boolean) => {
    hover.current = on
    document.body.style.cursor = on ? 'pointer' : ''
  }

  return (
    <group position={[BOX_X[i], TABLE_TOP, 0]}>
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.65, 1.35]} />
        <meshBasicMaterial map={softShadow()} transparent depthWrite={false} />
      </mesh>
      <group
        ref={group}
        scale={3}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onPick(i)
        }}
        onPointerOver={() => point(true)}
        onPointerOut={() => point(false)}
      >
        <Parcel city={i} filled open={() => open.current} />
      </group>
    </group>
  )
}

export function RoomScene({ picked, onPick }: { picked: number | null; onPick: (i: number) => void }) {
  return (
    <group>
      <Room />
      {CITIES.map((_, i) => (
        <RoomBox key={i} i={i} picked={picked} onPick={onPick} />
      ))}
    </group>
  )
}
