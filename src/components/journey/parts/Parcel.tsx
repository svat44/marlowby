import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { BoxGeometry, DoubleSide, MeshStandardMaterial, PlaneGeometry, type Group } from 'three'
import { CITIES } from '../data'
import { grain, kraft, lidInside, lidPrint, shippingLabel, softShadow } from '../lib/textures'
import { instanced, rng, seg, type Inst, type V3 } from '../lib/util'
import { cityGoods } from './Goods'
import { Solid } from './Solid'

const W = 0.36
const H = 0.17
const D = 0.26
const T = 0.008

/** Where each good rests, and where it floats to once the box is open. */
const SLOTS: { rest: V3; open: V3; turn: number }[] = [
  { rest: [-0.105, 0.016, -0.05], open: [-0.262, 0.088, 0.04], turn: 0.34 },
  { rest: [0.002, 0.016, -0.062], open: [-0.215, 0.255, -0.06], turn: 0.24 },
  { rest: [0.108, 0.016, -0.048], open: [0.215, 0.255, -0.06], turn: -0.24 },
  { rest: [0.0, 0.016, 0.056], open: [0.262, 0.088, 0.04], turn: -0.34 },
]

/** Crumpled tissue and springy paper shred, so the inside looks packed by hand. */
function Filler({ color }: { color: string }) {
  const tissue = useMemo(() => {
    const g = new PlaneGeometry(W - T * 2, D - T * 2, 70, 52)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const ridge = (a: number, b: number) => 1 - Math.abs(Math.sin(a) * Math.cos(b))
      const edge = Math.max(Math.abs(x) / (W / 2), Math.abs(y) / (D / 2))
      pos.setZ(
        i,
        ridge(x * 71 + y * 33, y * 59 - x * 17) * 0.014 + ridge(x * 163 - y * 91, y * 141 + x * 57) * 0.006 + Math.pow(edge, 6) * 0.075,
      )
    }
    g.rotateX(-Math.PI / 2)
    g.computeVertexNormals()
    return g
  }, [])

  const shred = useMemo(() => {
    const r = rng(88)
    const tints = ['#e9cfa4', '#d9b783', '#f4e6c8', color]
    const list: Inst[] = Array.from({ length: 700 }, () => ({
      p: [(r() - 0.5) * (W - 0.05), 0.044 + r() * 0.02, (r() - 0.5) * (D - 0.05)],
      r: [(r() - 0.5) * 1.1, r() * Math.PI * 2, (r() - 0.5) * 1.1],
      s: [0.6 + r() * 0.9, 1, 1],
      c: tints[Math.floor(r() * tints.length)],
    }))
    return instanced(new BoxGeometry(0.03, 0.0012, 0.0032), new MeshStandardMaterial({ roughness: 0.9 }), list, { receive: true })
  }, [color])

  return (
    <group>
      <mesh geometry={tissue} position={[0, 0.03, 0]} receiveShadow>
        <meshStandardMaterial color={color} roughness={0.62} side={DoubleSide} flatShading />
      </mesh>
      <primitive object={shred} />
    </group>
  )
}

function Panel({ size, at }: { size: V3; at: V3 }) {
  return <Solid size={size} at={at} radius={0.0028} map={kraft()} bump={grain()} bumpScale={0.5} rough={0.86} />
}

/** Printed art that sits just above a cardboard face. */
function Printed({ map, size, at, rot }: { map: ReturnType<typeof kraft>; size: [number, number]; at: V3; rot?: V3 }) {
  return (
    <mesh position={at} rotation={rot} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial map={map} transparent roughness={0.78} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  )
}

type Props = {
  city?: number
  /** Read every frame: 0 shut, 1 open with the goods raised. */
  open?: () => number
  /** Only the boxes you can open need anything inside. */
  filled?: boolean
  shadow?: boolean
}

/** The Marlowby mailer box. */
export function Parcel({ city = 0, open, filled = false, shadow = false }: Props) {
  const info = CITIES[city]
  const lid = useRef<Group>(null)
  const goods = useRef<Group>(null)

  useFrame(({ clock }) => {
    const o = open?.() ?? 0
    if (lid.current) lid.current.rotation.x = -1.92 * seg(o, 0, 0.55)
    goods.current?.children.forEach((item, i) => {
      const k = seg(o, 0.34 + i * 0.08, 0.68 + i * 0.08)
      const { rest, open: up, turn } = SLOTS[i]
      item.position.set(
        rest[0] + (up[0] - rest[0]) * k,
        rest[1] + (up[1] - rest[1]) * k + Math.sin(clock.elapsedTime * 1.3 + i * 1.7) * 0.005 * k,
        rest[2] + (up[2] - rest[2]) * k,
      )
      item.rotation.set(i === 3 ? -0.16 * k : 0, turn * k + Math.sin(clock.elapsedTime * 0.7 + i) * 0.07 * k, 0)
    })
  })

  return (
    <group>
      {shadow && (
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W * 1.55, D * 1.7]} />
          <meshBasicMaterial map={softShadow()} transparent depthWrite={false} />
        </mesh>
      )}
      <Panel size={[W - T * 2, T, D - T * 2]} at={[0, T / 2, 0]} />
      <Panel size={[W, H, T]} at={[0, H / 2, D / 2 - T / 2]} />
      <Panel size={[W, H, T]} at={[0, H / 2, -D / 2 + T / 2]} />
      <Panel size={[T, H, D - T * 2]} at={[W / 2 - T / 2, H / 2, 0]} />
      <Panel size={[T, H, D - T * 2]} at={[-W / 2 + T / 2, H / 2, 0]} />
      <Printed map={shippingLabel(info.label.name, info.label.coords, info.accent)} size={[0.17, 0.0996]} at={[0, 0.064, D / 2 + 0.0008]} />

      <group ref={lid} position={[0, H, -D / 2]}>
        <Panel size={[W + 0.012, T, D + 0.008]} at={[0, T / 2, D / 2]} />
        <Panel size={[W + 0.012, 0.05, T]} at={[0, -0.019, D + 0.006]} />
        <Panel size={[T * 0.7, 0.036, D - 0.03]} at={[W / 2 + 0.0058, -0.014, D / 2]} />
        <Panel size={[T * 0.7, 0.036, D - 0.03]} at={[-W / 2 - 0.0058, -0.014, D / 2]} />
        {/* paper band in the city colour, over the lid and down the front */}
        <Solid size={[0.034, 0.0016, D + 0.012]} at={[W * 0.37, T + 0.001, D / 2 + 0.002]} color={info.accent} rough={0.6} />
        <Solid size={[0.034, 0.054, 0.0016]} at={[W * 0.37, -0.019, D + 0.0108]} color={info.accent} rough={0.6} />
        <Printed map={lidPrint()} size={[0.25, 0.171]} at={[-0.025, T + 0.0006, D / 2]} rot={[-Math.PI / 2, 0, 0]} />
        {filled && <Printed map={lidInside(info.label.name, info.accent)} size={[0.28, 0.191]} at={[0, -0.0008, D / 2]} rot={[Math.PI / 2, 0, 0]} />}
      </group>

      {filled && (
        <>
          <Filler color={info.tissue} />
          <group ref={goods}>
            {/* each product is wrapped so it can be moved as one piece */}
            {cityGoods(city).map((item, i) => (
              <group key={i} position={SLOTS[i].rest}>
                {item}
              </group>
            ))}
          </group>
        </>
      )}
    </group>
  )
}
