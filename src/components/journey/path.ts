/* Where the moving things are at each scroll position, shared by the scenes and the camera. */
import { MathUtils } from 'three'
import { T } from './data'
import { seg, v } from './lib/util'

export function flightPath(p: number) {
  const fly = seg(p, T.explainEnd, T.planeEnd)
  const fall = seg(p, T.drop, T.planeEnd)
  const planeX = MathUtils.lerp(-7, 9, fly)
  const releaseX = MathUtils.lerp(-7, 9, seg(T.drop, T.explainEnd, T.planeEnd))
  const box = p < T.drop ? v(planeX, 0.7, 0) : v(releaseX + fall * 0.9, 0.7 - fall * 6.6, fall * 0.7)
  return { fall, fly, planeX, box }
}

export const PORCH = v(0.05, 0.31, -3.3)

export function truckX(p: number) {
  const arrive = seg(p, T.planeEnd, T.driveEnd)
  const leave = seg(p, T.driveEnd + 0.025, T.flingEnd + 0.02)
  return MathUtils.lerp(-24, -1.2, arrive) + leave * 17
}

/** The box rides in the truck bed, then arcs onto the porch. */
export function streetBox(p: number) {
  const fling = seg(p, T.driveEnd, T.flingEnd - 0.015)
  const from = v(truckX(Math.min(p, T.driveEnd)) - 0.95, 0.6, 1)
  const at = from.lerp(PORCH, fling)
  at.y += Math.sin(fling * Math.PI) * 2.1
  return { at, fling }
}
