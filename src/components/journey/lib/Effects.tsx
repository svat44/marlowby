import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { HalfFloatType, Vector2, WebGLRenderTarget } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

export type Glow = { strength: number; radius: number; threshold: number }

/** Final film look: soft vignette, a touch more colour, very fine grain. */
const Grade = {
  uniforms: { tDiffuse: { value: null }, time: { value: 0 } },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float time;
    varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      float vignette = smoothstep(0.86, 0.28, length((vUv - 0.5) * vec2(1.0, 0.92)));
      c.rgb *= mix(0.74, 1.0, vignette);
      float lum = dot(c.rgb, vec3(0.299, 0.587, 0.114));
      c.rgb = mix(vec3(lum), c.rgb, 1.07);
      c.rgb += (fract(sin(dot(vUv + fract(time), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.016;
      gl_FragColor = c;
    }`,
}

/** Renders the scene with smooth edges and a glow around bright lights. */
export function Effects({ glow }: { glow: { current: Glow } }) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const dpr = useThree((s) => s.viewport.dpr)

  const fx = useMemo(() => {
    const target = new WebGLRenderTarget(1, 1, { type: HalfFloatType, samples: 2 })
    const composer = new EffectComposer(gl, target)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new Vector2(256, 256), 0.4, 0.5, 0.9)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())
    const grade = new ShaderPass(Grade)
    composer.addPass(grade)
    return { composer, bloom, grade }
  }, [gl, scene, camera])

  useEffect(() => {
    fx.composer.setPixelRatio(dpr)
    fx.composer.setSize(size.width, size.height)
    // the glow is soft by nature, so it can be drawn at half resolution
    fx.bloom.setSize((size.width * dpr) / 2, (size.height * dpr) / 2)
  }, [fx, size, dpr])

  useEffect(() => () => fx.composer.dispose(), [fx])

  useFrame(({ clock }) => {
    fx.bloom.strength = glow.current.strength
    fx.bloom.radius = glow.current.radius
    fx.bloom.threshold = glow.current.threshold
    fx.grade.uniforms.time.value = clock.elapsedTime
    fx.composer.render()
  }, 1)

  return null
}
