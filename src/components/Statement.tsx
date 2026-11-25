import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import './Statement.css'

const TEXT =
  'Every month we pick one American city. Its bakers, roasters, spice merchants and shopkeepers fill a box, and we send that city to your door.'

function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total
  const opacity = useTransform(progress, [start * 0.9, start * 0.9 + 0.12], [0.16, 1])
  return (
    <motion.span className="statement__word" style={{ opacity }}>
      {word}{' '}
    </motion.span>
  )
}

export default function Statement() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] })
  const words = TEXT.split(' ')

  return (
    <section ref={ref} className="statement" aria-label="What Marlowby is">
      <p className="statement__text">
        {words.map((w, i) => (
          <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} />
        ))}
      </p>
    </section>
  )
}
