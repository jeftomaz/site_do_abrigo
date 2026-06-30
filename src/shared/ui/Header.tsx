import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../app/theme'

const NAV_LINKS = [
  { label: 'Doação', href: '/#doacao' },
  { label: 'Adoção', href: '/adocao' },
  { label: 'Histórias', href: '/#historias' },
  { label: 'Eventos', href: '/#eventos' },
] as const

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  function handleNavClick(href: string) {
    setMenuOpen(false)
    if (href.startsWith('/#') && location.pathname === '/') {
      const id = href.slice(2)
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 h-14">
        <Link to="/" className="font-semibold text-gray-900 dark:text-gray-100 hover:opacity-80 transition-opacity">
          Abrigo
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <NavItem key={link.href} link={link} onClick={handleNavClick} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Abrir menu"
            className="sm:hidden text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 flex flex-col gap-3">
          {NAV_LINKS.map(link => (
            <NavItem key={link.href} link={link} onClick={handleNavClick} mobile />
          ))}
        </nav>
      )}
    </header>
  )
}

interface NavItemProps {
  link: { label: string; href: string }
  onClick: (href: string) => void
  mobile?: boolean
}

function NavItem({ link, onClick, mobile }: NavItemProps) {
  const base = 'text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors'
  const mobileClass = mobile ? 'py-1' : ''

  if (link.href.startsWith('/') && !link.href.startsWith('/#')) {
    return (
      <Link to={link.href} className={`${base} ${mobileClass}`} onClick={() => onClick(link.href)}>
        {link.label}
      </Link>
    )
  }

  return (
    <a href={link.href} className={`${base} ${mobileClass}`} onClick={() => onClick(link.href)}>
      {link.label}
    </a>
  )
}
