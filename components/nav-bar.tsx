'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletButton } from './wallet-button'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/graph',     label: 'Org Graph'  },
  { href: '/compare',   label: 'Compare'    },
]

function useDark() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = stored === 'dark' || (!stored && prefersDark)
    setDark(initial)
    document.documentElement.classList.toggle('dark', initial)
  }, [])
  function toggle() {
    setDark(d => {
      const next = !d
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('theme', next ? 'dark' : 'light')
      return next
    })
  }
  return { dark, toggle }
}

export function NavBar() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const { dark, toggle } = useDark()

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-white/70 dark:bg-black/60 backdrop-blur-md border-b border-neutral-200/50 dark:border-white/10">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none" onClick={() => setOpen(false)}>
          <span className="font-display text-[21px] sm:text-[26px] tracking-tight text-black dark:text-white font-medium leading-none">
            Anita
          </span>
          <span className="font-display text-[25px] sm:text-[30px] text-black dark:text-white font-medium leading-none tracking-[-0.02em] mb-1">
            ✱
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 font-display text-[22px] text-black dark:text-white font-medium tracking-tight">
          {NAV_LINKS.map((l, i) => (
            <span key={l.href} className="flex items-center">
              {i > 0 && <span className="opacity-30 select-none">,&nbsp;</span>}
              <Link
                href={l.href}
                className={`hover:opacity-60 transition-opacity ${path.startsWith(l.href) ? 'opacity-100' : 'opacity-55'}`}
              >
                {l.label}
              </Link>
            </span>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-5">
          <button onClick={toggle} aria-label="Toggle dark mode" className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors text-[18px]">
            {dark ? '○' : '●'}
          </button>
          <WalletButton textMode />
        </div>

        {/* Mobile: wallet + dark toggle + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button onClick={toggle} aria-label="Toggle dark mode" className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors text-[16px]">
            {dark ? '○' : '●'}
          </button>
          <WalletButton />
          <button
            onClick={() => setOpen(v => !v)}
            className="flex flex-col gap-[5px] p-1"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-[2px] bg-black dark:bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`w-6 h-[2px] bg-black dark:bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-[2px] bg-black dark:bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-sm flex flex-col items-start justify-center px-8 gap-8 transition-all duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {NAV_LINKS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="font-display text-[32px] font-medium text-black dark:text-white tracking-tight hover:opacity-60 transition-opacity"
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
