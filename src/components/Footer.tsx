import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__row">
        <p className="footer__line">A monthly box from a different U.S. city.</p>
        <nav aria-label="Footer">
          <ul className="footer__links">
            <li><a href="/#box">The box</a></li>
            <li><a href="/#how">How it works</a></li>
            <li><Link to="/subscribe">Subscribe</Link></li>
          </ul>
        </nav>
      </div>
      <p className="footer__mark" aria-hidden="true">Marlowby</p>
      <p className="mono footer__fine">© {new Date().getFullYear()} Marlowby</p>
    </footer>
  )
}
