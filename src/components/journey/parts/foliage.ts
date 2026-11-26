import { DoubleSide, MeshStandardMaterial, PlaneGeometry } from 'three'
import { leaves } from '../lib/textures'
import { instanced, rng, type Inst, type V3 } from '../lib/util'

export type Clump = { at: V3; size: V3; cards: number; card: number }

/** Thousands of small leaf cards scattered through each clump make natural-looking crowns and bushes. */
export function foliage(clumps: Clump[], seed: number) {
  const r = rng(seed)
  const list: Inst[] = []
  const tints = ['#ffffff', '#e4f2c4', '#c7ddb0', '#fff0bc', '#a9c79c']
  clumps.forEach((c) => {
    for (let i = 0; i < c.cards; i++) {
      const u = r() * 2 - 1
      const a = r() * Math.PI * 2
      const k = 0.55 + Math.pow(r(), 0.4) * 0.45
      const flat = Math.sqrt(1 - u * u)
      const s = c.card * (0.7 + r() * 0.6)
      list.push({
        p: [c.at[0] + Math.cos(a) * flat * k * c.size[0], c.at[1] + u * k * c.size[1], c.at[2] + Math.sin(a) * flat * k * c.size[2]],
        s: [s, s, s],
        r: [(r() - 0.5) * 2.2, r() * Math.PI * 2, (r() - 0.5) * 2.2],
        c: tints[Math.floor(r() * tints.length)],
      })
    }
  })
  const material = new MeshStandardMaterial({
    map: leaves(),
    alphaTest: 0.45,
    side: DoubleSide,
    roughness: 0.75,
    emissive: '#2c4417',
    emissiveIntensity: 0.22,
  })
  return instanced(new PlaneGeometry(1, 1), material, list, { cast: true, receive: true })
}
