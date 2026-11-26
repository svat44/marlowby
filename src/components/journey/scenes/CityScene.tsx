import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending, BoxGeometry, Color, ConeGeometry, CylinderGeometry, InstancedBufferAttribute, Matrix4,
  MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry, SphereGeometry, type InstancedMesh,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { NOISE_GLSL } from '../lib/sky'
import { softShadow } from '../lib/textures'
import { instanced, rng, type Inst, type V3 } from '../lib/util'

/* A golden-hour city built from code: reflective towers with thousands of windows, streets, and moving traffic. */

type Tower = { at: V3; size: V3; style: number; color: string; seed: number }

/** One material draws every window on every tower, so they stay sharp up close and calm far away. */
function facadeMaterial() {
  const material = new MeshStandardMaterial({ roughness: 0.85, metalness: 0.05 })
  material.onBeforeCompile = (shader) => {
    shader.vertexShader =
      'attribute vec2 aInfo;\nvarying vec3 vW;\nvarying vec3 vFace;\nvarying vec2 vInfo;\n' +
      shader.vertexShader.replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>
         vec4 wp = vec4(transformed, 1.0);
         #ifdef USE_INSTANCING
           wp = instanceMatrix * wp;
         #endif
         vW = (modelMatrix * wp).xyz;
         vFace = normal;
         vInfo = aInfo;`,
      )
    shader.fragmentShader =
      `varying vec3 vW;\nvarying vec3 vFace;\nvarying vec2 vInfo;\n${NOISE_GLSL}\n` +
      shader.fragmentShader
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
           float roof = step(0.5, abs(vFace.y));
           float along = abs(vFace.x) > 0.5 ? vW.z : vW.x;
           float style = floor(vInfo.y + 0.5);
           vec2 cell = style == 1.0 ? vec2(0.2, 0.27) : (style == 2.0 ? vec2(0.55, 0.3) : vec2(0.27, 0.34));
           vec2 lo = style == 1.0 ? vec2(0.06, 0.07) : (style == 2.0 ? vec2(0.02, 0.36) : vec2(0.23, 0.2));
           vec2 hi = style == 1.0 ? vec2(0.94, 0.93) : (style == 2.0 ? vec2(0.98, 0.86) : vec2(0.77, 0.8));
           vec2 grid = vec2(along, vW.y) / cell;
           vec2 id = floor(grid), f = fract(grid);
           vec2 aa = max(fwidth(grid), vec2(0.001));
           vec2 inside = smoothstep(lo - aa, lo + aa, f) * (1.0 - smoothstep(hi - aa, hi + aa, f));
           float far = clamp(max(aa.x, aa.y) * 2.4 - 0.5, 0.0, 1.0);
           float coverage = (hi.x - lo.x) * (hi.y - lo.y);
           float win = mix(inside.x * inside.y, coverage, far) * (1.0 - roof);
           float pick = mHash(id + vec2(vInfo.x * 17.0, dot(vFace, vec3(3.0, 0.0, 7.0))));
           float floorLit = step(0.9, mHash(vec2(id.y, vInfo.x * 3.0)));
           float lit = max(step(0.78, pick), floorLit * step(0.25, pick));
           lit = mix(lit, 0.24, far);
           vec3 wall = diffuseColor.rgb * (0.9 + 0.2 * mNoise(vec2(along, vW.y) * 3.0));
           wall *= 1.0 - 0.22 * (1.0 - smoothstep(0.0, 0.08, fract(vW.y / (cell.y * 4.0)))) * (1.0 - far);
           vec3 glass = mix(vec3(0.07, 0.11, 0.16), vec3(0.2, 0.25, 0.3), mHash(vec2(vInfo.x, 2.0)));
           glass *= 0.8 + 0.4 * mHash(id * 1.7 + vInfo.x) * (1.0 - far);
           diffuseColor.rgb = mix(wall, glass, win);
           diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.045, 0.045, 0.05) + 0.03 * mNoise(vW.xz * 5.0), roof);
           diffuseColor.rgb *= mix(0.34, 1.0, smoothstep(0.0, 3.2, vW.y));`,
        )
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n roughnessFactor = mix(0.86, 0.16, win);')
        .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\n metalnessFactor = mix(0.04, 0.88, win);')
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
           vec3 lamp = mix(vec3(1.0, 0.62, 0.26), vec3(0.72, 0.86, 1.0), step(0.86, mHash(id + 4.2)));
           float strength = 0.34 + 0.9 * mHash(id * 2.3 + vInfo.x);
           totalEmissiveRadiance += lamp * win * lit * strength;
           float shop = (1.0 - smoothstep(0.24, 0.34, vW.y)) * (1.0 - roof) * step(0.25, mHash(floor(vec2(along * 2.2, vInfo.x))));
           totalEmissiveRadiance += vec3(1.0, 0.7, 0.36) * shop * 1.1;`,
        )
  }
  return material
}

function groundMaterial() {
  const material = new MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 })
  material.onBeforeCompile = (shader) => {
    shader.vertexShader =
      'varying vec3 vW;\n' +
      shader.vertexShader.replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\n vW = (modelMatrix * vec4(transformed, 1.0)).xyz;')
    shader.fragmentShader =
      `varying vec3 vW;\n${NOISE_GLSL}\n` +
      shader.fragmentShader
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
           float x = abs(vW.x);
           float cz = abs(mod(vW.z + 6.0, 12.0) - 6.0);          // distance from the nearest cross street
           vec2 aw = fwidth(vW.xz) + 0.002;
           float avenue = 1.0 - smoothstep(1.55 - aw.x, 1.55 + aw.x, x);
           float cross = 1.0 - smoothstep(1.2 - aw.y, 1.2 + aw.y, cz);
           float road = max(avenue, cross);
           float column = abs(mod(x - 3.7 + 1.65, 3.3) - 1.65);  // lanes between building columns
           float alley = (1.0 - smoothstep(0.18, 0.24, abs(column - 1.65))) * step(4.5, x);
           road = max(road, alley);
           vec3 tar = vec3(0.028, 0.029, 0.034) + 0.022 * mNoise(vW.xz * 9.0) + 0.012 * mNoise(vW.xz * 1.3);
           vec3 walk = vec3(0.19, 0.17, 0.155) + 0.04 * mNoise(vW.xz * 6.0);
           walk *= 1.0 - 0.18 * (1.0 - smoothstep(0.0, 0.03, abs(fract(vW.z * 2.0) - 0.5)));
           diffuseColor.rgb = mix(walk, tar, road);
           float yellow = 1.0 - smoothstep(0.014, 0.014 + aw.x, abs(x - 0.035));
           float dash = (1.0 - smoothstep(0.014, 0.014 + aw.x, abs(x - 0.74))) * step(0.45, fract(vW.z * 0.9));
           float stripe = step(0.5, fract(vW.x * 4.2)) * (1.0 - smoothstep(0.2, 0.24, abs(cz - 1.55))) * (1.0 - step(1.45, x));
           diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.72, 0.45, 0.07), yellow * avenue * (1.0 - cross));
           diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.55, 0.54, 0.5), max(dash * avenue * (1.0 - cross), stripe));`,
        )
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n roughnessFactor = mix(0.92, 0.5, road);')
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
           float pool = exp(-length(vec2(x - 1.75, abs(mod(vW.z, 2.4) - 1.2))) * 3.2);
           totalEmissiveRadiance += vec3(1.0, 0.6, 0.24) * pool * 0.34;`,
        )
  }
  return material
}

function buildTowers() {
  const r = rng(7)
  const towers: Tower[] = []
  const caps: Inst[] = []
  const tanks: V3[] = []
  const spires: V3[] = []
  const stone = ['#b39a82', '#8d6f60', '#c8b6a0', '#9a5a45', '#6f6a70', '#d3c5ac']
  const steel = ['#536273', '#3f4b5a', '#7d8894', '#2f3d4d']
  const pick = <T,>(list: T[]) => list[Math.floor(r() * list.length)]

  const add = (x: number, z: number, w: number, d: number, h: number) => {
    const style = h > 6.5 && r() > 0.3 ? 1 : r() > 0.76 ? 2 : 0
    const color = style === 1 ? pick(steel) : pick(stone)
    const seed = r() * 40
    if (h > 6 && r() > 0.35) {
      const parts = [0.64, 0.24, 0.12]
      let y = 0
      parts.forEach((share, i) => {
        const k = [1, 0.74, 0.48][i]
        towers.push({ at: [x, y, z], size: [w * k, h * share, d * k], style, color, seed })
        y += h * share
        caps.push({ p: [x, y + 0.03, z], s: [w * k + 0.07, 0.06, d * k + 0.07], c: color })
      })
      if (r() > 0.45) spires.push([x, h, z])
    } else {
      towers.push({ at: [x, 0, z], size: [w, h, d], style, color, seed })
      caps.push({ p: [x, h + 0.04, z], s: [w + 0.06, 0.08, d + 0.06], c: color })
      for (let i = 0; i < 3; i++)
        if (r() > 0.4)
          caps.push({ p: [x + (r() - 0.5) * w * 0.6, h + 0.16, z + (r() - 0.5) * d * 0.6], s: [0.2 + r() * 0.35, 0.18 + r() * 0.2, 0.2 + r() * 0.3], c: '#77716c' })
      if (h < 7 && r() > 0.68) tanks.push([x + w * 0.24, h, z - d * 0.22])
    }
  }

  for (let c = 0; c < 15; c++)
    for (const side of [-1, 1])
      for (let row = -30; row <= 16; row++) {
        if (((row % 4) + 4) % 4 === 0) continue // cross street
        const x = side * (3.7 + c * 3.3)
        const z = row * 3
        const downtown = Math.exp(-((z + 34) ** 2) / 420 - (x * x) / 380)
        const h = 1.4 + r() * r() * 5.5 + (c < 2 ? 2.2 + r() * 2.4 : 0) + downtown * (3 + r() * 9)
        add(x, z + (r() - 0.5) * 0.2, 2.05 + r() * 0.6, 2.1 + r() * 0.55, h)
      }
  // a hazy skyline far behind
  for (let i = 0; i < 260; i++)
    add((r() - 0.5) * 230, -96 - r() * 80, 2 + r() * 3, 2 + r() * 3, 3 + r() * r() * 17)
  return { towers, caps, tanks, spires }
}

/** The tower the drone flies toward at the end of the avenue. */
function Landmark({ facade }: { facade: MeshStandardMaterial }) {
  const body = useMemo(() => {
    const parts: [number, number, number][] = [[3.6, 7, 3.2], [2.8, 4.2, 2.5], [2.1, 2.8, 1.9], [1.5, 1.6, 1.35]]
    let y = 0
    const list: Tower[] = parts.map(([w, h, d], i) => {
      const t: Tower = { at: [0, y, -44], size: [w, h, d], style: i < 2 ? 0 : 1, color: '#d8c4a4', seed: 11 }
      y += h
      return t
    })
    return towerMesh(list, facade)
  }, [facade])
  return (
    <group>
      <primitive object={body} />
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 15.9 + i * 0.44, -44]} rotation={[0, Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.74 - i * 0.17, 0.9 - i * 0.17, 0.42, 4]} />
          <meshStandardMaterial color="#e6c27a" metalness={0.95} roughness={0.25} emissive="#ffb347" emissiveIntensity={0.35} />
        </mesh>
      ))}
      <mesh position={[0, 18.9, -44]}>
        <cylinderGeometry args={[0.015, 0.11, 2.8, 8]} />
        <meshStandardMaterial color="#f0dcae" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, 20.34, -44]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#ff5a3c" emissive="#ff5a3c" emissiveIntensity={6} />
      </mesh>
    </group>
  )
}

function towerMesh(list: Tower[], material: MeshStandardMaterial) {
  const geometry = new BoxGeometry(1, 1, 1)
  geometry.translate(0, 0.5, 0)
  geometry.setAttribute('aInfo', new InstancedBufferAttribute(new Float32Array(list.flatMap((t) => [t.seed, t.style])), 2))
  return instanced(geometry, material, list.map((t) => ({ p: t.at, s: t.size, c: t.color })))
}

type Car = { lane: number; offset: number; speed: number; cross: boolean }

/** Cars with glowing head and tail lights. */
function Traffic() {
  const body = useRef<InstancedMesh>(null)
  const heads = useRef<InstancedMesh>(null)
  const tails = useRef<InstancedMesh>(null)
  const { cars, shapes } = useMemo(() => {
    const r = rng(51)
    const cars: Car[] = []
    for (let i = 0; i < 46; i++) cars.push({ lane: [-1.12, -0.4, 0.4, 1.12][i % 4], offset: r() * 120, speed: 1.1 + r() * 0.9, cross: false })
    for (let i = 0; i < 60; i++) cars.push({ lane: (Math.floor(r() * 10) - 7) * 12 + (i % 2 ? 0.45 : -0.45), offset: r() * 90, speed: 1 + r(), cross: true })
    return {
      cars,
      shapes: {
        body: new RoundedBoxGeometry(0.24, 0.13, 0.5, 2, 0.05),
        light: new BoxGeometry(0.2, 0.035, 0.025),
        paint: new MeshStandardMaterial({ roughness: 0.3, metalness: 0.6 }),
        white: new MeshBasicMaterial({ color: new Color(5, 4.2, 2.8), toneMapped: false }),
        red: new MeshBasicMaterial({ color: new Color(4, 0.25, 0.12), toneMapped: false }),
      },
    }
  }, [])
  const colors = useMemo(() => ['#e8b23a', '#e8b23a', '#23272e', '#d9d6cf', '#8f2f25', '#2c4a63'].map((c) => new Color(c)), [])
  const m = useMemo(() => new Matrix4(), [])
  const turn = useMemo(() => new Matrix4(), [])
  const painted = useRef(false)

  useFrame(({ clock }) => {
    if (!body.current || !heads.current || !tails.current) return
    cars.forEach((car, i) => {
      const dir = car.lane % 12 > 0 || (!car.cross && car.lane > 0) ? -1 : 1
      const span = car.cross ? 90 : 120
      const along = (((car.offset + clock.elapsedTime * car.speed * dir) % span) + span) % span
      const x = car.cross ? along - 45 : car.lane
      const z = car.cross ? car.lane : along - 80
      turn.makeRotationY(car.cross ? Math.PI / 2 : 0)
      const place = (mesh: InstancedMesh, forward: number, y: number) => {
        m.copy(turn).setPosition(x + (car.cross ? forward * dir : 0), y, z + (car.cross ? 0 : forward * dir))
        mesh.setMatrixAt(i, m)
      }
      place(body.current!, 0, 0.1)
      place(heads.current!, 0.255, 0.1)
      place(tails.current!, -0.255, 0.11)
      if (!painted.current) body.current!.setColorAt(i, colors[i % colors.length])
    })
    painted.current = true
    for (const ref of [body, heads, tails]) ref.current!.instanceMatrix.needsUpdate = true
    if (body.current.instanceColor) body.current.instanceColor.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={body} args={[shapes.body, shapes.paint, cars.length]} frustumCulled={false} />
      <instancedMesh ref={heads} args={[shapes.light, shapes.white, cars.length]} frustumCulled={false} />
      <instancedMesh ref={tails} args={[shapes.light, shapes.red, cars.length]} frustumCulled={false} />
    </group>
  )
}

export function CityScene() {
  const city = useMemo(() => {
    const facade = facadeMaterial()
    const { towers, caps, tanks, spires } = buildTowers()
    const wood = new MeshStandardMaterial({ color: '#6d4a33', roughness: 0.9 })
    const dark = new MeshStandardMaterial({ color: '#2b2d31', roughness: 0.6, metalness: 0.6 })
    const meshes = [
      towerMesh(towers, facade),
      instanced(new BoxGeometry(1, 1, 1), new MeshStandardMaterial({ roughness: 0.8 }), caps),
      instanced(new CylinderGeometry(0.2, 0.2, 0.34, 14), wood, tanks.map(([x, y, z]) => ({ p: [x, y + 0.4, z] }))),
      instanced(new ConeGeometry(0.23, 0.17, 14), dark, tanks.map(([x, y, z]) => ({ p: [x, y + 0.65, z] }))),
      instanced(new BoxGeometry(0.28, 0.24, 0.28), dark, tanks.map(([x, y, z]) => ({ p: [x, y + 0.12, z] }))),
      instanced(new CylinderGeometry(0.008, 0.05, 1.8, 6), dark, spires.map(([x, y, z]) => ({ p: [x, y + 0.9, z] }))),
    ]
    const lampPosts: Inst[] = []
    const bulbs: Inst[] = []
    const trees: Inst[] = []
    for (let z = -84; z < 48; z += 2.4)
      for (const x of [-1.78, 1.78]) {
        lampPosts.push({ p: [x, 0.27, z] })
        bulbs.push({ p: [x, 0.56, z] })
        trees.push({ p: [x * 1.17, 0.27, z + 1.2], s: [1, 1.15, 1] })
      }
    meshes.push(
      instanced(new CylinderGeometry(0.012, 0.018, 0.54, 6), dark, lampPosts),
      instanced(new SphereGeometry(0.036, 8, 8), new MeshBasicMaterial({ color: new Color(6, 3.8, 1.7), toneMapped: false }), bulbs),
      instanced(new SphereGeometry(0.19, 10, 8), new MeshStandardMaterial({ color: '#41592f', roughness: 1, flatShading: true }), trees),
    )
    return { facade, meshes, ground: groundMaterial() }
  }, [])
  const plane = useMemo(() => new PlaneGeometry(420, 420), [])
  const haze = useMemo(
    () => new MeshBasicMaterial({ map: softShadow(), color: '#ffb066', transparent: true, opacity: 0.0, blending: AdditiveBlending, depthWrite: false }),
    [],
  )

  return (
    <group>
      <mesh geometry={plane} material={city.ground} rotation={[-Math.PI / 2, 0, 0]} />
      <mesh geometry={plane} material={haze} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.3, -40]} />
      {city.meshes.map((mesh, i) => (
        <primitive key={i} object={mesh} />
      ))}
      <Landmark facade={city.facade} />
      <Traffic />
    </group>
  )
}
