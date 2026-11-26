/* Every surface in the journey is painted here in code, so nothing needs to be downloaded or credited. */
import { CanvasTexture, NoColorSpace, RepeatWrapping, SRGBColorSpace, type Texture } from 'three'
import { rng } from './util'

type G = CanvasRenderingContext2D
type Draw = (g: G, w: number, h: number) => void
const cache = new Map<string, CanvasTexture>()

function tex(key: string, w: number, h: number, draw: Draw, opts: { data?: boolean; repeat?: boolean } = {}) {
  const hit = cache.get(key)
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!, w, h)
  const t = new CanvasTexture(c)
  t.colorSpace = opts.data ? NoColorSpace : SRGBColorSpace
  t.anisotropy = 8
  if (opts.repeat) t.wrapS = t.wrapT = RepeatWrapping
  cache.set(key, t)
  return t
}

export function tiled(t: Texture, x: number, y: number) {
  const copy = t.clone()
  copy.wrapS = copy.wrapT = RepeatWrapping
  copy.repeat.set(x, y)
  copy.needsUpdate = true
  return copy
}

const DISPLAY = "'Charger Pro Extended', 'Arial Black', sans-serif"
const SERIF = "'Literata Variable', Georgia, serif"
const MONO = "'DM Mono', monospace"
const BODY = "'Trueno', sans-serif"

/* ---------- noise helpers ---------- */
function speckle(g: G, w: number, h: number, seed: number, count: number, colors: string[], size = 1.6) {
  const r = rng(seed)
  for (let i = 0; i < count; i++) {
    g.fillStyle = colors[Math.floor(r() * colors.length)]
    const s = 0.5 + r() * size
    g.fillRect(r() * w, r() * h, s, s)
  }
}

/** Soft blotches that wrap at the edges so the texture tiles cleanly. */
function mottle(g: G, w: number, h: number, seed: number, count: number, rgb: string[], radius: [number, number], alpha: number) {
  const r = rng(seed)
  for (let i = 0; i < count; i++) {
    const x = r() * w
    const y = r() * h
    const rad = radius[0] + r() * (radius[1] - radius[0])
    const c = rgb[Math.floor(r() * rgb.length)]
    for (const ox of [-w, 0, w])
      for (const oy of [-h, 0, h]) {
        if (x + ox + rad < 0 || x + ox - rad > w || y + oy + rad < 0 || y + oy - rad > h) continue
        const grad = g.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, rad)
        grad.addColorStop(0, `rgba(${c},${alpha})`)
        grad.addColorStop(1, `rgba(${c},0)`)
        g.fillStyle = grad
        g.fillRect(x + ox - rad, y + oy - rad, rad * 2, rad * 2)
      }
  }
}

function valueNoise(seed: number) {
  const r = rng(seed)
  const table = Array.from({ length: 256 }, r)
  const at = (x: number, y: number) => table[(x * 37 + y * 101) & 255]
  const smooth = (t: number) => t * t * (3 - 2 * t)
  return (x: number, y: number) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = smooth(x - xi)
    const yf = smooth(y - yi)
    const top = at(xi, yi) + (at(xi + 1, yi) - at(xi, yi)) * xf
    const bottom = at(xi, yi + 1) + (at(xi + 1, yi + 1) - at(xi, yi + 1)) * xf
    return top + (bottom - top) * yf
  }
}

/* ---------- materials ---------- */
export const kraft = () =>
  tex('kraft', 1024, 1024, (g, w, h) => {
    g.fillStyle = '#ab7d4b'
    g.fillRect(0, 0, w, h)
    mottle(g, w, h, 1, 220, ['198,152,102', '128,86,46'], [30, 140], 0.2)
    const r = rng(2)
    for (let i = 0; i < 11000; i++) {
      const x = r() * w
      const y = r() * h
      const a = (r() - 0.5) * 0.9
      const len = 3 + r() * 16
      g.strokeStyle = r() > 0.5 ? 'rgba(240,212,170,0.28)' : 'rgba(88,56,26,0.22)'
      g.lineWidth = 0.6 + r()
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len)
      g.stroke()
    }
    speckle(g, w, h, 3, 6000, ['rgba(70,45,20,0.35)', 'rgba(255,232,196,0.3)'])
  }, { repeat: true })

export const grain = () =>
  tex('grain', 512, 512, (g, w, h) => {
    g.fillStyle = '#808080'
    g.fillRect(0, 0, w, h)
    mottle(g, w, h, 4, 300, ['255,255,255', '0,0,0'], [4, 26], 0.18)
    speckle(g, w, h, 5, 9000, ['rgba(255,255,255,0.5)', 'rgba(0,0,0,0.5)'], 2)
  }, { data: true, repeat: true })

export const wood = (key: string, light: [number, number, number], planks: number) =>
  tex(`wood-${key}`, 1024, 1024, (g, w, h) => {
    const r = rng(planks * 31 + light[0])
    const ph = h / planks
    for (let i = 0; i < planks; i++) {
      const k = 0.86 + r() * 0.24
      g.fillStyle = `rgb(${light[0] * k},${light[1] * k},${light[2] * k})`
      g.fillRect(0, i * ph, w, ph)
      for (let j = 0; j < 46; j++) {
        const y0 = i * ph + r() * ph
        const amp = r() * 5
        const freq = 0.004 + r() * 0.012
        const off = r() * 9
        g.strokeStyle = r() > 0.3 ? `rgba(60,32,12,${0.07 + r() * 0.16})` : `rgba(255,222,180,${0.08 + r() * 0.1})`
        g.lineWidth = 0.7 + r() * 2.2
        g.beginPath()
        for (let x = 0; x <= w; x += 16) g.lineTo(x, y0 + Math.sin(x * freq + off) * amp)
        g.stroke()
      }
      if (r() > 0.55) {
        const kx = r() * w
        const ky = i * ph + ph * (0.3 + r() * 0.4)
        for (let ring = 6; ring > 0; ring--) {
          g.strokeStyle = 'rgba(55,28,10,0.25)'
          g.beginPath()
          g.ellipse(kx, ky, ring * 7, ring * 2.4, 0, 0, Math.PI * 2)
          g.stroke()
        }
      }
      g.fillStyle = 'rgba(25,12,4,0.55)'
      g.fillRect(0, i * ph, w, 2.5)
      g.fillRect(r() * w, i * ph, 2.5, ph)
    }
    speckle(g, w, h, 9, 4000, ['rgba(40,20,8,0.2)'])
  }, { repeat: true })

export const asphalt = () =>
  tex('asphalt', 1024, 1024, (g, w, h) => {
    g.fillStyle = '#3c3e43'
    g.fillRect(0, 0, w, h)
    mottle(g, w, h, 10, 90, ['95,96,102', '24,25,28'], [40, 170], 0.22)
    speckle(g, w, h, 11, 42000, ['#2a2b2f', '#55575d', '#6b6c70', '#33343a'], 2.2)
  }, { repeat: true })

export const concrete = () =>
  tex('concrete', 512, 512, (g, w, h) => {
    g.fillStyle = '#bcb5a9'
    g.fillRect(0, 0, w, h)
    mottle(g, w, h, 12, 70, ['225,218,205', '140,132,120'], [20, 90], 0.22)
    speckle(g, w, h, 13, 9000, ['rgba(90,84,74,0.4)', 'rgba(255,250,240,0.4)'])
    g.fillStyle = 'rgba(70,64,56,0.6)'
    g.fillRect(0, 0, 4, h)
    g.fillRect(0, 0, w, 4)
  }, { repeat: true })

/** Painted clapboards, drawn pale so each house can tint them. */
export const siding = () =>
  tex('siding', 512, 512, (g, w, h) => {
    const rows = 8
    const bh = h / rows
    for (let i = 0; i < rows; i++) {
      const grad = g.createLinearGradient(0, i * bh, 0, (i + 1) * bh)
      grad.addColorStop(0, '#d8d8d8')
      grad.addColorStop(0.12, '#ffffff')
      grad.addColorStop(0.9, '#e9e9e9')
      grad.addColorStop(0.93, '#9a9a9a')
      grad.addColorStop(1, '#767676')
      g.fillStyle = grad
      g.fillRect(0, i * bh, w, bh)
    }
    speckle(g, w, h, 14, 3000, ['rgba(0,0,0,0.06)', 'rgba(255,255,255,0.3)'])
  }, { repeat: true })

export const shingles = () =>
  tex('shingles', 512, 512, (g, w, h) => {
    const r = rng(15)
    const rows = 10
    const rh = h / rows
    g.fillStyle = '#8a8a8a'
    g.fillRect(0, 0, w, h)
    for (let i = 0; i < rows; i++) {
      let x = -r() * 40
      while (x < w) {
        const sw = 34 + r() * 40
        const k = 178 + r() * 70
        g.fillStyle = `rgb(${k},${k},${k})`
        g.fillRect(x, i * rh, sw - 2.5, rh - 2)
        x += sw
      }
      const shade = g.createLinearGradient(0, i * rh, 0, i * rh + rh * 0.35)
      shade.addColorStop(0, 'rgba(0,0,0,0.5)')
      shade.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = shade
      g.fillRect(0, i * rh, w, rh * 0.35)
    }
    speckle(g, w, h, 16, 9000, ['rgba(0,0,0,0.18)', 'rgba(255,255,255,0.18)'])
  }, { repeat: true })

export const brick = () =>
  tex('brick', 512, 512, (g, w, h) => {
    const r = rng(17)
    g.fillStyle = '#bcae9c'
    g.fillRect(0, 0, w, h)
    const rows = 16
    const bh = h / rows
    for (let i = 0; i < rows; i++)
      for (let x = (i % 2) * -32; x < w; x += 64) {
        g.fillStyle = `hsl(${10 + r() * 12},${42 + r() * 14}%,${32 + r() * 14}%)`
        g.fillRect(x + 3, i * bh + 3, 58, bh - 5)
      }
    speckle(g, w, h, 18, 8000, ['rgba(0,0,0,0.2)', 'rgba(255,230,210,0.2)'])
  }, { repeat: true })

export const lawn = () =>
  tex('lawn', 1024, 1024, (g, w, h) => {
    g.fillStyle = '#4c7a32'
    g.fillRect(0, 0, w, h)
    mottle(g, w, h, 19, 160, ['122,158,62', '38,72,26', '150,150,70'], [30, 150], 0.28)
    const r = rng(20)
    for (let i = 0; i < 22000; i++) {
      const x = r() * w
      const y = r() * h
      g.strokeStyle = `hsl(${78 + r() * 34},${38 + r() * 22}%,${22 + r() * 28}%)`
      g.lineWidth = 1.1
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + (r() - 0.5) * 6, y - 3 - r() * 8)
      g.stroke()
    }
  }, { repeat: true })

export const plaster = () =>
  tex('plaster', 512, 512, (g, w, h) => {
    g.fillStyle = '#e8e8e8'
    g.fillRect(0, 0, w, h)
    mottle(g, w, h, 21, 220, ['255,255,255', '170,170,170'], [10, 60], 0.22)
    speckle(g, w, h, 22, 5000, ['rgba(0,0,0,0.05)', 'rgba(255,255,255,0.25)'])
  }, { repeat: true })

export const leaves = () =>
  tex('leaves', 256, 256, (g) => {
    const r = rng(23)
    for (let i = 0; i < 60; i++) {
      const a = r() * Math.PI * 2
      const d = Math.sqrt(r()) * 96
      const x = 128 + Math.cos(a) * d
      const y = 128 + Math.sin(a) * d
      const len = 15 + r() * 15
      g.save()
      g.translate(x, y)
      g.rotate(r() * Math.PI * 2)
      g.fillStyle = `hsl(${76 + r() * 38},${40 + r() * 22}%,${24 + r() * 24}%)`
      g.beginPath()
      g.moveTo(-len, 0)
      g.quadraticCurveTo(0, -len * 0.62, len, 0)
      g.quadraticCurveTo(0, len * 0.62, -len, 0)
      g.fill()
      g.strokeStyle = 'rgba(225,240,180,0.35)'
      g.beginPath()
      g.moveTo(-len, 0)
      g.lineTo(len, 0)
      g.stroke()
      g.restore()
    }
  })

/** A soft, broken-edged cloud puff: bright on top, blue-grey underneath. */
export const puff = (seed: number) =>
  tex(`puff-${seed}`, 256, 256, (g, w, h) => {
    const img = g.createImageData(w, h)
    const noise = valueNoise(seed * 97 + 5)
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const dx = (x / w) * 2 - 1
        const dy = (y / h) * 2 - 1
        const d = Math.hypot(dx, dy)
        let n = 0
        let amp = 0.5
        let f = 3.2
        for (let o = 0; o < 4; o++) {
          n += noise((dx + 2) * f, (dy + 2) * f) * amp
          amp *= 0.5
          f *= 2.1
        }
        const edge = Math.max(0, Math.min(1, (1 - d) * 1.7 + (n - 0.55) * 1.7))
        const fade = Math.max(0, Math.min(1, (1 - d) / 0.35))
        const shade = Math.max(0, Math.min(1, (dy + 0.2) * 0.85 + (0.5 - n) * 0.6))
        const i = (y * w + x) * 4
        img.data[i] = 255 - shade * 74
        img.data[i + 1] = 255 - shade * 58
        img.data[i + 2] = 255 - shade * 36
        img.data[i + 3] = edge * fade * 235
      }
    g.putImageData(img, 0, 0)
  })

export const softShadow = () =>
  tex('soft-shadow', 256, 256, (g, w) => {
    const grad = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grad.addColorStop(0, 'rgba(0,0,0,0.7)')
    grad.addColorStop(0.55, 'rgba(0,0,0,0.35)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, w, w)
  })

/* ---------- print and artwork ---------- */
function fit(g: G, text: string, maxWidth: number, size: number, font: (s: number) => string) {
  g.font = font(size)
  const width = g.measureText(text).width
  if (width > maxWidth) g.font = font(Math.floor((size * maxWidth) / width))
}

export const shippingLabel = (city: string, coords: string, accent: string) =>
  tex(`ship-${city}`, 1024, 600, (g, w, h) => {
    g.fillStyle = '#f6eedf'
    g.fillRect(0, 0, w, h)
    speckle(g, w, h, 24, 2500, ['rgba(120,100,70,0.12)'])
    g.fillStyle = '#142221'
    g.font = `900 78px ${DISPLAY}`
    g.fillText('MARLOWBY', 54, 118)
    g.fillRect(54, 146, w - 108, 7)
    g.fillStyle = accent
    fit(g, city, w - 108, 150, (s) => `italic 500 ${s}px ${SERIF}`)
    g.fillText(city, 50, 320)
    g.fillStyle = '#142221'
    g.font = `400 40px ${MONO}`
    g.fillText(coords, 54, 396)
    const r = rng(city.length * 71)
    for (let x = 54; x < 640; ) {
      const bar = 3 + Math.floor(r() * 4) * 3
      g.fillRect(x, 436, bar, 96)
      x += bar + 5
    }
    g.font = `400 30px ${MONO}`
    g.fillText('SAMPLE BOX', 680, 478)
    g.fillText('ILLUSTRATION', 680, 522)
  })

export const lidPrint = () =>
  tex('lid-print', 1024, 700, (g, w, h) => {
    g.textAlign = 'center'
    g.fillStyle = 'rgba(22,34,33,0.92)'
    fit(g, 'MARLOWBY', w - 150, 150, (s) => `900 ${s}px ${DISPLAY}`)
    g.fillText('MARLOWBY', w / 2, h / 2 + 10)
    g.fillRect(w / 2 - 210, h / 2 + 62, 420, 6)
    g.font = `400 34px ${MONO}`
    g.fillText('Explore Your City, One Box at a Time.', w / 2, h / 2 + 140)
  })

export const lidInside = (city: string, accent: string) =>
  tex(`lid-in-${city}`, 1024, 700, (g, w, h) => {
    g.textAlign = 'center'
    g.fillStyle = '#f6eedf'
    g.fillRect(70, 90, w - 140, h - 180)
    g.fillStyle = '#142221'
    g.font = `italic 400 78px ${SERIF}`
    g.fillText('Hello from', w / 2, 250)
    g.fillStyle = accent
    fit(g, city, w - 240, 150, (s) => `900 ${s}px ${DISPLAY}`)
    g.fillText(city, w / 2, 430)
    g.fillStyle = '#142221'
    g.font = `400 34px ${MONO}`
    g.fillText('A SAMPLE BOX, FOR ILLUSTRATION', w / 2, 540)
  })

export const productLabel = (title: string, sub: string, bg: string, ink: string) =>
  tex(`product-${title}-${sub}-${bg}`, 512, 640, (g, w, h) => {
    g.fillStyle = bg
    g.fillRect(0, 0, w, h)
    speckle(g, w, h, 25, 2500, ['rgba(0,0,0,0.07)', 'rgba(255,255,255,0.1)'])
    g.strokeStyle = ink
    g.lineWidth = 5
    g.strokeRect(34, 150, w - 68, h - 230)
    g.fillStyle = ink
    g.textAlign = 'center'
    g.font = `900 34px ${DISPLAY}`
    g.fillText('MARLOWBY', w / 2, 224)
    g.fillRect(w / 2 - 60, 250, 120, 4)
    const words = title.split(' ')
    words.forEach((word, i) => {
      fit(g, word, w - 130, 76, (s) => `italic 600 ${s}px ${SERIF}`)
      g.fillText(word, w / 2, 350 + i * 82)
    })
    g.font = `400 30px ${MONO}`
    g.fillText(sub, w / 2, h - 128)
  })

/** A label that wraps all the way round a jar, tin or bottle: the title repeats twice so one always faces you. */
export const wrapLabel = (title: string, sub: string, bg: string, ink: string) =>
  tex(`wrap-${title}-${sub}-${bg}`, 1024, 256, (g, w, h) => {
    g.fillStyle = bg
    g.fillRect(0, 0, w, h)
    speckle(g, w, h, 26, 2500, ['rgba(0,0,0,0.07)', 'rgba(255,255,255,0.1)'])
    g.fillStyle = ink
    g.fillRect(0, 14, w, 5)
    g.fillRect(0, h - 19, w, 5)
    g.textAlign = 'center'
    for (const x of [w * 0.02, w * 0.52, w * 1.02]) {
      fit(g, title, 440, 76, (s) => `italic 600 ${s}px ${SERIF}`)
      g.fillText(title, x, 132)
      g.font = `400 30px ${MONO}`
      g.fillText(sub, x, 194)
    }
  })

export const granules = (key: string, base: string, flecks: string[]) =>
  tex(`granules-${key}`, 256, 256, (g, w, h) => {
    g.fillStyle = base
    g.fillRect(0, 0, w, h)
    speckle(g, w, h, 27, 5200, flecks, 5)
  }, { repeat: true })

function palm(g: G, x: number, ground: number, height: number, color: string) {
  g.strokeStyle = color
  g.lineCap = 'round'
  g.lineWidth = height * 0.045
  g.beginPath()
  g.moveTo(x, ground)
  g.quadraticCurveTo(x + height * 0.12, ground - height * 0.55, x + height * 0.04, ground - height)
  g.stroke()
  g.lineWidth = height * 0.04
  for (let i = 0; i < 7; i++) {
    const a = Math.PI + (i / 6) * Math.PI
    g.beginPath()
    g.moveTo(x + height * 0.04, ground - height)
    g.quadraticCurveTo(
      x + Math.cos(a) * height * 0.2,
      ground - height - height * 0.18,
      x + Math.cos(a) * height * 0.34,
      ground - height + Math.abs(Math.cos(a)) * height * 0.12,
    )
    g.stroke()
  }
}

/** Original travel-poster art for each sample city. */
export const poster = (city: number) =>
  tex(`poster-${city}`, 512, 660, (g, w, h) => {
    const names = ['NEW YORK', 'LOS ANGELES', 'MIAMI']
    const skies = [['#1d3557', '#e8795f', '#ffd29a'], ['#5b3a7e', '#ee7b4d', '#ffd166'], ['#2f9fb0', '#f29bb0', '#ffe3c2']]
    g.fillStyle = '#f6eedf'
    g.fillRect(0, 0, w, h)
    const sky = g.createLinearGradient(0, 36, 0, 520)
    skies[city].forEach((c, i) => sky.addColorStop(i / 2, c))
    g.fillStyle = sky
    g.fillRect(36, 36, w - 72, 484)
    g.save()
    g.beginPath()
    g.rect(36, 36, w - 72, 484)
    g.clip()
    g.fillStyle = 'rgba(255,244,214,0.95)'
    g.beginPath()
    g.arc(city === 0 ? 370 : 256, city === 0 ? 170 : 300, 62, 0, Math.PI * 2)
    g.fill()
    const r = rng(city + 40)
    if (city === 0) {
      for (const [shade, base, tall] of [['#34506f', 440, 230], ['#14253c', 520, 200]] as const) {
        g.fillStyle = shade
        for (let x = 30; x < w; x += 34) {
          const bh = 60 + r() * tall
          g.fillRect(x, base - bh, 30, bh + 80)
        }
      }
      g.fillRect(232, 200, 52, 320)
      g.fillRect(244, 160, 28, 50)
      g.fillRect(255, 96, 6, 70)
    } else {
      g.fillStyle = city === 1 ? '#7a3b5e' : '#1f7f86'
      g.beginPath()
      g.moveTo(36, 520)
      if (city === 1) {
        g.lineTo(36, 390)
        g.quadraticCurveTo(150, 300, 260, 400)
        g.quadraticCurveTo(380, 320, 476, 380)
      } else {
        g.lineTo(36, 410)
        g.lineTo(476, 410)
      }
      g.lineTo(476, 520)
      g.fill()
      if (city === 2)
        for (let x = 70; x < 440; x += 74) {
          const bh = 80 + r() * 110
          g.fillStyle = ['#ffd6a5', '#f7a8b8', '#bde7e0', '#fff1d0'][Math.floor(r() * 4)]
          g.fillRect(x, 440 - bh, 58, bh)
          g.fillRect(x + 20, 420 - bh, 18, 20)
          g.fillStyle = 'rgba(30,70,80,0.45)'
          for (let y = 456 - bh; y < 430; y += 22) g.fillRect(x + 8, y, 42, 8)
        }
      g.fillStyle = city === 1 ? '#3d1f3f' : '#0f4c55'
      g.fillRect(36, 470, w - 72, 50)
      palm(g, 96, 500, 250, '#241431')
      palm(g, 400, 506, 300, '#241431')
      palm(g, 452, 508, 190, '#241431')
    }
    g.restore()
    g.fillStyle = '#142221'
    g.textAlign = 'center'
    fit(g, names[city], w - 90, 54, (s) => `900 ${s}px ${DISPLAY}`)
    g.fillText(names[city], w / 2, 588)
    g.font = `400 24px ${MONO}`
    g.fillText('MARLOWBY SAMPLE PRINT', w / 2, 628)
  })

export const mapArt = (title: string, accent: string) =>
  tex(`map-${title}-${accent}`, 512, 400, (g, w, h) => {
    g.fillStyle = '#f1e8d4'
    g.fillRect(0, 0, w, h)
    const r = rng(title.length * 13)
    g.fillStyle = '#c4d8ae'
    g.fillRect(300, 70, 130, 100)
    g.strokeStyle = '#a9cdd8'
    g.lineWidth = 34
    g.beginPath()
    g.moveTo(-20, 300)
    g.bezierCurveTo(150, 220, 300, 380, 540, 280)
    g.stroke()
    g.strokeStyle = '#d3c7ac'
    for (let i = 0; i < 24; i++) {
      g.lineWidth = r() > 0.8 ? 8 : 3
      g.beginPath()
      if (i % 2) {
        const y = r() * h
        g.moveTo(0, y)
        g.lineTo(w, y + (r() - 0.5) * 70)
      } else {
        const x = r() * w
        g.moveTo(x, 0)
        g.lineTo(x + (r() - 0.5) * 70, h)
      }
      g.stroke()
    }
    g.strokeStyle = accent
    g.lineWidth = 7
    g.setLineDash([14, 10])
    g.beginPath()
    g.moveTo(70, 320)
    g.bezierCurveTo(120, 160, 260, 280, 330, 150)
    g.lineTo(440, 120)
    g.stroke()
    g.setLineDash([])
    g.fillStyle = accent
    for (const [x, y] of [[70, 320], [225, 222], [330, 150], [440, 120]]) {
      g.beginPath()
      g.arc(x, y, 13, 0, Math.PI * 2)
      g.fill()
    }
    g.fillStyle = '#142221'
    g.fillRect(0, 0, w, 62)
    g.fillStyle = '#f1e8d4'
    g.textAlign = 'center'
    fit(g, title, w - 40, 32, (s) => `900 ${s}px ${DISPLAY}`)
    g.fillText(title, w / 2, 43)
  })

export const decal = (text: string, color: string, size = 130) =>
  tex(`decal-${text}-${color}`, 1024, 192, (g, w, h) => {
    g.fillStyle = color
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    fit(g, text, w - 40, size, (s) => `900 ${s}px ${DISPLAY}`)
    g.fillText(text, w / 2, h / 2 + 6)
  })

export const welcomeMat = () =>
  tex('mat', 512, 256, (g, w, h) => {
    g.fillStyle = '#7a5630'
    g.fillRect(0, 0, w, h)
    speckle(g, w, h, 28, 9000, ['#946d40', '#5e3f20', '#a88154'], 3)
    g.strokeStyle = '#2f1e0e'
    g.lineWidth = 10
    g.strokeRect(18, 18, w - 36, h - 36)
    g.fillStyle = '#2f1e0e'
    g.textAlign = 'center'
    g.font = `700 76px ${BODY}`
    g.fillText('WELCOME', w / 2, h / 2 + 26)
  })

export const rug = () =>
  tex('rug', 1024, 512, (g, w, h) => {
    g.fillStyle = '#a8503c'
    g.fillRect(0, 0, w, h)
    for (const [inset, color, width] of [[26, '#f1e3c8', 14], [52, '#0e4a47', 26], [92, '#f1e3c8', 6]] as const) {
      g.strokeStyle = color
      g.lineWidth = width
      g.strokeRect(inset, inset, w - inset * 2, h - inset * 2)
    }
    g.fillStyle = 'rgba(241,227,200,0.75)'
    for (let x = 170; x < w - 130; x += 114)
      for (let y = 170; y < h - 130; y += 86) {
        g.beginPath()
        g.moveTo(x, y - 26)
        g.lineTo(x + 30, y)
        g.lineTo(x, y + 26)
        g.lineTo(x - 30, y)
        g.fill()
      }
    speckle(g, w, h, 29, 26000, ['rgba(40,15,8,0.25)', 'rgba(255,235,205,0.2)'], 2.5)
  })

/** Warm light and curtains seen through a house window. */
export const litWindow = () =>
  tex('lit-window', 256, 320, (g, w, h) => {
    const grad = g.createRadialGradient(w * 0.5, h * 0.6, 10, w * 0.5, h * 0.55, h * 0.7)
    grad.addColorStop(0, '#ffe4a8')
    grad.addColorStop(1, '#a8622c')
    g.fillStyle = grad
    g.fillRect(0, 0, w, h)
    for (const side of [0, 1]) {
      g.fillStyle = 'rgba(244,232,208,0.92)'
      g.beginPath()
      const x = side ? w : 0
      const dir = side ? -1 : 1
      g.moveTo(x, 0)
      g.lineTo(x + dir * 96, 0)
      g.quadraticCurveTo(x + dir * 66, h * 0.55, x + dir * 24, h * 0.72)
      g.lineTo(x + dir * 48, h)
      g.lineTo(x, h)
      g.fill()
    }
  })

/** The view outside the living-room window. */
export const outdoorView = () =>
  tex('outdoor', 512, 640, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#9cc7ee')
    sky.addColorStop(0.7, '#ffe7c4')
    sky.addColorStop(1, '#ffd9a8')
    g.fillStyle = sky
    g.fillRect(0, 0, w, h)
    g.filter = 'blur(7px)'
    const r = rng(30)
    for (let i = 0; i < 260; i++) {
      g.fillStyle = `hsl(${80 + r() * 45},34%,${30 + r() * 24}%)`
      g.beginPath()
      g.arc(r() * w, h * 0.72 + r() * h * 0.3 - Math.sin(r() * 3) * 50, 16 + r() * 30, 0, Math.PI * 2)
      g.fill()
    }
    g.filter = 'none'
  })

/** Painted aircraft skin. Canvas x runs tail to nose; y wraps round the body (0.75 is the near side). */
export const livery = () =>
  tex('livery', 2048, 1024, (g, w, h) => {
    g.fillStyle = '#f5efe2'
    g.fillRect(0, 0, w, h)
    g.strokeStyle = 'rgba(60,70,80,0.16)'
    g.lineWidth = 2
    for (let x = 90; x < w - 160; x += 130) {
      g.beginPath()
      g.moveTo(x, 0)
      g.lineTo(x, h)
      g.stroke()
    }
    g.fillStyle = '#0e4a47'
    g.fillRect(0, 0, w, h * 0.14)
    g.fillRect(0, h * 0.86, w, h * 0.14)
    for (const side of [0.25, 0.75]) {
      const dir = side === 0.75 ? 1 : -1
      g.fillStyle = '#e8664e'
      g.fillRect(0, h * (side + dir * 0.045), w * 0.93, 26)
      g.fillStyle = '#0e4a47'
      g.fillRect(0, h * (side + dir * 0.078), w * 0.9, 9)
      g.save()
      g.translate(w * 0.54, h * (side - dir * 0.025))
      if (dir < 0) g.rotate(Math.PI)
      g.scale(-1, 1)
      g.fillStyle = '#0e4a47'
      g.textAlign = 'center'
      g.textBaseline = 'middle'
      g.font = `900 70px ${DISPLAY}`
      g.fillText('MARLOWBY', 0, 0)
      g.restore()
      g.fillStyle = '#1c2b38'
      g.beginPath()
      g.roundRect(w * 0.905, h * (side - dir * 0.04) - 24, 74, 48, 14)
      g.fill()
    }
    g.strokeStyle = 'rgba(20,30,30,0.5)'
    g.lineWidth = 5
    g.strokeRect(w * 0.37, -4, w * 0.12, h * 0.07)
    g.strokeRect(w * 0.37, h * 0.93, w * 0.12, h * 0.08)
  })
