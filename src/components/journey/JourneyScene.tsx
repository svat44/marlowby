import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import type { MotionValue } from 'motion/react'
import {
  ACESFilmicToneMapping, CatmullRomCurve3, Color, DirectionalLight, FogExp2, HemisphereLight, MathUtils, Mesh,
  PCFSoftShadowMap, PMREMGenerator, PointLight, SphereGeometry, Vector3, type Group,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { T } from './data'
import { Effects, type Glow } from './lib/Effects'
import { skyMaterial, skyReflections, type SkyLook } from './lib/sky'
import { seg, v, type V3 } from './lib/util'
import { Parcel } from './parts/Parcel'
import { flightPath, streetBox, truckX } from './path'
import { CityScene } from './scenes/CityScene'
import { FlightScene } from './scenes/FlightScene'
import { BOX_X, RoomScene } from './scenes/RoomScene'
import { StreetScene } from './scenes/StreetScene'

/* DRAFT: all scenery is generated in code. The team's Blender models can replace any part of it. */

const SKIES: SkyLook[] = [
  // golden hour over the city
  { top: '#1d2f63', mid: '#7a679c', horizon: '#ffae72', below: '#4a2f35', sun: '#ffb45e', sunDir: [-0.46, 0.1, -0.88], glow: 0.85, cloud: '#ff9f8a', cloudAmount: 0.75 },
  // high above the clouds
  { top: '#1c56a8', mid: '#6fabe0', horizon: '#dcecf8', below: '#a9c4dc', sun: '#fff1d0', sunDir: [0.45, 0.42, -0.79], glow: 0.35, cloud: '#ffffff', cloudAmount: 0.55 },
  // late afternoon on a quiet street
  { top: '#4579c2', mid: '#98bfe4', horizon: '#ffdcb4', below: '#6d7a52', sun: '#ffcf8c', sunDir: [-0.7, 0.28, -0.66], glow: 0.55, cloud: '#fff0e0', cloudAmount: 0.65 },
]

type Look = {
  fog: [string, number]
  sun: [string, number, V3]
  hemi: [string, string, number]
  environment: number
  exposure: number
  glow: Glow
  shadow: number
}

const LOOKS: Look[] = [
  { fog: ['#c98872', 0.0082], sun: ['#ffac62', 3.4, [-0.82, 0.4, -0.36]], hemi: ['#93a2ea', '#4a2c20', 1.0], environment: 0.95, exposure: 0.88, glow: { strength: 0.3, radius: 0.5, threshold: 1.15 }, shadow: 6 },
  { fog: ['#c4dcf0', 0.0052], sun: ['#fff0d4', 2.8, [0.45, 0.75, 0.5]], hemi: ['#cfe6ff', '#6f7f9c', 0.75], environment: 0.7, exposure: 0.84, glow: { strength: 0.14, radius: 0.4, threshold: 1.1 }, shadow: 8 },
  { fog: ['#ecd2b8', 0.011], sun: ['#ffd09a', 3.5, [-0.5, 0.62, 0.6]], hemi: ['#bcd4ff', '#6b5c3a', 0.95], environment: 0.75, exposure: 1.02, glow: { strength: 0.26, radius: 0.42, threshold: 1.05 }, shadow: 11 },
  { fog: ['#0d2b29', 0], sun: ['#ffdcae', 1.75, [-0.62, 0.7, 0.42]], hemi: ['#ffeeda', '#24160c', 0.42], environment: 0.3, exposure: 0.92, glow: { strength: 0.2, radius: 0.45, threshold: 1.15 }, shadow: 6 },
]

type StageProps = { progress: MotionValue<number>; picked: number | null; onPick: (i: number) => void }

function Stage({ progress, picked, onPick }: StageProps) {
  const gl = useThree((s) => s.gl)
  const sets = [useRef<Group>(null), useRef<Group>(null), useRef<Group>(null), useRef<Group>(null)]
  const dome = useRef<Mesh>(null)
  const hero = useRef<Group>(null)
  const lastSet = useRef(-1)
  const warmed = useRef(false)
  const roll = useRef(0)
  const glow = useRef<Glow>({ ...LOOKS[0].glow })
  const roomCam = useRef({ pos: v(0, 2.7, 7.6), look: v(0, 1.2, 0) })
  const look = useMemo(() => new Vector3(), [])

  const assets = useMemo(() => {
    const skies = SKIES.map(skyMaterial)
    const reflections = SKIES.map((s) => skyReflections(gl, s))
    const pmrem = new PMREMGenerator(gl)
    const room = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()
    return { skies, reflections: [...reflections, room], dome: new SphereGeometry(600, 48, 32) }
  }, [gl])

  // The same few lights serve every scene, so nothing has to be rebuilt between them.
  const lights = useMemo(() => {
    const sun = new DirectionalLight()
    sun.castShadow = true
    sun.shadow.mapSize.set(1536, 1536)
    sun.shadow.bias = -0.0004
    sun.shadow.normalBias = 0.025
    sun.shadow.radius = 4
    const hemi = new HemisphereLight()
    const lamps = [new PointLight('#ffbd70', 0, 9, 2), new PointLight('#ffc98a', 0, 9, 2)]
    return { sun, hemi, lamps }
  }, [])

  const flight = useMemo(
    () => new CatmullRomCurve3([v(0, 2.3, 41), v(0.75, 3.3, 31), v(-0.8, 2.5, 21), v(0.65, 4.2, 11), v(-0.15, 5.8, 2)]),
    [],
  )

  useFrame(({ camera, scene, size, clock }, dt) => {
    // Build every shader once up front so later scene changes don't stutter.
    if (!warmed.current) {
      sets.forEach((s) => (s.current!.visible = true))
      gl.compile(scene, camera)
      warmed.current = true
    }
    const p = progress.get()
    const set = p < T.explainEnd ? 0 : p < T.planeEnd ? 1 : p < T.insideAt ? 2 : 3
    const mood = LOOKS[set]

    if (lastSet.current !== set) {
      lastSet.current = set
      sets.forEach((s, i) => (s.current!.visible = i === set))
      if (!scene.fog) scene.fog = new FogExp2('#000000', 0)
      ;(scene.fog as FogExp2).color.set(mood.fog[0])
      scene.background = new Color(mood.fog[0])
      scene.environment = assets.reflections[set]
      scene.environmentIntensity = mood.environment
      gl.toneMappingExposure = mood.exposure
      Object.assign(glow.current, mood.glow)
      lights.sun.color.set(mood.sun[0])
      lights.sun.intensity = mood.sun[1]
      lights.hemi.color.set(mood.hemi[0])
      lights.hemi.groundColor.set(mood.hemi[1])
      lights.hemi.intensity = mood.hemi[2]
      lights.lamps[0].position.set(3.05, 1.9, -1.4)
      lights.lamps[1].position.set(-0.4, 3.4, 1.6)
      lights.lamps[0].intensity = set === 3 ? 5.5 : 0
      lights.lamps[1].intensity = set === 3 ? 3.2 : 0
      if (set === 2) {
        lights.lamps[0].position.set(0, 2.1, -4.9)
        lights.lamps[0].intensity = 5
      }
      const cam = lights.sun.shadow.camera
      cam.left = cam.bottom = -mood.shadow
      cam.right = cam.top = mood.shadow
      cam.near = 1
      cam.far = 60
      cam.updateProjectionMatrix()
      dome.current!.visible = set < 3
      // only the street and the room cast shadows, so skip that work elsewhere
      gl.shadowMap.autoUpdate = set >= 2
      gl.shadowMap.needsUpdate = true
      if (set < 3) dome.current!.material = assets.skies[set]
    }

    // Tall screens: pull the camera back from whatever it is looking at.
    const aspect = size.width / size.height
    const narrow = aspect < 0.8
    const back = aspect < 1.2 ? Math.min(1.2 / aspect, 2.1) : 1
    ;(scene.fog as FogExp2).density = mood.fog[1] / (set === 0 ? back : 1)
    let bank = 0
    let pull = back

    if (set === 0) {
      const fly = MathUtils.clamp(p / (T.droneEnd * 0.66), 0, 1)
      const out = seg(p, T.droneEnd * 0.58, T.droneEnd)
      flight.getPoint(fly, camera.position)
      flight.getPoint(Math.min(fly + 0.13, 1), look)
      // lean into each turn, the way a drone does
      bank = flight.getTangent(fly).x * 0.2 * (1 - out)
      if (fly > 0.84) look.lerp(v(0, 8, -44), seg(fly, 0.84, 1))
      const orbit = seg(p, T.droneEnd, T.explainEnd)
      camera.position.lerp(v(7 - orbit * 11, 23, 41), out)
      look.lerp(v(0, 5.5, -18), out)
    } else if (set === 1) {
      const f = flightPath(p)
      const sweep = f.fly
      // narrow screens switch their attention to the falling box sooner
      const fall = narrow ? Math.min(1, f.fall * 2.4) : f.fall
      camera.position.set(
        MathUtils.lerp(f.planeX + 3.6 - sweep * 6, f.box.x + 1.2, fall),
        MathUtils.lerp(2.5 - sweep * 0.8, f.box.y + 1.4, fall),
        MathUtils.lerp(10.4, 6.6, fall),
      )
      look.set(MathUtils.lerp(f.planeX * 0.92, f.box.x, fall), MathUtils.lerp(1.55, f.box.y + 0.65, fall), f.box.z * fall)
    } else if (set === 2) {
      const enter = seg(p, T.flingEnd + 0.012, T.insideAt)
      const turn = seg(p, T.driveEnd - 0.035, T.flingEnd - 0.012)
      const x = truckX(Math.min(p, T.driveEnd))
      const follow = v(x - 4.9, 2.25, 4.3)
      const front = v(1.75, 1.85, 2.5)
      camera.position.lerpVectors(follow, front, turn).lerp(v(0, 1.35, -3.75), enter)
      look.set(x + 0.4, 0.85, 0.6)
      const { at, fling } = streetBox(p)
      look.lerp(v(-0.1, 1.15, -3.4), turn)
      look.lerp(at, Math.sin(fling * Math.PI) * 0.45)
      look.lerp(v(0, 1.3, -6), enter)
      pull = MathUtils.lerp(Math.min(back, 1.6), 1, enter)
    } else {
      const arrive = seg(p, T.insideAt, T.chooseAt)
      const wide = { pos: v(0, 2.75, 6.7 + (1 - arrive) * 2.6), look: v(0, 1.28, 0) }
      const close = picked === null ? null : { pos: v(BOX_X[picked], 3.25, 3.35), look: v(BOX_X[picked], 1.72, 0) }
      const goal = close ?? wide
      const c = roomCam.current
      const k = 1 - Math.exp(-3.6 * Math.min(dt, 0.05))
      c.pos.lerp(goal.pos, k)
      c.look.lerp(goal.look, k)
      camera.position.copy(c.pos)
      camera.position.x += Math.sin(clock.elapsedTime * 0.23) * (picked === null ? 0.09 : 0.03)
      look.copy(c.look)
      if (picked !== null) pull = Math.min(back, narrow ? 1.5 : 1.35)
    }

    camera.position.sub(look).multiplyScalar(pull).add(look)
    camera.lookAt(look)
    // a touch of handheld life
    camera.position.y += Math.sin(clock.elapsedTime * 0.9) * 0.008
    roll.current = MathUtils.damp(roll.current, bank, 5, Math.min(dt, 0.05))
    camera.rotateZ(roll.current)
    // keep the open box clear of the list on phones
    if (set === 3 && picked !== null && narrow) camera.rotateX(-0.075)

    dome.current!.position.copy(camera.position)

    const focus = set === 1 ? flightPath(p).planeX : set === 2 ? MathUtils.clamp(truckX(p), -30, 2) : 0
    const away = lights.sun.position.set(...mood.sun[2]).normalize().multiplyScalar(24)
    lights.sun.target.position.set(focus, set === 3 ? 0.9 : 0, set === 2 ? -2 : 0)
    away.add(lights.sun.target.position)
    lights.sun.target.updateMatrixWorld()

    // the box that "holds all of this" rises in front of the pulled-out view
    const show = set === 0 ? seg(p, T.droneEnd + 0.025, T.droneEnd + 0.075) : 0
    const h = hero.current!
    h.visible = show > 0.01
    if (h.visible) {
      h.position.set(narrow ? 0 : 1.85, (narrow ? -2.35 : -2.05) + show * 0.55 + Math.sin(clock.elapsedTime) * 0.06, narrow ? -13 : -9)
      camera.updateMatrixWorld()
      camera.localToWorld(h.position)
      h.rotation.set(0.14, -0.62 + seg(p, T.droneEnd, T.explainEnd) * 0.9, 0)
      h.scale.setScalar(7.8 * show)
      // a soft key light so the box stands out against the skyline
      lights.lamps[0].position.set(narrow ? -1.6 : 0.2, 1.4, narrow ? -8.5 : -5)
      camera.localToWorld(lights.lamps[0].position)
    }
    if (set === 0) lights.lamps[0].intensity = 55 * show
  })

  return (
    <>
      <primitive object={lights.sun} />
      <primitive object={lights.hemi} />
      {lights.lamps.map((lamp) => (
        <primitive key={lamp.uuid} object={lamp} />
      ))}
      <mesh ref={dome} geometry={assets.dome} material={assets.skies[0]} renderOrder={-1} frustumCulled={false} />
      <group ref={sets[0]}>
        <CityScene />
      </group>
      <group ref={hero} visible={false}>
        <Parcel city={0} />
      </group>
      <group ref={sets[1]}>
        <FlightScene progress={progress} />
      </group>
      <group ref={sets[2]}>
        <StreetScene progress={progress} />
      </group>
      <group ref={sets[3]}>
        <RoomScene picked={picked} onPick={(i) => { if (progress.get() >= T.chooseAt - 0.02) onPick(i) }} />
      </group>
      <Effects glow={glow} />
    </>
  )
}

/** Surface art is lettered with the site's fonts, so wait for them before painting it. */
function useFonts() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    Promise.all(
      [
        "900 40px 'Charger Pro Extended'", "italic 500 40px 'Literata Variable'", "italic 600 40px 'Literata Variable'",
        "400 20px 'DM Mono'", "700 20px 'Trueno'",
      ].map((font) => document.fonts.load(font)),
    )
      .catch(() => undefined)
      .then(() => {
        if (alive) setReady(true)
      })
    return () => {
      alive = false
    }
  }, [])
  return ready
}

export default function JourneyCanvas(props: StageProps) {
  const ready = useFonts()
  const [sharpness, setSharpness] = useState(1.3)
  if (!ready) return null
  return (
    <Canvas
      className="journey__canvas"
      dpr={Math.min(window.devicePixelRatio, sharpness)}
      shadows={{ type: PCFSoftShadowMap }}
      gl={{ antialias: false, powerPreference: 'high-performance', toneMapping: ACESFilmicToneMapping }}
      camera={{ position: [0, 2.3, 41], fov: 42, near: 0.1, far: 1500 }}
      aria-hidden="true"
    >
      {/* slower computers get a slightly softer picture instead of choppy scrolling */}
      <PerformanceMonitor bounds={() => [48, 58]} onDecline={() => setSharpness((s) => Math.max(0.85, s - 0.15))} />
      <Stage {...props} />
    </Canvas>
  )
}
