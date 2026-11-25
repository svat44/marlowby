import { CanvasTexture, SRGBColorSpace } from 'three'

export type City = { no: string; name: string; coords: string }

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

async function fontsReady() {
  await Promise.all([
    document.fonts.load("900 40px 'Charger Pro Extended'"),
    document.fonts.load("italic 400 40px 'Literata Variable'"),
    document.fonts.load("400 20px 'DM Mono'"),
  ]).catch(() => undefined)
}

function texture(canvas: HTMLCanvasElement) {
  const t = new CanvasTexture(canvas)
  t.colorSpace = SRGBColorSpace
  t.flipY = false // glTF UV convention
  t.anisotropy = 8
  return t
}

/** Shipping label for the box front: wordmark, issue number, city, coordinates. */
export async function makeLabel(city: City) {
  await fontsReady()
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 860
  const g = c.getContext('2d')!
  g.fillStyle = css('--cream') || '#f3e9d7'
  g.fillRect(0, 0, c.width, c.height)
  const ink = css('--ink') || '#142221'
  g.fillStyle = ink
  g.textBaseline = 'alphabetic'
  g.font = "900 104px 'Charger Pro Extended'"
  g.fillText('MARLOWBY', 64, 190)
  g.fillRect(64, 228, c.width - 128, 10)
  g.font = "400 46px 'DM Mono'"
  g.fillText(city.no, 64, 330)
  g.fillStyle = css('--coral-ink') || '#b8432e'
  g.font = "italic 400 128px 'Literata Variable'"
  g.fillText(city.name, 58, 520)
  g.fillStyle = ink
  g.font = "400 44px 'DM Mono'"
  g.fillText(city.coords, 64, 640)
  g.globalAlpha = 0.5
  g.font = "400 36px 'DM Mono'"
  g.fillText('SAMPLE BOX · FOR ILLUSTRATION', 64, 780)
  return texture(c)
}

/** Wordmark printed on the lid. */
export async function makeLidPrint() {
  await fontsReady()
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 256
  const g = c.getContext('2d')!
  g.fillStyle = css('--kraft') || '#b98a55'
  g.fillRect(0, 0, c.width, c.height)
  g.fillStyle = css('--ink') || '#142221'
  g.font = "900 150px 'Charger Pro Extended'"
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText('MARLOWBY', c.width / 2, c.height / 2 + 8)
  return texture(c)
}
