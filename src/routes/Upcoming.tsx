import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Upcoming({ title, notFound = false }: { title: string; notFound?: boolean }) {
  useEffect(() => {
    document.title = `${title} · Marlowby`
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Marlowby · A whole city at home'
    }
  }, [title])

  return (
    <section
      style={{
        minHeight: '80svh',
        display: 'grid',
        alignContent: 'center',
        gap: '1.5rem',
        padding: '8rem var(--gutter) var(--section)',
      }}
    >
      <h1
        style={{
          fontSize: 'var(--step-4)',
          fontWeight: 800,
          fontVariationSettings: "'wdth' 125",
          lineHeight: 0.95,
          letterSpacing: '-0.035em',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h1>
      <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'var(--step-2)', maxWidth: '28ch' }}>
        {notFound ? 'This street doesn’t exist yet.' : 'Plans and sign-up are on their way.'}
      </p>
      <p>
        <Link to="/" className="btn btn--ghost">
          Back to the homepage
        </Link>
      </p>
    </section>
  )
}
