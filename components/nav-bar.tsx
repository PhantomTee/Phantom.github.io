'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/graph', label: 'Org Graph' },
  { href: '#features', label: 'Features' },
  { href: '#manifesto', label: 'About' },
]

export function NavBar() {
  const path = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="4" width="8" height="8" rx="1" fill="white" opacity="0.9"/>
            <rect x="16" y="4" width="8" height="8" rx="1" fill="white" opacity="0.5"/>
            <rect x="4" y="16" width="8" height="8" rx="1" fill="white" opacity="0.5"/>
            <rect x="16" y="16" width="8" height="8" rx="1" fill="#4ade80" opacity="0.9"/>
          </svg>
          <span className="font-bold text-white tracking-tight text-lg">Anita</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                path.startsWith(l.href)
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-200'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <button className="text-sm font-medium text-white border border-white/20 rounded-lg px-4 py-2 hover:border-white/40 hover:bg-white/5 transition-all">
          Connect Wallet
        </button>
      </div>
    </header>
  )
}
