import { Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './routes/Home'
import Upcoming from './routes/Upcoming'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/subscribe" element={<Upcoming title="Subscribe" />} />
          <Route path="*" element={<Upcoming title="Page not found" notFound />} />
        </Routes>
      </main>
      <Footer />
    </MotionConfig>
  )
}
