import { useMemo } from 'react'
import { BoxGeometry, type Texture } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import type { V3 } from '../lib/util'

type Props = {
  size: V3
  at?: V3
  rot?: V3
  color?: string
  map?: Texture
  bump?: Texture
  bumpScale?: number
  /** World size of one texture repeat, so patterns stay the same scale on every piece. */
  tile?: number
  radius?: number
  rough?: number
  metal?: number
  glow?: string
  glowPower?: number
}

/** A block with optional rounded edges and real-world-scaled texture. */
export function Solid({
  size, at, rot, color = '#ffffff', map, bump, bumpScale = 0.6, tile, radius, rough = 0.8, metal = 0, glow, glowPower = 1,
}: Props) {
  const [w, h, d] = size
  const geometry = useMemo(() => {
    if (radius) return new RoundedBoxGeometry(w, h, d, 3, radius)
    const g = new BoxGeometry(w, h, d)
    if (tile) {
      const uv = g.attributes.uv
      const faces = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]]
      faces.forEach(([fw, fh], f) => {
        for (let k = 0; k < 4; k++) {
          const i = f * 4 + k
          uv.setXY(i, (uv.getX(i) * fw) / tile, (uv.getY(i) * fh) / tile)
        }
      })
    }
    return g
  }, [w, h, d, tile, radius])

  return (
    <mesh geometry={geometry} position={at} rotation={rot} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        map={map ?? null}
        bumpMap={bump ?? null}
        bumpScale={bumpScale}
        roughness={rough}
        metalness={metal}
        emissive={glow ?? '#000000'}
        emissiveIntensity={glow ? glowPower : 0}
      />
    </mesh>
  )
}
