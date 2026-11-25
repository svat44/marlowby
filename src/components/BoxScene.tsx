import { useEffect, useRef, useState } from 'react'
import {
  motionValue,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import KraftBox from './KraftBox'
import './BoxScene.css'

type Item = { maker: string; place: string; thing: string }
type Good = { label: string; x: number; z: number; w: number; h: number; tone: string }

const FULL = motionValue(1)
const COMPACT_QUERY = '(max-width: 860px)'

function useCompact() {
  const [compact, setCompact] = useState(() => window.matchMedia(COMPACT_QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY)
    const on = () => setCompact(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return compact
}

const ITEMS: Item[] = [
  { maker: 'Russ & Daughters', place: 'Lower East Side · since 1914', thing: 'Chocolate babka from the appetizing shop on Houston Street' },
  { maker: 'Levain Bakery', place: 'Upper West Side · since 1995', thing: 'Chocolate chip walnut cookies, the six-ounce kind' },
  { maker: 'Kalustyan’s', place: 'Murray Hill · since 1944', thing: 'Za’atar from the spice shelves on Lexington Avenue' },
  { maker: 'McNulty’s Tea & Coffee', place: 'West Village · since 1895', thing: 'House coffee, whole bean, from Christopher Street' },
  { maker: 'A walk, written for the box', place: 'Lower East Side', thing: 'A walking route through the neighborhood, with stops worth making' },
]

// The goods inside the box, in list order. Positions are fractions of the box's width and depth.
const GOODS: Good[] = [
  { label: 'Babka', x: 0.06, z: -0.28, w: 0.24, h: 0.62, tone: 'cream' },
  { label: 'Cookies', x: 0.33, z: -0.3, w: 0.22, h: 0.78, tone: 'teal' },
  { label: 'Za’atar', x: 0.58, z: -0.18, w: 0.15, h: 0.62, tone: 'kraft' },
  { label: 'Coffee', x: 0.74, z: -0.3, w: 0.2, h: 0.86, tone: 'coral' },
  { label: 'Map', x: 0.16, z: 0.02, w: 0.34, h: 0.46, tone: 'map' },
]

function at(i: number) {
  return 0.42 + i * 0.1
}

function Good({ good, i, progress }: { good: Good; i: number; progress: MotionValue<number> }) {
  // Rest with the top just under the tissue; rise until about half shows above the rim.
  const lift = useTransform(progress, [at(i) - 0.07, at(i)], [0, 1])
  const transform = useMotionTemplate`translateX(calc(var(--w) * ${good.x})) translateZ(calc(var(--d) * ${good.z})) translateY(calc(var(--h) * ((1 - ${good.h}) - ((1 - ${good.h}) + 0.55 * ${good.h}) * ${lift})))`
  return (
    <motion.div
      className={`box__good box__good--${good.tone}`}
      style={{ transform, width: `calc(var(--w) * ${good.w})`, height: `calc(var(--h) * ${good.h})` }}
    >
      <span>{good.label}</span>
    </motion.div>
  )
}

function Row({ item, i, progress }: { item: Item; i: number; progress: MotionValue<number> }) {
  const a = at(i)
  const opacity = useTransform(progress, [a - 0.06, a], [0.22, 1])
  const x = useTransform(progress, [a - 0.06, a], [18, 0])
  const bar = useTransform(progress, [a - 0.06, a], [0, 1])
  return (
    <motion.li className="box-list__row" style={{ opacity, x }}>
      <motion.span className="box-list__bar" style={{ scaleX: bar }} aria-hidden="true" />
      <h3 className="box-list__maker">{item.maker}</h3>
      <p className="mono box-list__place">{item.place}</p>
      <p className="box-list__thing">{item.thing}</p>
    </motion.li>
  )
}

export default function BoxScene() {
  const ref = useRef<HTMLElement>(null)
  const objectRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const compact = useCompact()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // On phones the box scrolls past instead of pinning, so it opens against its own position.
  const { scrollYProgress: objectProgress } = useScroll({ target: objectRef, offset: ['start 0.9', 'start 0.2'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const op = useSpring(objectProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const boxP = compact ? op : p
  const range = compact ? [0, 0.5] : [0.16, 0.42]
  // Goods follow the list on desktop; on phones they rise as the box finishes opening.
  const goodsP = useTransform(op, [0.45, 1], [0.35, 0.9])
  const goodsProgress = reduce ? FULL : compact ? goodsP : p

  const spin = useTransform(boxP, [0, 1], [-38, -16])
  const tilt = useTransform(boxP, [0, 0.4, 1], [-16, -24, -20])
  const lid = useTransform(boxP, range, [-90, 24])
  const rise = useTransform(boxP, range, [0, -8])

  const boxTransform = useMotionTemplate`rotateX(${tilt}deg) rotateY(${spin}deg)`
  const lidTransform = useMotionTemplate`translateZ(calc(var(--d) / -2)) rotateX(${lid}deg) translateY(${rise}px)`

  return (
    <section ref={ref} id="box" className="box-scene" aria-labelledby="box-title">
      <div className="box-scene__stage">
        <div ref={objectRef} className="box-scene__object" aria-hidden="true">
          <KraftBox
            no="No. 001"
            city="New York, NY"
            coords="40.7128° N · 74.0060° W"
            greeting="New York."
            boxTransform={reduce ? 'rotateX(-22deg) rotateY(-24deg)' : boxTransform}
            lidTransform={reduce ? 'translateZ(calc(var(--d) / -2)) rotateX(24deg)' : lidTransform}
          >
            {GOODS.map((g, i) => (
              <Good key={g.label} good={g} i={i} progress={goodsProgress} />
            ))}
          </KraftBox>
          <div className="box__shadow" />
        </div>

        <div className="box-scene__copy">
          <h2 id="box-title" className="box-scene__title">
            What a city fits in a box
          </h2>
          <p className="box-scene__lede">
            Every maker in a box is a small business the city already loves. These show what a New York month could hold.
          </p>
          <ol className="box-list">
            {ITEMS.map((item, i) => (
              <Row key={item.maker} item={item} i={i} progress={reduce || compact ? FULL : p} />
            ))}
          </ol>
          <p className="box-scene__note">
            Sample box. Makers and contents are shown to illustrate a New York month.
          </p>
        </div>
      </div>
    </section>
  )
}
