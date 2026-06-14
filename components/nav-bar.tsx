'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletButton } from './wallet-button'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/graph',     label: 'Org Graph'  },
  { href: '/compare',   label: 'Compare'    },
]

export function NavBar() {
  const path = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none" onClick={() => setOpen(false)}>
          <span className="text-[21px] sm:text-[26px] tracking-tight text-black font-medium leading-none">
            Anita
          </span>
          <span className="text-[25px] sm:text-[30px] text-black font-medium leading-none tracking-[-0.02em] mb-1">
            ✱
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center text-[23px] text-black">
          {NAV_LINKS.map((l, i) => (
            <span key={l.href} className="flex items-center">
              {i > 0 && <span className="opacity-40">,&nbsp;</span>}
              <Link
                href={l.href}
                className={`hover:opacity-60 transition-opacity ${path.startsWith(l.href) ? 'opacity-100' : 'opacity-70'}`}
              >
                {l.label}
              </Link>
            </span>
          ))}
        </nav>

        {/* Desktop right: wallet in text style */}
        <div className="hidden md:flex items-center">
          <WalletButton textMode />
        </div>

        {/* Mobile: wallet + hamburger */}
        <div className="flex md:hidden items-center gap-4">
          <WalletButton />
          <button
            onClick={() => setOpen(v => !v)}
            className="flex flex-col gap-[5px] p-1"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-[2px] bg-black transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`}
            />
            <span
              className={`w-6 h-[2px] bg-black transition-all duration-300 ${open ? 'opacity-0' : ''}`}
            />
            <span
              className={`w-6 h-[2px] bg-black transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[9] bg-white/95 backdrop-blur-sm flex flex-col items-start justify-center px-8 gap-8 transition-all duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {NAV_LINKS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-[32px] font-medium text-black tracking-tight hover:opacity-60 transition-opacity"
          >
            {l.label}
          </Link>
        ))}
        <div onClick={() => setOpen(false)}>
          <WalletButton textMode />
        </div>
      </div>
    </>
  )
}
