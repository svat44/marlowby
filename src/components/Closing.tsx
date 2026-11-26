import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import KraftBox from './KraftBox'
import { ArrowRight } from './Icons'
import './BoxScene.css'
import './Closing.css'

const CLOSED_LID = 'translateZ(calc(var(--d) / -2)) rotateX(-90deg)'

export default function Closing() {
  const reduce = useReducedMotion()
  return (
    <section className="closing" aria-labelledby="closing-title">
      <h2 id="closing-title" className="closing__title">
        Explore Your City,
        <span className="closing__serif"> One Box at a Time.</span>
      </h2>
      <motion.div
        className="box-scene__object closing__box"
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <KraftBox
          no="No. 002"
          city="Next city"
          coords="Ships next month"
          boxTransform="rotateX(-20deg) rotateY(24deg)"
          lidTransform={CLOSED_LID}
        />
        <div className="box__shadow" />
      </motion.div>
      <div className="closing__actions">
        <Link to="/subscribe" className="btn btn--primary closing__cta">
          Subscribe <ArrowRight />
        </Link>
        <a href="#how" className="btn btn--ghost">
          How it works
        </a>
      </div>
    </section>
  )
}
