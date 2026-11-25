import type { ReactNode } from 'react'
import { motion, type MotionValue } from 'motion/react'

type T = string | MotionValue<string>

type Props = {
  no: string
  city: string
  coords: string
  greeting?: string
  boxTransform: T
  lidTransform: T
  children?: ReactNode
}

/** The Marlowby box, built from flat CSS 3D faces. Styles live in BoxScene.css. */
export default function KraftBox({ no, city, coords, greeting, boxTransform, lidTransform, children }: Props) {
  return (
    <motion.div className="box" style={{ transform: boxTransform }}>
      <div className="box__face box__face--front">
        <div className="box__label">
          <span className="box__label-mark">Marlowby</span>
          <span className="mono">{no}</span>
          <span className="box__label-city">{city}</span>
          <span className="mono">{coords}</span>
        </div>
      </div>
      <div className="box__face box__face--front-inner" />
      <div className="box__face box__face--back" />
      <div className="box__face box__face--right">
        <span className="box__stamp">Open here</span>
      </div>
      <div className="box__face box__face--left" />
      <div className="box__face box__face--floor" />
      {children}
      <div className="box__tissue" />
      <motion.div className="box__lid" style={{ transform: lidTransform }}>
        <div className="box__lid-face box__lid-face--inner">
          {greeting && (
            <>
              <span>Hello from</span>
              <strong>{greeting}</strong>
            </>
          )}
        </div>
        <div className="box__lid-face box__lid-face--outer">
          <span>Marlowby</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
