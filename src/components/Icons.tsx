type P = { className?: string }

export const ArrowRight = ({ className }: P) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
  </svg>
)

export const ArrowDown = ({ className }: P) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2v11M3.5 9 8 13.5 12.5 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
  </svg>
)

export const Pause = ({ className }: P) => (
  <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
    <rect x="3.5" y="2.5" width="3" height="11" fill="currentColor" />
    <rect x="9.5" y="2.5" width="3" height="11" fill="currentColor" />
  </svg>
)

export const Play = ({ className }: P) => (
  <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 2.5v11L13.5 8z" fill="currentColor" />
  </svg>
)
