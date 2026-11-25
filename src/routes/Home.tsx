import { useReducedMotion } from 'motion/react'
import Hero from '../components/Hero'
import Statement from '../components/Statement'
import BoxScene from '../components/BoxScene'
import ScrollStory from '../components/scroll/ScrollStory'
import Steps from '../components/Steps'
import Closing from '../components/Closing'

export default function Home() {
  // The pinned scroll-through is all motion; people who ask for less motion get the same story as a plain scroll.
  const reduce = useReducedMotion()
  return (
    <>
      {reduce ? (
        <>
          <Hero />
          <Statement />
          <BoxScene />
        </>
      ) : (
        <ScrollStory />
      )}
      <Steps />
      <Closing />
    </>
  )
}
