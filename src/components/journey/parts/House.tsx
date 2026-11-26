import { useMemo, type RefObject } from 'react'
import { ExtrudeGeometry, Shape, type Group } from 'three'
import { brick, concrete, grain, litWindow, plaster, poster, shingles, siding, tiled, welcomeMat, wood } from '../lib/textures'
import type { V3 } from '../lib/util'
import { Solid } from './Solid'

const TRIM = '#fbf4e6'

function Window({ at, w = 0.72, h = 0.92, shutters }: { at: V3; w?: number; h?: number; shutters?: string }) {
  return (
    <group position={at}>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={litWindow()} emissive="#ffffff" emissiveMap={litWindow()} emissiveIntensity={0.42} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.022]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#bfe0ff" metalness={1} roughness={0.05} transparent opacity={0.2} depthWrite={false} />
      </mesh>
      {[1, -1].map((s) => (
        <group key={s}>
          <Solid size={[w + 0.14, 0.07, 0.08]} at={[0, s * (h / 2 + 0.025), 0.03]} radius={0.012} color={TRIM} />
          <Solid size={[0.07, h, 0.08]} at={[s * (w / 2 + 0.025), 0, 0.03]} radius={0.012} color={TRIM} />
        </group>
      ))}
      <Solid size={[0.028, h, 0.03]} at={[0, 0, 0.038]} color={TRIM} />
      <Solid size={[w, 0.028, 0.03]} at={[0, 0.04, 0.038]} color={TRIM} />
      <Solid size={[w + 0.22, 0.06, 0.15]} at={[0, -h / 2 - 0.075, 0.06]} radius={0.015} color={TRIM} />
      {shutters &&
        [1, -1].map((s) => (
          <group key={s} position={[s * (w / 2 + 0.18), 0, 0.03]}>
            <Solid size={[0.2, h + 0.06, 0.04]} radius={0.01} color={shutters} />
            {Array.from({ length: 9 }, (_, i) => (
              <Solid key={i} size={[0.15, 0.028, 0.02]} at={[0, -h / 2 + 0.09 + (i * (h - 0.14)) / 8, 0.026]} rot={[0.35, 0, 0]} color={shutters} />
            ))}
          </group>
        ))}
    </group>
  )
}

/** Triangle wall under the roof, plus two overhanging shingled slopes. */
function Gable({ width, rise, y, depth, wall, roof }: { width: number; rise: number; y: number; depth: number; wall: string; roof: string }) {
  const triangle = useMemo(() => {
    const s = new Shape()
    s.moveTo(-width / 2, 0)
    s.lineTo(width / 2, 0)
    s.lineTo(0, rise)
    s.closePath()
    return new ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: false })
  }, [width, rise])
  const wallMap = useMemo(() => tiled(siding(), 1, 1), [])
  const run = width / 2 + 0.28
  const angle = Math.atan2(rise, width / 2)
  const length = run / Math.cos(angle)
  return (
    <group position={[0, y, 0]}>
      <mesh geometry={triangle} position={[0, 0, -0.08]} castShadow receiveShadow>
        <meshStandardMaterial color={wall} map={wallMap} roughness={0.85} />
      </mesh>
      {[1, -1].map((s) => (
        <group key={s} position={[(s * run) / 2, rise - (run / 2) * Math.tan(angle) + 0.07, -depth / 2 + 0.22]} rotation={[0, 0, -s * angle]}>
          <Solid size={[length, 0.09, depth + 0.3]} map={shingles()} bump={shingles()} bumpScale={1.4} tile={1.1} color={roof} rough={0.9} />
          <Solid size={[length, 0.12, 0.07]} at={[0, -0.045, (depth + 0.3) / 2]} radius={0.014} color={TRIM} />
        </group>
      ))}
      <Solid size={[0.13, 0.09, depth + 0.34]} at={[0, rise + 0.14, -depth / 2 + 0.22]} radius={0.04} color={roof} />
    </group>
  )
}

function Lantern({ at }: { at: V3 }) {
  return (
    <group position={at}>
      <Solid size={[0.1, 0.03, 0.12]} at={[0, 0.12, 0]} radius={0.01} color="#1b1d1e" metal={0.8} rough={0.4} />
      <Solid size={[0.07, 0.16, 0.08]} radius={0.02} color="#ffdf9e" glow="#ffbf5c" glowPower={3.4} />
      <Solid size={[0.09, 0.025, 0.1]} at={[0, -0.095, 0]} radius={0.01} color="#1b1d1e" metal={0.8} rough={0.4} />
    </group>
  )
}

function Column({ x }: { x: number }) {
  return (
    <group position={[x, 0, 1.18]}>
      <Solid size={[0.22, 0.42, 0.22]} at={[0, 0.5, 0]} map={brick()} tile={0.7} rough={0.9} />
      <Solid size={[0.28, 0.06, 0.28]} at={[0, 0.74, 0]} radius={0.014} color={TRIM} />
      <mesh position={[0, 1.52, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.088, 1.5, 24]} />
        <meshStandardMaterial color={TRIM} roughness={0.6} />
      </mesh>
      <Solid size={[0.22, 0.07, 0.22]} at={[0, 2.3, 0]} radius={0.014} color={TRIM} />
    </group>
  )
}

/** The panelled front door. It is hinged on the left and swings inward. */
function Door({ hinge }: { hinge: RefObject<Group> }) {
  return (
    <group ref={hinge} position={[-0.47, 0.3, 0.02]}>
      <group position={[0.47, 0.93, 0]}>
        <Solid size={[0.94, 1.86, 0.07]} radius={0.012} color="#0f4f4b" rough={0.42} />
        {[-0.2, 0.2].flatMap((x) =>
          [
            [-0.55, 0.5],
            [0.12, 0.62],
          ].map(([y, h]) => (
            <group key={`${x}${y}`} position={[x, y, 0.04]}>
              <Solid size={[0.3, h, 0.02]} radius={0.008} color="#135d58" rough={0.4} />
              <Solid size={[0.22, h - 0.09, 0.016]} at={[0, 0, 0.014]} radius={0.007} color="#0f4f4b" rough={0.4} />
            </group>
          )),
        )}
        {[-0.2, 0, 0.2].map((x) => (
          <Solid key={x} size={[0.17, 0.2, 0.02]} at={[x, 0.68, 0.036]} radius={0.008} color="#ffd994" glow="#ffbc62" glowPower={0.9} />
        ))}
        <mesh position={[0.33, -0.1, 0.085]} castShadow>
          <sphereGeometry args={[0.042, 24, 16]} />
          <meshStandardMaterial color="#e8bd68" metalness={1} roughness={0.2} />
        </mesh>
        <Solid size={[0.3, 0.035, 0.02]} at={[0, 0.3, 0.045]} radius={0.008} color="#e8bd68" metal={1} rough={0.25} />
      </group>
    </group>
  )
}

function PottedPlant({ at }: { at: V3 }) {
  return (
    <group position={at}>
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.1, 0.26, 24]} />
        <meshStandardMaterial color="#b0603a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.265, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.14, 0.02, 10, 32]} />
        <meshStandardMaterial color="#b0603a" roughness={0.85} />
      </mesh>
    </group>
  )
}

/** The home the box is delivered to. Its front wall sits at z = 0 of this group. */
export function HeroHouse({ door }: { door: RefObject<Group> }) {
  const deck = useMemo(() => wood('deck', [150, 108, 72], 9), [])
  const WALL = '#9fb8b1'
  const wall = { map: siding(), bump: siding(), bumpScale: 1.2, tile: 1, color: WALL, rough: 0.85 } as const
  return (
    <group>
      {/* front wall, built around the doorway */}
      <Solid size={[2.1, 2.5, 0.16]} at={[-1.52, 1.45, -0.08]} {...wall} />
      <Solid size={[2.1, 2.5, 0.16]} at={[1.52, 1.45, -0.08]} {...wall} />
      <Solid size={[0.94, 0.54, 0.16]} at={[0, 2.43, -0.08]} {...wall} />
      <Solid size={[5.3, 0.26, 0.3]} at={[0, 0.13, -0.12]} map={brick()} tile={0.8} rough={0.95} />
      {[-2.57, 2.57].map((x) => (
        <group key={x}>
          <Solid size={[0.12, 2.5, 0.2]} at={[x, 1.45, -0.04]} radius={0.015} color={TRIM} />
          <Solid size={[0.14, 2.7, 2]} at={[x, 1.35, -1.1]} {...wall} />
        </group>
      ))}
      {[-0.54, 0.54].map((x) => (
        <Solid key={x} size={[0.13, 1.98, 0.07]} at={[x, 1.28, 0.03]} radius={0.014} color={TRIM} />
      ))}
      <Solid size={[1.34, 0.13, 0.09]} at={[0, 2.29, 0.04]} radius={0.016} color={TRIM} />

      <Window at={[-1.62, 1.45, 0]} w={0.78} h={1.02} shutters="#0f4f4b" />
      <Window at={[1.62, 1.45, 0]} w={0.78} h={1.02} shutters="#0f4f4b" />
      <Gable width={5.3} rise={1.45} y={2.7} depth={2.2} wall={WALL} roof="#8a4a3a" />
      <Window at={[0, 3.2, 0.03]} w={0.52} h={0.46} />
      <Solid size={[5.44, 0.14, 0.22]} at={[0, 2.72, 0]} radius={0.02} color={TRIM} />

      <Solid size={[0.36, 1.2, 0.36]} at={[1.55, 3.7, -0.9]} map={brick()} tile={0.7} rough={0.95} />
      <Solid size={[0.45, 0.09, 0.45]} at={[1.55, 4.33, -0.9]} radius={0.02} color="#8c8279" />

      {/* porch */}
      <Solid size={[3.1, 0.12, 1.34]} at={[0, 0.24, 0.66]} map={deck} tile={1.2} rough={0.7} />
      <Solid size={[3.06, 0.18, 1.28]} at={[0, 0.09, 0.64]} color="#cfc4b0" />
      <Solid size={[1.3, 0.12, 0.28]} at={[0, 0.15, 1.47]} map={deck} tile={1.2} rough={0.7} />
      <Solid size={[1.5, 0.08, 0.3]} at={[0, 0.045, 1.73]} map={concrete()} tile={0.8} rough={0.9} />
      <Column x={-1.4} />
      <Column x={1.4} />
      <group position={[0, 2.47, 0.66]} rotation={[0.2, 0, 0]}>
        <Solid size={[3.35, 0.09, 1.5]} map={shingles()} tile={1.1} color="#8a4a3a" rough={0.9} />
        <Solid size={[3.37, 0.12, 0.08]} at={[0, -0.035, 0.75]} radius={0.015} color={TRIM} />
      </group>
      <Solid size={[3.05, 0.13, 0.12]} at={[0, 2.31, 1.18]} radius={0.02} color={TRIM} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Solid size={[0.07, 0.06, 1.05]} at={[s * 1.46, 0.78, 0.57]} radius={0.015} color={TRIM} />
          {Array.from({ length: 7 }, (_, i) => (
            <Solid key={i} size={[0.035, 0.46, 0.035]} at={[s * 1.46, 0.53, 0.14 + i * 0.15]} color={TRIM} />
          ))}
        </group>
      ))}
      <mesh position={[0, 0.304, 0.34]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[0.72, 0.38]} />
        <meshStandardMaterial map={welcomeMat()} roughness={1} />
      </mesh>
      <Lantern at={[-0.76, 1.72, 0.09]} />
      <Lantern at={[0.76, 1.72, 0.09]} />
      <PottedPlant at={[-0.92, 0.3, 0.32]} />
      <PottedPlant at={[0.92, 0.3, 0.32]} />
      <Door hinge={door} />

      {/* the warm hallway seen through the doorway */}
      <Solid size={[1.7, 0.06, 2.2]} at={[0, 0.27, -1.25]} map={deck} tile={1.1} rough={0.6} />
      <Solid size={[1.7, 2.3, 0.08]} at={[0, 1.4, -2.35]} map={plaster()} tile={1.5} color="#e7b878" glow="#ffb35c" glowPower={0.45} />
      {[-0.86, 0.86].map((x) => (
        <Solid key={x} size={[0.06, 2.3, 2.2]} at={[x, 1.4, -1.25]} map={plaster()} bump={grain()} bumpScale={0.2} tile={1.5} color="#d9a86c" glow="#c9803c" glowPower={0.22} />
      ))}
      <Solid size={[0.46, 0.58, 0.04]} at={[0.18, 1.6, -2.29]} radius={0.012} color="#2a1c12" rough={0.45} />
      <mesh position={[0.18, 1.6, -2.265]}>
        <planeGeometry args={[0.4, 0.516]} />
        <meshStandardMaterial map={poster(0)} roughness={0.7} />
      </mesh>
      <Solid size={[0.9, 0.05, 0.26]} at={[0.18, 0.92, -2.17]} radius={0.014} map={deck} rough={0.45} />
      {[-0.21, 0.57].map((x) => (
        <Solid key={x} size={[0.045, 0.62, 0.045]} at={[x, 0.6, -2.12]} radius={0.012} color="#4a2f1d" rough={0.5} />
      ))}
      <group position={[0.46, 0.945, -2.17]}>
        <Solid size={[0.1, 0.03, 0.1]} at={[0, 0.015, 0]} radius={0.012} color="#b5914f" metal={1} rough={0.3} />
        <Solid size={[0.025, 0.2, 0.025]} at={[0, 0.12, 0]} color="#b5914f" metal={1} rough={0.3} />
        <mesh position={[0, 0.26, 0]}>
          <cylinderGeometry args={[0.07, 0.11, 0.13, 32, 1, true]} />
          <meshStandardMaterial color="#fbe6c0" emissive="#ffbe6a" emissiveIntensity={0.9} side={2} />
        </mesh>
      </group>
      <Solid size={[1.7, 0.06, 2.2]} at={[0, 2.55, -1.25]} color="#f0dcc0" glow="#ffc77a" glowPower={0.3} />
    </group>
  )
}

/** A simpler neighbour, so the street feels lived in. */
export function NeighborHouse({ at, wall, roof, door }: { at: V3; wall: string; roof: string; door: string }) {
  return (
    <group position={at}>
      <Solid size={[3.4, 2.1, 1.7]} at={[0, 1.05, -0.85]} map={siding()} tile={1} color={wall} rough={0.85} />
      <Gable width={3.4} rise={1.05} y={2.1} depth={1.7} wall={wall} roof={roof} />
      <Window at={[-1.05, 1.15, 0.01]} w={0.62} h={0.76} />
      <Window at={[1.05, 1.15, 0.01]} w={0.62} h={0.76} />
      <Solid size={[0.66, 1.34, 0.08]} at={[0, 0.7, 0.02]} radius={0.015} color={door} rough={0.45} />
      <Solid size={[0.84, 0.09, 0.14]} at={[0, 1.42, 0.05]} radius={0.015} color={TRIM} />
      <Solid size={[1.1, 0.1, 0.5]} at={[0, 0.05, 0.25]} radius={0.015} color="#bcb5a9" />
    </group>
  )
}
