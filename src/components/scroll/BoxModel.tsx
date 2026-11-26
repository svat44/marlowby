import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, useGLTF } from '@react-three/drei'
import { MathUtils, Mesh, MeshStandardMaterial, Vector3, type Group, type Object3D } from 'three'
import type { MotionValue } from 'motion/react'
import { makeLabel, makeLidPrint, type City } from './labelTexture'

const MODEL = '/models/marlowby-box.glb'
const GOODS = ['Good_Babka', 'Good_Cookies', 'Good_Zaatar', 'Good_Coffee', 'Good_Map'] as const
const RISE = [0.13, 0.155, 0.12, 0.145, 0.11] // metres each good lifts out of the tissue

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
  cameraUp: [0.42, 0.56],
  cameraBack: [0.72, 0.9],
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

  useFrame(() => {
    const p = progress.get()
    const r = root.current
    if (!r) return
    const appear = ramp(p, BEATS.boxIn[0], BEATS.boxIn[1])
    const open = ramp(p, BEATS.lidOpen[0], BEATS.lidOpen[1]) * (1 - ramp(p, BEATS.close[0], BEATS.close[1]))

    // The box stays put, facing forward; CameraRig does the moving
    r.scale.setScalar(MathUtils.lerp(0.62, 1, appear))

    nodes.lid.rotation.x = -1.95 * open
    nodes.goods.forEach((g, i) => {
      const span = BEATS.goods[1] - BEATS.goods[0]
      const a = BEATS.goods[0] + (i * span) / 6
      const lift = ramp(p, a, a + span / 3) * (1 - ramp(p, BEATS.close[0] - 0.04, BEATS.close[0] + 0.02))
      g.position.y = rest[i] + RISE[i] * lift
    })
  })

  return (
    <group ref={root} position-y={-0.04}>
      <primitive object={scene} />
    </group>
  )
}

/** Camera keyframes: straight-on at eye level, and up in front looking about 48° down into the box. */
const EYE = { position: new Vector3(0, 0.12, 1.5), target: new Vector3(0, 0.04, 0) }
const ABOVE = { position: new Vector3(0, 1.62, 1.49), target: new Vector3(0, 0.09, 0.03) }

function CameraRig({ progress }: { progress: MotionValue<number> }) {
  const target = useMemo(() => new Vector3(), [])

  useFrame(({ camera, size, clock }) => {
    const p = progress.get()
    const up =
      ramp(p, BEATS.cameraUp[0], BEATS.cameraUp[1]) * (1 - ramp(p, BEATS.cameraBack[0], BEATS.cameraBack[1]))
    camera.position.lerpVectors(EYE.position, ABOVE.position, up)
    target.lerpVectors(EYE.target, ABOVE.target, up)
    // Very slow idle drift, only while facing the box straight on
    camera.position.x += Math.sin(clock.elapsedTime * 0.25) * 0.015 * (1 - up)

    // On tall screens pull back so the box keeps its share of the frame, and aim lower to lift it above the copy
    const aspect = size.width / size.height
    if (aspect < 1) {
      camera.position.sub(target).multiplyScalar((0.92 / Math.max(aspect, 0.4)))
      target.y -= 0.09 + 0.09 * up
      camera.position.add(target)
    }
    camera.lookAt(target)
  })
  return null
}

export default function BoxCanvas({ progress, city }: { progress: MotionValue<number>; city: City }) {
  return (
    <Canvas
      className="story__canvas"
      dpr={[1, 1.75]}
      shadows
      camera={{ position: [0, 0.12, 1.5], fov: 30, near: 0.05, far: 10 }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <hemisphereLight args={['#f3e9d7', '#0a3634', 0.9]} />
      <directionalLight position={[0.6, 1.2, 0.8]} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-0.8, 0.4, -0.6]} intensity={0.6} color="#e8664e" />
      <CameraRig progress={progress} />
      <Box progress={progress} city={city} />
      <ContactShadows position={[0, -0.045, 0]} opacity={0.55} scale={1.4} blur={2.4} far={0.5} color="#061f1e" />
    </Canvas>
  )
}

useGLTF.preload(MODEL)
