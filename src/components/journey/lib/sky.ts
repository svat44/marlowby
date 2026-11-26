import { BackSide, Color, Mesh, PMREMGenerator, Scene, ShaderMaterial, SphereGeometry, Vector3, type WebGLRenderer } from 'three'
import type { V3 } from './util'

export type SkyLook = {
  top: string
  mid: string
  horizon: string
  below: string
  sun: string
  sunDir: V3
  glow: number
  cloud: string
  cloudAmount: number
}

export const NOISE_GLSL = /* glsl */ `
float mHash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float mNoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mHash(i), mHash(i + vec2(1.0, 0.0)), f.x), mix(mHash(i + vec2(0.0, 1.0)), mHash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float mFbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * mNoise(p); p = p * 2.07 + 7.3; a *= 0.5; }
  return v;
}
`

export function skyMaterial(look: SkyLook) {
  return new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    uniforms: {
      top: { value: new Color(look.top) },
      mid: { value: new Color(look.mid) },
      horizon: { value: new Color(look.horizon) },
      below: { value: new Color(look.below) },
      sunColor: { value: new Color(look.sun) },
      sunDir: { value: new Vector3(...look.sunDir).normalize() },
      glow: { value: look.glow },
      cloudColor: { value: new Color(look.cloud) },
      cloudAmount: { value: look.cloudAmount },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 top, mid, horizon, below, sunColor, sunDir, cloudColor;
      uniform float glow, cloudAmount;
      varying vec3 vDir;
      ${NOISE_GLSL}
      void main() {
        vec3 d = normalize(vDir);
        float h = d.y;
        vec3 col = mix(horizon, mid, smoothstep(0.0, 0.2, h));
        col = mix(col, top, smoothstep(0.16, 0.62, h));
        col = mix(col, below, smoothstep(0.0, -0.22, h));
        if (h > 0.0) {
          vec2 uv = d.xz / (h + 0.14);
          float n = mFbm(uv * vec2(0.9, 2.1));
          float band = smoothstep(0.48, 0.82, n) * smoothstep(0.0, 0.12, h) * (1.0 - smoothstep(0.5, 0.9, h));
          col = mix(col, cloudColor, band * cloudAmount);
        }
        float s = max(dot(d, sunDir), 0.0);
        col += sunColor * (smoothstep(0.99935, 0.99965, s) * 7.0 + pow(s, 60.0) * glow + pow(s, 6.0) * glow * 0.32);
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
}

/** Turns a sky into reflections, so glass, paint and metal mirror the world around them. */
export function skyReflections(gl: WebGLRenderer, look: SkyLook) {
  const pmrem = new PMREMGenerator(gl)
  const scene = new Scene()
  const dome = new Mesh(new SphereGeometry(90, 48, 24), skyMaterial(look))
  scene.add(dome)
  const target = pmrem.fromScene(scene, 0.015, 0.1, 200)
  pmrem.dispose()
  dome.geometry.dispose()
  dome.material.dispose()
  return target.texture
}
