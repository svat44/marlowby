import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { MotionValue } from 'motion/react'
import {
  BufferGeometry, Color, DoubleSide, Float32BufferAttribute, MathUtils,
  ShaderMaterial, SphereGeometry, Sprite, SpriteMaterial, Vector3, type Group,
} from 'three'
import { T } from '../data'
import { NOISE_GLSL } from '../lib/sky'
import { puff } from '../lib/textures'
import { rng, seg } from '../lib/util'
import { Aircraft } from '../parts/Aircraft'
import { Parcel } from '../parts/Parcel'
import { flightPath } from '../path'

/** The solid-looking cloud floor far below, with glimpses of land through the gaps. */
function CloudSea() {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { time: { value: 0 }, horizon: { value: new Color('#b7d4ee') } },
        vertexShader: /* glsl */ `
          varying vec3 vW;
          void main() {
            vec4 w = modelMatrix * vec4(position, 1.0);
            vW = w.xyz;
            gl_Position = projectionMatrix * viewMatrix * w;
          }`,
        fragmentShader: /* glsl */ `
          uniform float time;
          uniform vec3 horizon;
          varying vec3 vW;
          ${NOISE_GLSL}
          void main() {
            vec2 p = vW.xz * 0.065 + vec2(time * 0.012, 0.0);
            float n = mFbm(p + mFbm(p * 1.9) * 0.9);
            float lightSide = mFbm(p + mFbm(p * 1.9) * 0.9 + vec2(0.09, 0.11));
            vec3 cloud = mix(vec3(0.34, 0.46, 0.66), vec3(0.93, 0.9, 0.86), clamp(0.55 + (n - lightSide) * 5.5, 0.0, 1.0));
            float ground = mFbm(vW.xz * 0.12 + 11.0);
            vec3 land = mix(vec3(0.035, 0.11, 0.2), vec3(0.075, 0.18, 0.16), smoothstep(0.42, 0.54, ground));
            land = mix(land, vec3(0.2, 0.23, 0.16), smoothstep(0.55, 0.68, mFbm(vW.xz * 0.31)) * smoothstep(0.46, 0.56, ground));
            vec3 col = mix(land, cloud, smoothstep(0.36, 0.56, n));
            float dist = length(vW.xz - cameraPosition.xz);
            col = mix(col, horizon, smoothstep(30.0, 230.0, dist));
            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
      }),
    [],
  )
  useFrame(({ clock }) => {
    material.uniforms.time.value = clock.elapsedTime
  })
  return (
    <mesh material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, -15, -150]}>
      <planeGeometry args={[900, 700]} />
    </mesh>
  )
}

/** Banks of soft puffs at different depths, so they slide past each other as the plane flies. */
function CloudBanks() {
  const sprites = useMemo(() => {
    const r = rng(61)
    const materials = [0, 1, 2, 3].map(
      (i) => new SpriteMaterial({ map: puff(i), transparent: true, depthWrite: false, opacity: 0.92, rotation: (i - 1.5) * 0.08 }),
    )
    const banks: [number, number, number, number][] = [
      [-17, -2.5, -13, 4.2], [-6, -6.5, -9, 3.6], [4, -3.8, -17, 4.8], [14, -1.4, -14, 3.8], [23, -5, -10, 3.4],
      [-12, 4.8, -24, 4], [10, 6.5, -30, 5], [-2, -9, -4, 3.4], [9, -8.2, -3, 2.8], [-14, -8, -2, 3],
      [30, 1, -26, 5.5], [-30, 0, -28, 6], [1, -1, -34, 6.5], [-9, -5.6, 3.4, 1.6], [13, -5.2, 3, 1.5],
    ]
    const list: Sprite[] = []
    for (const [x, y, z, size] of banks)
      for (let i = 0; i < 22; i++) {
        const s = new Sprite(materials[Math.floor(r() * 4)])
        const dx = (r() - 0.5) * 2
        const lift = (1 - dx * dx) * r()
        s.position.set(x + dx * size * 1.35, y + (lift - 0.28) * size * 0.55, z + (r() - 0.5) * size * 0.6)
        const k = size * (0.42 + r() * 0.62) * (1 - Math.abs(dx) * 0.35)
        s.scale.set(k * 1.25, k * 0.86, 1)
        list.push(s)
      }
    return list
  }, [])
  return (
    <>
      {sprites.map((s) => (
        <primitive key={s.uuid} object={s} />
      ))}
    </>
  )
}

/** A gored parachute canopy with alternating coral and cream panels. */
function Parachute() {
  const { canopy, lines } = useMemo(() => {
    const gores = 14
    const g = new SphereGeometry(0.82, gores * 8, 18, 0, Math.PI * 2, 0, Math.PI * 0.46).toNonIndexed()
    const pos = g.attributes.position
    const colors: number[] = []
    const coral = new Color('#e8664e')
    const cream = new Color('#f6ead2')
    const p = new Vector3()
    for (let i = 0; i < pos.count; i++) {
      p.fromBufferAttribute(pos, i)
      const angle = Math.atan2(p.z, p.x) + Math.PI
      const down = Math.acos(MathUtils.clamp(p.y / p.length(), -1, 1)) / (Math.PI * 0.46)
      const bulge = Math.abs(Math.sin((angle * gores) / 2))
      p.multiplyScalar(1 + bulge * 0.085 * down)
      p.y = p.y * 0.8 + bulge * 0.05 * down ** 3
      pos.setXYZ(i, p.x, p.y, p.z)
    }
    for (let i = 0; i < pos.count; i += 3) {
      let cx = 0
      let cz = 0
      for (let k = 0; k < 3; k++) {
        cx += pos.getX(i + k)
        cz += pos.getZ(i + k)
      }
      const gore = Math.floor(((Math.atan2(cz, cx) + Math.PI) / (Math.PI * 2)) * gores) % gores
      const c = gore % 2 ? cream : coral
      for (let k = 0; k < 3; k++) colors.push(c.r, c.g, c.b)
    }
    g.setAttribute('color', new Float32BufferAttribute(colors, 3))
    g.computeVertexNormals()
    const rim = 0.82 * Math.sin(Math.PI * 0.46)
    const rimY = 0.82 * Math.cos(Math.PI * 0.46) * 0.8
    const points: number[] = []
    for (let i = 0; i < gores; i++) {
      const a = (i / gores) * Math.PI * 2
      points.push(Math.cos(a) * rim, rimY, Math.sin(a) * rim, Math.cos(a) > 0 ? 0.36 : -0.36, -0.9, Math.sin(a) > 0 ? 0.26 : -0.26)
    }
    const lines = new BufferGeometry()
    lines.setAttribute('position', new Float32BufferAttribute(points, 3))
    return { canopy: g, lines }
  }, [])
  return (
    <group>
      <mesh geometry={canopy} position={[0, 0.9, 0]} castShadow>
        <meshStandardMaterial vertexColors side={DoubleSide} roughness={0.62} emissive="#5a2a18" emissiveIntensity={0.16} />
      </mesh>
      <lineSegments geometry={lines} position={[0, 0.9, 0]}>
        <lineBasicMaterial color="#2b3436" />
      </lineSegments>
    </group>
  )
}

export function FlightScene({ progress }: { progress: MotionValue<number> }) {
  const plane = useRef<Group>(null)
  const drop = useRef<Group>(null)
  const chute = useRef<Group>(null)
  const drift = useRef<Group>(null)
  const contrail = useMemo(() => {
    const m = new SpriteMaterial({ map: puff(2), transparent: true, depthWrite: false, opacity: 0.13 })
    return [-1.5, 1.5].flatMap((z) =>
      Array.from({ length: 70 }, (_, i) => {
        const s = new Sprite(m)
        s.position.set(-0.4 - i * 0.075, -0.52 + Math.sin(i * 2.1) * 0.006, z)
        s.scale.setScalar(0.12 + i * 0.0062)
        return s
      }),
    )
  }, [])

  useFrame(({ clock }) => {
    const p = progress.get()
    const t = clock.elapsedTime
    const f = flightPath(p)
    const body = plane.current!
    body.position.set(f.planeX, 1.35 + Math.sin(t * 1.2) * 0.07, 0)
    body.rotation.set(0.07 + Math.sin(t * 0.8) * 0.018, -0.42, 0.035 + seg(p, T.drop - 0.04, T.drop + 0.03) * 0.05)
    drift.current!.position.x = -f.fly * 7
    const out = seg(p, T.drop - 0.008, T.drop + 0.012)
    const d = drop.current!
    d.visible = out > 0.001
    d.position.copy(f.box)
    d.scale.setScalar(MathUtils.lerp(0.35, 1, out))
    d.rotation.set(Math.sin(t * 1.9) * 0.05, -0.45 + f.fall * 0.9, Math.sin(f.fall * 11) * 0.11)
    chute.current!.scale.setScalar(Math.max(0.001, seg(p, T.drop + 0.014, T.drop + 0.04)))
  })

  return (
    <group>
      <CloudSea />
      <group ref={drift}>
        <CloudBanks />
      </group>
      <group ref={plane}>
        <Aircraft />
        {contrail.map((s) => (
          <primitive key={s.uuid} object={s} />
        ))}
      </group>
      <group ref={drop}>
        <group position={[0, -0.28, 0]} scale={2.5}>
          <Parcel />
        </group>
        <group ref={chute} position={[0, 0.18, 0]}>
          <Parachute />
        </group>
      </group>
    </group>
  )
}
