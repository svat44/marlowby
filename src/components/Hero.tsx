import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, Pause, Play } from './Icons'
import './Hero.css'

const LINE = 'Imagine you could have a whole city at home.'
const SIGN = 'That’s Marlowby.'
const INTRO_DELAY = 2.4

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const [playing, setPlaying] = useState(true)
  const [skipped, setSkipped] = useState(false)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const lift = useTransform(scrollYProgress, [0, 1], ['0%', '-18%'])

  // Any first interaction fast-forwards the intro so nobody waits on it.
  useEffect(() => {
    const skip = () => setSkipped(true)
    const opts = { once: true, passive: true } as const
    window.addEventListener('wheel', skip, opts)
    window.addEventListener('touchmove', skip, opts)
    window.addEventListener('keydown', skip, { once: true })
    return () => {
      window.removeEventListener('wheel', skip)
      window.removeEventListener('touchmove', skip)
      window.removeEventListener('keydown', skip)
    }
  }, [])

  useEffect(() => {
    if (reduce) {
      video.current?.pause()
      setPlaying(false)
    }
  }, [reduce])

  const toggle = () => {
    const v = video.current
    if (!v) return
    if (v.paused) {
      void v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  const start = reduce || skipped ? 0 : INTRO_DELAY
  const words = LINE.split(' ')

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-line">
      <motion.div className="hero__media" style={reduce ? undefined : { scale }}>
        <video
          ref={video}
          className="hero__video"
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/nyc-poster.jpg"
          aria-hidden="true"
        >
          <source src="/media/nyc-hero.webm" type="video/webm" />
          <source src="/media/nyc-hero.mp4" type="video/mp4" />
        </video>
        <motion.div
          className="hero__veil"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: reduce ? 0 : 1.6, delay: start * 0.55, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      <motion.div className="hero__copy" style={reduce ? undefined : { y: lift }}>
        <h1 id="hero-line" className="hero__line">
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="hero__word"
              initial={{ opacity: 0, y: '0.35em', filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: start + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}{' '}
            </motion.span>
          ))}
          <motion.span
            className="hero__sign"
            initial={{ opacity: 0, y: '0.35em', filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: start + words.length * 0.07 + 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {SIGN}
          </motion.span>
        </h1>
      </motion.div>

      <div className="hero__foot">
        <p className="mono hero__place">Midtown Manhattan · 40.7516° N, 73.9755° W</p>
        <a href="#box" className="hero__cue">
          See what’s inside <ArrowDown className="hero__cue-icon" />
        </a>
        <button
          type="button"
          className="hero__toggle"
          onClick={toggle}
          aria-label={playing ? 'Pause background video' : 'Play background video'}
        >
          {playing ? <Pause /> : <Play />}
        </button>
      </div>
    </section>
  )
}
