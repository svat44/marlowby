import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ExtrudeGeometry, Shape, type Group } from 'three'
import { decal, softShadow } from '../lib/textures'
import { Solid } from './Solid'

/** Extrudes a side profile into a body panel whose rounded edges stay inside the outline. */
function panel(shape: Shape, width: number, bevel: number) {
  const g = new ExtrudeGeometry(shape, {
    depth: width - bevel * 2, bevelThickness: bevel, bevelSize: bevel, bevelOffset: -bevel, bevelSegments: 6, curveSegments: 24,
  })
  g.translate(0, 0, -(width - bevel * 2) / 2)
  return g
}

function cabShape() {
  const s = new Shape()
  s.moveTo(-0.05, 0.4)
  s.lineTo(0.84, 0.4)
  s.absarc(1.25, 0.34, 0.415, Math.PI - 0.146, 0.146, true)
  s.lineTo(1.82, 0.4)
  s.quadraticCurveTo(1.9, 0.42, 1.9, 0.54)
  s.lineTo(1.87, 0.74)
  s.quadraticCurveTo(1.85, 0.88, 1.66, 0.91)
  s.lineTo(1.18, 0.98)
  s.lineTo(0.84, 1.42)
  s.quadraticCurveTo(0.77, 1.52, 0.63, 1.53)
  s.lineTo(0.1, 1.53)
  s.quadraticCurveTo(-0.05, 1.52, -0.05, 1.37)
  s.closePath()
  return s
}

function bedShape() {
  const s = new Shape()
  s.moveTo(-1.72, 0.44)
  s.lineTo(-1.5, 0.4)
  s.absarc(-1.09, 0.34, 0.415, Math.PI - 0.146, 0.146, true)
  s.lineTo(-0.08, 0.4)
  s.lineTo(-0.08, 0.92)
  s.lineTo(-1.66, 0.92)
  s.quadraticCurveTo(-1.73, 0.91, -1.73, 0.83)
  s.closePath()
  return s
}

function glassShape() {
  const s = new Shape()
  s.moveTo(0.1, 1.02)
  s.lineTo(1.04, 1.02)
  s.lineTo(0.77, 1.38)
  s.quadraticCurveTo(0.73, 1.43, 0.65, 1.435)
  s.lineTo(0.16, 1.435)
  s.quadraticCurveTo(0.1, 1.43, 0.1, 1.37)
  s.closePath()
  return s
}

function Paint({ color = '#c9462f' }: { color?: string }) {
  return <meshPhysicalMaterial color={color} roughness={0.34} metalness={0.45} clearcoat={1} clearcoatRoughness={0.1} />
}

const Chrome = () => <meshStandardMaterial color="#dfe3e6" metalness={1} roughness={0.2} />
const Glass = () => <meshPhysicalMaterial color="#0d1c24" metalness={0.9} roughness={0.06} clearcoat={1} envMapIntensity={1.5} />

function Wheel({ x, z }: { x: number; z: number }) {
  const face = z > 0 ? 1 : -1
  return (
    <group position={[x, 0.335, z]}>
      <group name="spin">
        <mesh castShadow>
          <torusGeometry args={[0.245, 0.09, 20, 48]} />
          <meshStandardMaterial color="#17181a" roughness={0.92} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.13, 40]} />
          <meshStandardMaterial color="#232528" roughness={0.7} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0, face * 0.07]}>
          <torusGeometry args={[0.172, 0.018, 12, 48]} />
          <Chrome />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} rotation={[0, 0, (i / 5) * Math.PI * 2]}>
            <mesh position={[0, 0.085, face * 0.075]}>
              <boxGeometry args={[0.042, 0.17, 0.022]} />
              <Chrome />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0, face * 0.085]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.052, 0.058, 0.04, 24]} />
          <Chrome />
        </mesh>
      </group>
    </group>
  )
}

/** A pickup truck carrying the box. Its nose points toward +x. */
export function Truck() {
  const root = useRef<Group>(null)
  const geo = useMemo(
    () => ({ cab: panel(cabShape(), 1.3, 0.085), bed: panel(bedShape(), 0.11, 0.035), glass: panel(glassShape(), 1.312, 0.004) }),
    [],
  )

  // wheels turn by however far the truck has actually moved
  useFrame(() => {
    const parent = root.current?.parent
    if (!parent) return
    root.current!.children.forEach((child) => {
      const spin = child.getObjectByName('spin')
      if (spin) spin.rotation.z = -parent.position.x / 0.335
    })
  })

  return (
    <group ref={root}>
      <mesh position={[0.05, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.6, 2.1]} />
        <meshBasicMaterial map={softShadow()} transparent depthWrite={false} />
      </mesh>
      <mesh geometry={geo.cab} castShadow receiveShadow>
        <Paint />
      </mesh>
      <mesh geometry={geo.glass}>
        <Glass />
      </mesh>
      {/* windscreen */}
      <mesh position={[1.018, 1.202, 0]} rotation={[0, 0, 0.658]}>
        <boxGeometry args={[0.012, 0.5, 1.1]} />
        <Glass />
      </mesh>
      {/* door seams, handles and lettering */}
      {[1, -1].map((s) => (
        <group key={s} position={[0, 0, s * 0.653]}>
          <mesh position={[0.62, 1.2, s * 0.006]}>
            <boxGeometry args={[0.035, 0.44, 0.006]} />
            <Paint />
          </mesh>
          {[0.1, 0.84].map((x) => (
            <mesh key={x} position={[x, 0.74, 0]}>
              <boxGeometry args={[0.007, 0.52, 0.003]} />
              <meshStandardMaterial color="#511a10" />
            </mesh>
          ))}
          <mesh position={[0.22, 0.9, s * 0.012]}>
            <boxGeometry args={[0.13, 0.028, 0.02]} />
            <Chrome />
          </mesh>
          <mesh position={[0.47, 0.7, s * 0.006]} rotation={[0, s > 0 ? 0 : Math.PI, 0]}>
            <planeGeometry args={[0.68, 0.128]} />
            <meshStandardMaterial map={decal('MARLOWBY', '#fdf1da')} transparent roughness={0.4} />
          </mesh>
          <mesh position={[1.1, 1.05, s * 0.09]} castShadow>
            <boxGeometry args={[0.07, 0.15, 0.11]} />
            <Paint />
          </mesh>
        </group>
      ))}

      {/* cargo bed */}
      {[0.595, -0.595].map((z) => (
        <group key={z}>
          <mesh geometry={geo.bed} position={[0, 0, z]} castShadow receiveShadow>
            <Paint />
          </mesh>
          <Solid size={[1.66, 0.035, 0.12]} at={[-0.89, 0.935, z]} radius={0.015} color="#2a2f31" rough={0.45} metal={0.6} />
        </group>
      ))}
      <Solid size={[1.62, 0.07, 1.14]} at={[-0.89, 0.55, 0]} color="#25282a" rough={0.8} metal={0.3} />
      {[-0.4, -0.2, 0, 0.2, 0.4].map((z) => (
        <Solid key={z} size={[1.55, 0.014, 0.05]} at={[-0.9, 0.59, z]} color="#3b4043" rough={0.55} metal={0.6} />
      ))}
      <mesh position={[-1.69, 0.72, 0]} castShadow>
        <boxGeometry args={[0.07, 0.36, 1.12]} />
        <Paint />
      </mesh>
      <mesh position={[-0.1, 0.72, 0]} castShadow>
        <boxGeometry args={[0.06, 0.36, 1.12]} />
        <Paint />
      </mesh>
      <Solid size={[3.2, 0.14, 0.86]} at={[0.08, 0.38, 0]} radius={0.04} color="#16191b" rough={0.8} />

      {/* bumpers, grille and lights */}
      <Solid size={[0.14, 0.15, 1.34]} at={[1.9, 0.43, 0]} radius={0.05} color="#cfd4d8" metal={1} rough={0.24} />
      <Solid size={[0.12, 0.13, 1.34]} at={[-1.78, 0.45, 0]} radius={0.045} color="#cfd4d8" metal={1} rough={0.24} />
      <Solid size={[0.03, 0.2, 0.62]} at={[1.885, 0.66, 0]} radius={0.012} color="#15181a" metal={0.7} rough={0.4} />
      {[0.6, 0.66, 0.72].map((y) => (
        <Solid key={y} size={[0.015, 0.018, 0.58]} at={[1.905, y, 0]} color="#dfe3e6" metal={1} rough={0.2} />
      ))}
      {[0.45, -0.45].map((z) => (
        <Solid key={z} size={[0.05, 0.12, 0.2]} at={[1.855, 0.7, z]} radius={0.022} color="#fff6dd" glow="#ffe2a3" glowPower={2.6} />
      ))}
      {[0.56, -0.56].map((z) => (
        <Solid key={z} size={[0.04, 0.2, 0.09]} at={[-1.74, 0.76, z]} radius={0.018} color="#8d140c" glow="#ff2a14" glowPower={2.4} />
      ))}

      <Wheel x={1.25} z={0.6} />
      <Wheel x={1.25} z={-0.6} />
      <Wheel x={-1.09} z={0.6} />
      <Wheel x={-1.09} z={-0.6} />
    </group>
  )
}
