import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { Link } from 'react-router-dom'
import { CITIES, T } from '../components/journey/data'
import '../components/journey/Journey.css'

const JourneyCanvas = lazy(() => import('../components/journey/JourneyScene'))

function Beat({ p, from, to, className = '', children }: { p: MotionValue<number>; from: number; to: number; className?: string; children: React.ReactNode }) {
  const opacity = useTransform(p, [from, from + 0.015, to - 0.015, to], [0, 1, 1, 0])
  const y = useTransform(p, [from, from + 0.02], [24, 0])
  const visibility = useTransform(opacity, (o) => (o < 0.02 ? 'hidden' : 'visible'))
  return (
    <motion.div className={`journey__beat ${className}`} style={{ opacity, y, visibility }}>
      {children}
    </motion.div>
  )
}

/** Soft fade to cover each change of scene. */
function Cut({ p, at, color }: { p: MotionValue<number>; at: number; color: string }) {
  const opacity = useTransform(p, [at - 0.02, at - 0.003, at + 0.003, at + 0.022], [0, 1, 1, 0])
  return <motion.div className="journey__cut" style={{ opacity, backgroundColor: color }} aria-hidden="true" />
}

/** Draft of the full scroll story, at /journey. The homepage is unchanged. */
export default function Journey() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const spring = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.4 })
  const still = useMotionValue(0.9)
  const p = reduced ? still : spring
  const [choosing, setChoosing] = useState(!!reduced)
  const [picked, setPicked] = useState<number | null>(null)

  useMotionValueEvent(p, 'change', (x) => {
    const on = x >= T.chooseAt - 0.02
    setChoosing(on)
    if (!on) setPicked(null)
  })

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setPicked(null) }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])

  const skip = () => {
    const s = ref.current!
    window.scrollTo({ top: s.offsetTop + (s.offsetHeight - window.innerHeight) * 0.9, behavior: 'instant' })
    spring.jump(0.9)
  }

  const city = picked === null ? null : CITIES[picked]

  return (
    <section ref={ref} className={`journey${reduced ? ' journey--still' : ''}`} aria-label="How a city gets to your door">
      <div className="journey__stage">
        <p className="journey__loading">Building the city…</p>
        <Suspense fallback={null}>
          <JourneyCanvas progress={p} picked={picked} onPick={(i) => { if (p.get() >= T.chooseAt - 0.02) setPicked(i) }} />
        </Suspense>

        {!reduced && (
          <>
            {/* into the haze, down through the clouds, and in through the warm doorway */}
            <Cut p={p} at={T.explainEnd} color="#e9c4ae" />
            <Cut p={p} at={T.planeEnd} color="#eef5fb" />
            <Cut p={p} at={T.insideAt} color="#e9b676" />
            <Beat p={p} from={-0.02} to={0.05} className="journey__beat--low">
              <p className="journey__cue">Scroll to fly through the city ↓</p>
            </Beat>
            <Beat p={p} from={0.12} to={0.215} className="journey__beat--top">
              <h1 className="journey__title">Imagine all of this in one box.</h1>
            </Beat>
            <Beat p={p} from={0.225} to={0.325} className="journey__beat--left">
              <div className="journey__panel">
                <h2>That’s Marlowby.</h2>
                <p>A subscription box that brings you a different U.S. city every month.</p>
                <ol>
                  <li>We pick the month’s city.</li>
                  <li>We fill a box from its local businesses.</li>
                  <li>It arrives at your door.</li>
                </ol>
              </div>
            </Beat>
            <Beat p={p} from={0.35} to={0.47} className="journey__beat--top"><h2 className="journey__title">A city, on its way.</h2></Beat>
            <Beat p={p} from={0.49} to={0.59} className="journey__beat--top"><h2 className="journey__title">Across town.</h2></Beat>
            <Beat p={p} from={0.62} to={0.7} className="journey__beat--top"><h2 className="journey__title">Special delivery.</h2></Beat>
          </>
        )}

        {choosing && (
          <div className="journey__chooser">
            <h2 className="journey__title">{city ? `Inside: ${city.label.name}` : 'Peek inside a sample box.'}</h2>
            {city && (
              <div className="journey__contents" aria-live="polite">
                <ul>{city.items.map((item) => <li key={item}>{item}</li>)}</ul>
                <p>Sample ideas for illustration. We choose each month’s city.</p>
              </div>
            )}
            <div className="journey__buttons">
              {CITIES.map((c, i) => (
                <button key={c.label.name} type="button" className={`btn ${picked === i ? 'btn--primary' : 'btn--ghost'}`} aria-pressed={picked === i} onClick={() => setPicked(i)}>
                  {c.label.name}
                </button>
              ))}
              {city && <button type="button" className="btn btn--ghost" onClick={() => setPicked(null)}>Close box</button>}
              <Link to="/subscribe" className="btn btn--primary">Subscribe</Link>
            </div>
          </div>
        )}

        {!choosing && <button type="button" className="journey__skip" onClick={skip}>Skip to boxes</button>}
        <p className="journey__draft">Draft preview</p>
      </div>
    </section>
  )
}
