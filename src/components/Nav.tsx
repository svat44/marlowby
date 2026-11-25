import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Nav.css'

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.85)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  const home = pathname === '/'

  return (
    <header className={`nav${solid || !home ? ' nav--solid' : ''}`}>
      <Link to="/" className="nav__mark" aria-label="Marlowby home">
        Marlowby
      </Link>
      <nav aria-label="Primary">
        <ul className="nav__links">
          <li><a href="/#box">The box</a></li>
          <li><a href="/#how">How it works</a></li>
        </ul>
      </nav>
      <Link to="/subscribe" className="btn btn--primary nav__cta">
        Subscribe
      </Link>
    </header>
  )
}
