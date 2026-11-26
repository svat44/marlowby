import { useMemo } from 'react'
import { BoxGeometry, DoubleSide, LatheGeometry, MathUtils, Vector2 } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { granules, mapArt, poster, productLabel, wrapLabel } from '../lib/textures'

/* Original, unbranded sample products. Each stands on y = 0. */

/** A stand-up coffee bag: full in the belly, pinched flat along the top seal. */
function Pouch({ title, sub, color, ink }: { title: string; sub: string; color: string; ink: string }) {
  const geometry = useMemo(() => {
    const w = 0.082
    const h = 0.148
    const d = 0.044
    const g = new BoxGeometry(w, h, d, 16, 28, 8)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const t = y / h + 0.5
      const pinch = 1 - MathUtils.smoothstep(t, 0.66, 0.94) * 0.93
      const belly = 1 + 0.16 * Math.sin(Math.PI * Math.min(t / 0.8, 1))
      const round = 1 - 0.42 * Math.pow(Math.abs((2 * x) / w), 4)
      const crinkle = Math.sin(x * 420 + y * 150) * Math.sin(y * 330) * 0.0008
      pos.setZ(i, pos.getZ(i) * pinch * belly * round + crinkle)
    }
    g.computeVertexNormals()
    g.translate(0, h / 2, 0)
    return g
  }, [])
  const label = productLabel(title, sub, color, ink)
  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        {[0, 1, 2, 3, 4, 5].map((face) => (
          <meshStandardMaterial
            key={face}
            attach={`material-${face}`}
            map={face === 4 ? label : null}
            color={face === 4 ? '#ffffff' : color}
            roughness={0.52}
            metalness={0.12}
          />
        ))}
      </mesh>
      <mesh position={[0, 0.132, 0]}>
        <boxGeometry args={[0.086, 0.007, 0.008]} />
        <meshStandardMaterial color="#c9b98f" metalness={0.8} roughness={0.35} />
      </mesh>
    </group>
  )
}

function Lid({ y, radius, height }: { y: number; radius: number; height: number }) {
  return (
    <group position={[0, y, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius, height, 40]} />
        <meshStandardMaterial color="#d8c490" metalness={0.92} roughness={0.28} />
      </mesh>
      {[-0.35, 0.35].map((k) => (
        <mesh key={k} position={[0, k * height, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.0014, 8, 40]} />
          <meshStandardMaterial color="#b79f66" metalness={0.9} roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

/** A glass jar with the spice visible inside. */
function Jar({ title, sub }: { title: string; sub: string }) {
  const spice = granules('spice', '#5d6b2a', ['#8b9a45', '#c9b25a', '#3d4a18', '#a8552c', '#efe3b4'])
  return (
    <group>
      <mesh position={[0, 0.047, 0]} castShadow>
        <cylinderGeometry args={[0.0325, 0.0325, 0.082, 40]} />
        <meshStandardMaterial map={spice} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.053, 0]}>
        <cylinderGeometry args={[0.037, 0.037, 0.106, 40, 1, true]} />
        <meshStandardMaterial color="#e9fbff" transparent opacity={0.2} roughness={0.04} metalness={0.6} depthWrite={false} envMapIntensity={2.4} />
      </mesh>
      <mesh position={[0, 0.048, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.0374, 0.0374, 0.046, 48, 1, true]} />
        <meshStandardMaterial map={wrapLabel(title, sub, '#f3e9d7', '#142221')} roughness={0.7} />
      </mesh>
      <Lid y={0.118} radius={0.035} height={0.024} />
    </group>
  )
}

function Tin({ title, sub, color }: { title: string; sub: string; color: string }) {
  return (
    <group>
      <mesh position={[0, 0.048, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.046, 0.046, 0.096, 48]} />
        <meshStandardMaterial attach="material-0" map={wrapLabel(title, sub, color, '#fdf3df')} metalness={0.45} roughness={0.36} />
        <meshStandardMaterial attach="material-1" color="#cbb783" metalness={0.9} roughness={0.3} />
        <meshStandardMaterial attach="material-2" color="#cbb783" metalness={0.9} roughness={0.3} />
      </mesh>
      <Lid y={0.103} radius={0.0478} height={0.018} />
    </group>
  )
}

function Bottle({ title, sub }: { title: string; sub: string }) {
  const profile = useMemo(
    () =>
      [[0, 0], [0.026, 0], [0.03, 0.008], [0.03, 0.095], [0.027, 0.108], [0.014, 0.126], [0.0115, 0.134], [0.0115, 0.156], [0, 0.156]].map(
        ([x, y]) => new Vector2(x, y),
      ),
    [],
  )
  const glass = useMemo(() => new LatheGeometry(profile, 48), [profile])
  return (
    <group scale={0.88}>
      <mesh geometry={glass} castShadow>
        <meshPhysicalMaterial color="#a8200f" roughness={0.12} metalness={0.05} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      <mesh position={[0, 0.056, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.0306, 0.0306, 0.058, 48, 1, true]} />
        <meshStandardMaterial map={wrapLabel(title, sub, '#f7e4bd', '#7a1608')} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.163, 0]} castShadow>
        <cylinderGeometry args={[0.0135, 0.0135, 0.022, 32]} />
        <meshStandardMaterial color="#17201f" roughness={0.4} />
      </mesh>
    </group>
  )
}

function Carton({ title, sub, color }: { title: string; sub: string; color: string }) {
  const geometry = useMemo(() => new RoundedBoxGeometry(0.094, 0.108, 0.04, 3, 0.005), [])
  return (
    <group position={[0, 0.054, 0]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0, 0.0203]}>
        <planeGeometry args={[0.082, 0.1]} />
        <meshStandardMaterial map={productLabel(title, sub, color, '#fdf3df')} roughness={0.7} />
      </mesh>
    </group>
  )
}

function Print({ city }: { city: number }) {
  return (
    <group position={[0, 0.072, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.108, 0.139, 0.004]} />
        <meshStandardMaterial color="#f6eedf" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, 0.0023]}>
        <planeGeometry args={[0.104, 0.134]} />
        <meshStandardMaterial map={poster(city)} roughness={0.7} />
      </mesh>
    </group>
  )
}

/** A folded paper map, opened a little like an accordion. */
function Booklet({ title, accent }: { title: string; accent: string }) {
  const art = mapArt(title, accent)
  const panels = useMemo(
    () =>
      [0, 1, 2].map((i) => {
        const g = new BoxGeometry(0.047, 0.1, 0.0022)
        const uv = g.attributes.uv
        for (let k = 16; k < 20; k++) uv.setX(k, (uv.getX(k) + i) / 3)
        return g
      }),
    [],
  )
  return (
    <group position={[0, 0.05, 0]}>
      {panels.map((geometry, i) => (
        <mesh key={i} geometry={geometry} position={[(i - 1) * 0.0445, 0, i === 1 ? 0.007 : 0]} rotation={[0, [0.32, -0.32, 0.32][i], 0]} castShadow>
          {[0, 1, 2, 3, 4, 5].map((face) => (
            <meshStandardMaterial key={face} attach={`material-${face}`} map={face === 4 ? art : null} color={face === 4 ? '#ffffff' : '#e8ddc2'} roughness={0.85} side={DoubleSide} />
          ))}
        </mesh>
      ))}
    </group>
  )
}

/** Four items per city, in the order: back left, back middle, back right, front. */
export function cityGoods(city: number) {
  if (city === 0)
    return [
      <Tin title="Bakery Treat" sub="NEW YORK · SAMPLE" color="#8c2f24" />,
      <Pouch title="House Roast" sub="COFFEE · SAMPLE" color="#143f3c" ink="#f3e9d7" />,
      <Jar title="Spice Blend" sub="NEW YORK · SAMPLE" />,
      <Booklet title="WALKING ROUTE" accent="#e8664e" />,
    ]
  if (city === 1)
    return [
      <Carton title="Snack Box" sub="LOS ANGELES" color="#c7771c" />,
      <Bottle title="Hot Sauce" sub="SAMPLE · L.A." />,
      <Print city={1} />,
      <Booklet title="CITY GUIDE" accent="#d9781f" />,
    ]
  return [
    <Carton title="Bakery Sweet" sub="MIAMI" color="#d6567a" />,
    <Pouch title="Coffee Blend" sub="MIAMI · SAMPLE" color="#157f78" ink="#f6fff9" />,
    <Print city={2} />,
    <Booklet title="CITY GUIDE" accent="#12897f" />,
  ]
}
