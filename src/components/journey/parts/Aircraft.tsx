import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ExtrudeGeometry, LatheGeometry, MathUtils, Shape, Vector2, type Group } from 'three'
import { decal, livery } from '../lib/textures'
import type { V3 } from '../lib/util'

const LENGTH = 5.8
const RADIUS = 0.5

function fuselageGeometry() {
  const steps = 90
  const profile = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps
    let r = 1
    if (t < 0.3) r = 0.1 + 0.9 * Math.sin((t / 0.3) * (Math.PI / 2))
    if (t > 0.84) r = Math.sqrt(Math.max(1 - ((t - 0.84) / 0.16) ** 2, 0.0004))
    return new Vector2(r * RADIUS, (t - 0.5) * LENGTH)
  })
  const g = new LatheGeometry(profile, 64, Math.PI / 2)
  const uv = g.attributes.uv
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getY(i), uv.getX(i))
  g.rotateZ(-Math.PI / 2)
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const t = pos.getX(i) / LENGTH + 0.5
    const upsweep = t < 0.34 ? (1 - t / 0.34) ** 2 * 0.36 : 0
    const droop = t > 0.84 ? -(((t - 0.84) / 0.16) ** 2) * 0.09 : 0
    pos.setY(i, pos.getY(i) + upsweep + droop)
  }
  g.computeVertexNormals()
  return g
}

/** A thin, rounded-edge slab cut to an outline: wings, fins and stabilisers. */
function blade(points: [number, number][], thickness: number, bevel: number) {
  const shape = new Shape()
  points.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)))
  const g = new ExtrudeGeometry(shape, {
    depth: thickness, bevelThickness: bevel, bevelSize: bevel, bevelOffset: -bevel, bevelSegments: 5,
  })
  g.translate(0, 0, -thickness / 2)
  return g
}

function Paint({ color }: { color: string }) {
  return <meshPhysicalMaterial color={color} roughness={0.34} metalness={0.25} clearcoat={0.8} clearcoatRoughness={0.18} />
}

function Engine({ at }: { at: V3 }) {
  const fan = useRef<Group>(null)
  const nacelle = useMemo(() => {
    const g = new LatheGeometry(
      [[0.13, -0.5], [0.2, -0.36], [0.255, -0.08], [0.262, 0.2], [0.245, 0.34], [0.222, 0.385], [0.198, 0.37], [0.188, 0.18]].map(
        ([r, y]) => new Vector2(r, y),
      ),
      48,
    )
    g.rotateZ(-Math.PI / 2)
    return g
  }, [])
  useFrame((_, dt) => {
    if (fan.current) fan.current.rotation.x += dt * 16
  })
  return (
    <group position={at}>
      <mesh geometry={nacelle} castShadow>
        <meshPhysicalMaterial color="#0e4a47" roughness={0.3} metalness={0.4} clearcoat={1} side={2} />
      </mesh>
      <mesh position={[0.372, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.212, 0.019, 12, 48]} />
        <meshStandardMaterial color="#d9dde0" metalness={1} roughness={0.18} />
      </mesh>
      <mesh position={[0.2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.192, 40]} />
        <meshStandardMaterial color="#101416" roughness={0.9} />
      </mesh>
      <group ref={fan} position={[0.27, 0, 0]}>
        {Array.from({ length: 18 }, (_, i) => (
          <group key={i} rotation={[(i / 18) * Math.PI * 2, 0, 0]}>
            <mesh position={[0, 0.108, 0]} rotation={[0, 0.6, 0]}>
              <boxGeometry args={[0.008, 0.15, 0.046]} />
              <meshStandardMaterial color="#6d757c" metalness={0.9} roughness={0.35} />
            </mesh>
          </group>
        ))}
        <mesh position={[0.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.056, 0.13, 24]} />
          <meshStandardMaterial color="#e8e4da" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      <mesh position={[-0.03, 0.25, 0]} rotation={[0, 0, -0.12]} castShadow>
        <boxGeometry args={[0.38, 0.2, 0.055]} />
        <Paint color="#dcd6c8" />
      </mesh>
    </group>
  )
}

function Wing({ side }: { side: 1 | -1 }) {
  const wing = useMemo(() => {
    const g = blade([[0.8, 0], [-0.72, 3.4], [-1.14, 3.4], [-0.66, 1.2], [-0.62, 0]], 0.03, 0.032)
    g.rotateX(Math.PI / 2)
    return g
  }, [])
  const tip = useMemo(() => blade([[-0.7, 0], [-1.06, 0.46], [-1.24, 0.46], [-1.1, 0]], 0.016, 0.012), [])
  const flap = useMemo(() => {
    const g = blade([[-0.56, 0.5], [-0.66, 1.2], [-1.04, 2.9], [-0.93, 2.9], [-0.46, 0.5]], 0.008, 0.004)
    g.rotateX(Math.PI / 2)
    return g
  }, [])
  return (
    <group scale={[1, 1, side]}>
      <group position={[0.15, -0.16, 0.36]} rotation={[-0.075, 0, 0]}>
        <mesh geometry={wing} castShadow receiveShadow>
          <Paint color="#e9e4d8" />
        </mesh>
        <mesh geometry={flap} position={[0, 0.034, 0]}>
          <Paint color="#bfbdb4" />
        </mesh>
        <mesh geometry={tip} position={[0, 0.01, 3.38]} rotation={[0.2, 0, 0]} castShadow>
          <Paint color="#e8664e" />
        </mesh>
        <mesh position={[-0.9, 0.02, 3.43]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshStandardMaterial color={side > 0 ? '#38ff7a' : '#ff3b30'} emissive={side > 0 ? '#38ff7a' : '#ff3b30'} emissiveIntensity={4} />
        </mesh>
      </group>
      <Engine at={[0.4, -0.52, 1.5]} />
    </group>
  )
}

export function Aircraft() {
  const body = useMemo(fuselageGeometry, [])
  const fin = useMemo(() => blade([[-1.62, 0.34], [-2.55, 1.84], [-3.06, 1.84], [-2.76, 0.36]], 0.04, 0.026), [])
  const stabiliser = useMemo(() => {
    const g = blade([[-1.95, 0], [-2.7, 1.28], [-3.0, 1.28], [-2.62, 0]], 0.022, 0.018)
    g.rotateX(Math.PI / 2)
    return g
  }, [])
  return (
    <group>
      <mesh geometry={body} castShadow receiveShadow>
        <meshPhysicalMaterial map={livery()} roughness={0.32} metalness={0.2} clearcoat={0.85} clearcoatRoughness={0.15} />
      </mesh>
      {/* belly fairing where the wings join */}
      <mesh position={[0.05, -0.24, 0]} scale={[1.5, 0.34, 0.56]} castShadow>
        <sphereGeometry args={[1, 36, 20]} />
        <Paint color="#dcd6c8" />
      </mesh>
      <Wing side={1} />
      <Wing side={-1} />
      <mesh geometry={fin} castShadow>
        <Paint color="#e8664e" />
      </mesh>
      {[1, -1].map((s) => (
        <mesh key={s} position={[-2.5, 1.2, s * 0.05]} rotation={[0, s > 0 ? 0 : Math.PI, MathUtils.degToRad(0)]}>
          <planeGeometry args={[0.55, 0.42]} />
          <meshStandardMaterial map={decal('M', '#f6eedf', 180)} transparent roughness={0.4} />
        </mesh>
      ))}
      <group position={[0, 0.3, 0]}>
        <mesh geometry={stabiliser} position={[0, 0, 0.14]} castShadow>
          <Paint color="#e9e4d8" />
        </mesh>
        <group scale={[1, 1, -1]}>
          <mesh geometry={stabiliser} position={[0, 0, 0.14]} castShadow>
            <Paint color="#e9e4d8" />
          </mesh>
        </group>
      </group>
    </group>
  )
}
