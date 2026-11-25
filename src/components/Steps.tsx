import { motion } from 'motion/react'
import './Steps.css'

const STEPS = [
  { title: 'Pick a plan', body: 'Choose the plan that fits how you like to explore.' },
  { title: 'We pick the city', body: 'Each month is a different U.S. city, filled by its own small businesses.' },
  { title: 'Open the city', body: 'Your box brings local goods, the people behind them, and a cultural experience from the city.' },
]

export default function Steps() {
  return (
    <section id="how" className="steps" aria-labelledby="how-title">
      <h2 id="how-title" className="steps__title">
        How it works
      </h2>
      <ol className="steps__list">
        {STEPS.map((s, i) => (
          <motion.li
            key={s.title}
            className="steps__item"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="steps__num" aria-hidden="true">{i + 1}</span>
            <h3 className="steps__name">{s.title}</h3>
            <p className="steps__body">{s.body}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
