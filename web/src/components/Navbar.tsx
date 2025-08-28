// web/src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Farmer Profile' },
  { href: '/ai', label: 'AI Advisor' },
  // Uncomment these if you have pages for them:
  // { href: '/activities', label: 'Activity Log' },
  // { href: '/advisories', label: 'Advisory Feed' },
  { href: 'http://localhost:8000/docs', label: 'API Docs', external: true },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-black/40 border-b border-white/40 dark:border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-emerald-600 font-bold text-xl">🌾 Krishi Sakhi</span>
          <span className="text-xs opacity-70 hidden sm:inline">Personal Farming Assistant</span>
        </Link>

        <nav className="flex gap-4 items-center">
          {links.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="btn"
                title="Open API docs"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`opacity-80 hover:opacity-100 ${
                  pathname === link.href ? 'font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  )
}
