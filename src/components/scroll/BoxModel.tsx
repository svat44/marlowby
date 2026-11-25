import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, useGLTF } from '@react-three/drei'
import { MathUtils, Mesh, MeshStandardMaterial, type Group, type Object3D } from 'three'
import type { MotionValue } from 'motion/react'
import { makeLabel, makeLidPrint, type City } from './labelTexture'

const MODEL = '/models/marlowby-box.glb'
const GOODS = ['Good_Babka', 'Good_Cookies', 'Good_Zaatar', 'Good_Coffee', 'Good_Map'] as const
const RISE = [0.085, 0.1, 0.075, 0.095, 0.07] // metres each good lifts out of the tissue

/** Linear ramp of p across [a, b], clamped and eased (ease-out). */
function ramp(p: number, a: number, b: number) {
  const t = MathUtils.clamp((p - a) / (b - a), 0, 1)
  return 1 - Math.pow(1 - t, 3)
}

/** Keyframes the story's scroll progress drives. Kept in one place so the copy and the model agree. */
export const BEATS = {
  boxIn: [0.12, 0.26],
  lidOpen: [0.44, 0.56],
  goods: [0.5, 0.68],
  close: [0.72, 0.82],
} as const

function Box({ progress, city }: { progress: MotionValue<number>; city: City }) {
  const { scene } = useGLTF(MODEL)
  const root = useRef<Group>(null)
  const nodes = useMemo(() => {
    const get = (n: string) => scene.getObjectByName(n) as Object3D
    return { lid: get('Lid'), label: get('Label') as Mesh, print: get('LidPrint') as Mesh, goods: GOODS.map(get) }
  }, [scene])
  const rest = useMemo(() => nodes.goods.map((g) => g.position.y), [nodes])

  // Paint the label and lid print with the site's own fonts
  useEffect(() => {
    let alive = true
    Promise.all([makeLabel(city), makeLidPrint()]).then(([label, print]) => {
      if (!alive) return
      nodes.label.material = new MeshStandardMaterial({ map: label, roughness: 0.75 })
      nodes.print.material = new MeshStandardMaterial({ map: print, roughness: 0.9 })
    })
    scene.traverse((o) => {
      if ((o as Mesh).isMesh) o.castShadow = true
    })
    return () => {
      alive = false
    }
  }, [city, nodes, scene])

  useFrame((state) => {
    const p = progress.get()
    const r = root.current
    if (!r) return
    const appear = ramp(p, BEATS.boxIn[0], BEATS.boxIn[1])
    const open = ramp(p, BEATS.lidOpen[0], BEATS.lidOpen[1]) * (1 - ramp(p, BEATS.close[0], BEATS.close[1]))

    // Turn: three-quarter view, a swing during the city beat, front-on for the label at the end
    const swing = MathUtils.lerp(-0.75, 0.55, ramp(p, 0.16, 0.42))
    const settle = ramp(p, 0.72, 0.9)
    r.rotation.y = MathUtils.lerp(swing - 0.25 * ramp(p, 0.44, 0.66), -0.08, settle)
    r.rotation.x = MathUtils.lerp(0.42, 0.18, settle)
    r.scale.setScalar(MathUtils.lerp(0.62, 1, appear))
    // Drop a little while open so the heading above has room for the raised lid
    const dip = 0.05 * ramp(p, 0.42, 0.5) * (1 - ramp(p, 0.72, 0.8))
    r.position.y = -0.04 - dip + Math.sin(state.clock.elapsedTime * 0.9) * 0.004 * appear

    nodes.lid.rotation.x = -1.95 * open
    nodes.goods.forEach((g, i) => {
      const span = BEATS.goods[1] - BEATS.goods[0]
      const a = BEATS.goods[0] + (i * span) / 6
      const lift = ramp(p, a, a + span / 3) * (1 - ramp(p, BEATS.close[0] - 0.04, BEATS.close[0] + 0.02))
      g.position.y = rest[i] + RISE[i] * lift
    })
  })

  return (
    <group ref={root}>
      <primitive object={scene} />
    </group>
  )
}

/** Keep the box about the same share of the screen on wide and tall viewports. */
function CameraRig() {
  const { camera, size } = useThree()
  useEffect(() => {
    const aspect = size.width / size.height
    const z = aspect < 1 ? (1.5 / Math.max(aspect, 0.4)) * 0.92 : 1.5
    camera.position.set(0, (0.5 * z) / 1.5, z)
    // On tall screens aim lower so the box sits above the copy at the bottom
    camera.lookAt(0, aspect < 1 ? -0.05 : 0.04, 0)
  }, [camera, size])
  return null
}

export default function BoxCanvas({ progress, city }: { progress: MotionValue<number>; city: City }) {
  return (
    <Canvas
      className="story__canvas"
      dpr={[1, 1.75]}
      shadows
      camera={{ position: [0, 0.5, 1.5], fov: 30, near: 0.05, far: 10 }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <hemisphereLight args={['#f3e9d7', '#0a3634', 0.9]} />
      <directionalLight position={[0.6, 1.2, 0.8]} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-0.8, 0.4, -0.6]} intensity={0.6} color="#e8664e" />
      <CameraRig />
      <Box progress={progress} city={city} />
      <ContactShadows position={[0, -0.045, 0]} opacity={0.55} scale={1.4} blur={2.4} far={0.5} color="#061f1e" />
    </Canvas>
  )
}

useGLTF.preload(MODEL)
