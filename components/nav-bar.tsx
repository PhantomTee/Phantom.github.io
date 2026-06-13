'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletButton } from './wallet-button'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/graph', label: 'Org Graph' },
]

export function NavBar() {
  const path = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="4" width="8" height="8" rx="1" fill="white" opacity="0.9"/>
            <rect x="16" y="4" width="8" height="8" rx="1" fill="white" opacity="0.5"/>
            <rect x="4" y="16" width="8" height="8" rx="1" fill="white" opacity="0.5"/>
            <rect x="16" y="16" width="8" height="8" rx="1" fill="#4ade80" opacity="0.9"/>
          </svg>
          <span className="font-bold text-white tracking-tight">Anita</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                path.startsWith(l.href)
                  ? 'bg-white/5 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <WalletButton />
      </div>
    </header>
  )
}
