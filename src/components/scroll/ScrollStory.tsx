import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useMotionTemplate, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { ArrowDown, Pause, Play } from '../Icons'
import type { City } from './labelTexture'
import '../Hero.css'
import './ScrollStory.css'

const BoxCanvas = lazy(() => import('./BoxModel'))

const NEW_YORK: City = { no: 'No. 001', name: 'New York, NY', coords: '40.7128° N · 74.0060° W' }
const LINE = 'Imagine you could have a whole city at home.'
const SIGN = 'That’s Marlowby.'
const INTRO_DELAY = 2.4
const EASE = [0.16, 1, 0.3, 1] as const

const MAKERS = [
  { maker: 'Russ & Daughters', place: 'Lower East Side · since 1914', thing: 'Chocolate babka' },
  { maker: 'Levain Bakery', place: 'Upper West Side · since 1995', thing: 'Chocolate chip walnut cookies' },
  { maker: 'Kalustyan’s', place: 'Murray Hill · since 1944', thing: 'Za’atar from Lexington Avenue' },
  { maker: 'McNulty’s Tea & Coffee', place: 'West Village · since 1895', thing: 'House coffee, whole bean' },
  { maker: 'A walk, written for the box', place: 'Lower East Side', thing: 'A route with stops worth making' },
]

/** Fade a layer in over [a, b] and out over [c, d], with a little blur and drift like a cross-dissolve. */
function useBeat(p: MotionValue<number>, a: number, b: number, c: number, d: number) {
  const opacity = useTransform(p, [a, b, c, d], [0, 1, 1, 0])
  const blurPx = useTransform(p, [a, b, c, d], [12, 0, 0, 12])
  const y = useTransform(p, [a, b, c, d], [24, 0, 0, -24])
  const filter = useMotionTemplate`blur(${blurPx}px)`
  return { opacity, filter, y }
}

function MakerRow({ i, p, m }: { i: number; p: MotionValue<number>; m: (typeof MAKERS)[number] }) {
  const at = 0.5 + i * 0.03
  const opacity = useTransform(p, [at, at + 0.03, 0.7, 0.74], [0, 1, 1, 0])
  const x = useTransform(p, [at, at + 0.03], [16, 0])
  return (
    <motion.li className="story__maker" style={{ opacity, x }}>
      <span className="story__maker-name">{m.maker}</span>
      <span className="mono story__maker-place">{m.place}</span>
      <span className="story__maker-thing">{m.thing}</span>
    </motion.li>
  )
}

export default function ScrollStory() {
  const ref = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [skipped, setSkipped] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.35 })

  // Any first interaction fast-forwards the timed intro so nobody waits on it.
  useEffect(() => {
    const skip = () => setSkipped(true)
    window.addEventListener('wheel', skip, { once: true, passive: true })
    window.addEventListener('touchmove', skip, { once: true, passive: true })
    window.addEventListener('keydown', skip, { once: true })
    return () => {
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchmove', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [])

  // Footage: full at the top, dissolves into the teal stage as the box arrives
  const videoOpacity = useTransform(p, [0, 0.1, 0.2], [1, 1, 0])
  const videoScale = useTransform(p, [0, 0.2], [1, 1.14])
  const heroOut = useTransform(p, [0.04, 0.13], [1, 0])
  const heroBlurPx = useTransform(p, [0.04, 0.13], [0, 14])
  const heroFilter = useMotionTemplate`blur(${heroBlurPx}px)`
  const heroY = useTransform(p, [0.04, 0.13], [0, -40])
  const canvasOpacity = useTransform(p, [0.12, 0.24], [0, 1])
  const glow = useTransform(p, [0.12, 0.3, 0.7, 1], [0, 1, 1, 0.6])
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1])

  const city = useBeat(p, 0.22, 0.28, 0.38, 0.43)
  const fits = useBeat(p, 0.43, 0.48, 0.7, 0.75)
  const hello = useBeat(p, 0.76, 0.82, 0.96, 1.01)

  const start = skipped ? 0 : INTRO_DELAY
  const words = LINE.split(' ')

  const toggle = () => {
    const v = video.current
    if (!v) return
    if (v.paused) void v.play()
    else v.pause()
  }

  return (
    <section ref={ref} className="story" aria-label="Marlowby, from New York to your door">
      <div className="story__stage">
        <motion.div className="story__glow" style={{ opacity: glow }} aria-hidden="true" />

        {/* Scene 0: the city */}
        <motion.div className="story__video" style={{ opacity: videoOpacity, scale: videoScale }}>
          <video
            ref={video}
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/media/nyc-poster.jpg"
            aria-hidden="true"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src="/media/nyc-hero.webm" type="video/webm" />
            <source src="/media/nyc-hero.mp4" type="video/mp4" />
          </video>
          <motion.div
            className="hero__veil"
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 1.6, delay: start * 0.55, ease: EASE }}
          />
        </motion.div>

        <motion.div className="story__hero" style={{ opacity: heroOut, filter: heroFilter, y: heroY }}>
          <h1 className="hero__line">
            {words.map((w, i) => (
              <motion.span
                key={i}
                className="hero__word"
                initial={{ opacity: 0, y: '0.35em', filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: start + i * 0.07, ease: EASE }}
              >
                {w}{' '}
              </motion.span>
            ))}
            <motion.span
              className="hero__sign"
              initial={{ opacity: 0, y: '0.35em', filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: start + words.length * 0.07 + 0.45, ease: EASE }}
            >
              {SIGN}
            </motion.span>
          </h1>
        </motion.div>

        {/* The box, rendered live from the Blender model */}
        <motion.div className="story__object" style={{ opacity: canvasOpacity }}>
          <Suspense fallback={null}>
            <BoxCanvas progress={p} city={NEW_YORK} />
          </Suspense>
        </motion.div>

        {/* Scene 1: what Marlowby is */}
        <motion.div className="story__beat story__beat--split" style={city}>
          <h2 className="story__big">
            One city.
            <br />
            One box.
          </h2>
          <p className="story__side">
            Every month we pick one American city. Its bakers, roasters, spice merchants and shopkeepers fill a box, and
            we send that city to your door.
          </p>
        </motion.div>

        {/* Scene 2: what's inside */}
        <motion.div className="story__beat story__beat--inside" style={fits}>
          <div className="story__inside">
            <div className="story__lead">
              <h2 className="story__big">What a city fits in a box</h2>
              <p className="story__note">
                Every maker in a box is a small business the city already loves. These show what a New York month could
                hold.
                <span className="mono story__sample">Sample box, for illustration</span>
              </p>
            </div>
            <ol className="story__makers">
              {MAKERS.map((m, i) => (
                <MakerRow key={m.maker} i={i} p={p} m={m} />
              ))}
            </ol>
          </div>
        </motion.div>

        {/* Scene 3: the month's box */}
        <motion.div className="story__beat story__beat--hello" style={hello}>
          <h2 className="story__hello">Hello from New York.</h2>
          <p className="story__issue">No. 001 · New York, NY</p>
        </motion.div>

        <motion.div className="hero__foot story__foot" style={{ opacity: heroOut }}>
          <p className="mono hero__place">Midtown Manhattan · 40.7516° N, 73.9755° W</p>
          <span className="hero__cue" aria-hidden="true">
            Scroll to open the box <ArrowDown className="hero__cue-icon" />
          </span>
          <button
            type="button"
            className="hero__toggle"
            onClick={toggle}
            aria-label={playing ? 'Pause background video' : 'Play background video'}
          >
            {playing ? <Pause /> : <Play />}
          </button>
        </motion.div>

        <div className="story__progress" aria-hidden="true">
          <motion.span style={{ scaleY: bar }} />
        </div>
      </div>
      <span id="box" className="story__anchor" style={{ top: '46%' }} />
    </section>
  )
}
