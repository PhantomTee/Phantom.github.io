'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletButton } from './wallet-button'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/graph',     label: 'Org Graph'  },
]

export function NavBar() {
  const path = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#030a12]/90 backdrop-blur-sm">
      <div className="px-6 lg:px-14 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="4" width="8" height="8" rx="1.5" fill="white" opacity="0.85"/>
            <rect x="16" y="4" width="8" height="8" rx="1.5" fill="white" opacity="0.18"/>
            <rect x="4" y="16" width="8" height="8" rx="1.5" fill="white" opacity="0.18"/>
            <rect x="16" y="16" width="8" height="8" rx="1.5" fill="#4ade80" opacity="0.8"/>
          </svg>
          <span className="font-mono text-[13px] tracking-[0.22em] uppercase text-white/70 group-hover:text-white transition-colors">
            Anita
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                path.startsWith(l.href)
                  ? 'text-white'
                  : 'text-white/28 hover:text-white/65'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Wallet — wrapped in monospace style */}
        <div className="flex items-center gap-4">
          <span className="hidden lg:block font-mono text-[10px] text-white/15 tracking-[0.15em] select-none">
            ARBITRUM SEPOLIA
          </span>
          <WalletButton />
        </div>

      </div>
    </header>
  )
}
