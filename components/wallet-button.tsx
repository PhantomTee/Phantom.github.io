'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useState } from 'react'

export function WalletButton() {
  const { address, isConnected, chain } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [open, setOpen] = useState(false)

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-white/55 border border-white/[0.12] px-5 py-3 hover:border-white/35 hover:text-white transition-all"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-400/80" />
          <span className="hidden sm:inline">{address.slice(0, 6)}…{address.slice(-4)}</span>
          <span className="sm:hidden">Connected</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-52 border border-white/[0.08] bg-[#030a12] shadow-2xl p-2 z-50">
            <div className="px-4 py-3 font-mono text-[10px] text-white/20 tracking-[0.18em] uppercase border-b border-white/[0.06] mb-1">
              {chain?.name ?? 'Unknown network'}
            </div>
            <button
              onClick={() => { disconnect(); setOpen(false) }}
              className="w-full text-left px-4 py-3 font-mono text-[11px] tracking-[0.15em] uppercase text-red-400/60 hover:text-red-400 hover:bg-white/[0.03] transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        disabled={isPending}
        className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/50 border border-white/[0.12] px-5 py-3 hover:border-white/35 hover:text-white transition-all disabled:opacity-30"
      >
        {isPending ? 'Connecting…' : 'Connect Wallet'}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 border border-white/[0.08] bg-[#030a12] shadow-2xl p-2 z-50">
          <p className="px-4 py-3 font-mono text-[10px] text-white/20 tracking-[0.18em] uppercase border-b border-white/[0.06] mb-1">
            Choose Wallet
          </p>
          {connectors.map(c => (
            <button
              key={c.id}
              onClick={() => { connect({ connector: c }); setOpen(false) }}
              className="w-full text-left px-4 py-3 font-mono text-[11px] tracking-[0.12em] uppercase text-white/35 hover:bg-white/[0.03] hover:text-white/70 transition-colors"
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
