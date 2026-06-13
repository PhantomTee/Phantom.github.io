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
          className="flex items-center gap-2 text-sm font-medium text-white border border-white/20 rounded-lg px-3 py-2 hover:border-white/40 hover:bg-white/5 transition-all"
        >
          <span className="h-2 w-2 rounded-full bg-green-400" />
          <span className="hidden sm:inline">{address.slice(0, 6)}…{address.slice(-4)}</span>
          <span className="sm:hidden">Connected</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-gray-950 shadow-xl p-2 z-50">
            <div className="px-3 py-2 text-xs text-gray-500 border-b border-white/5 mb-1">
              {chain?.name ?? 'Unknown network'}
            </div>
            <button
              onClick={() => { disconnect(); setOpen(false) }}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors"
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
        className="text-sm font-medium text-white border border-white/20 rounded-lg px-4 py-2 hover:border-white/40 hover:bg-white/5 transition-all disabled:opacity-50"
      >
        {isPending ? 'Connecting…' : 'Connect Wallet'}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-gray-950 shadow-xl p-2 z-50">
          <p className="px-3 py-2 text-xs text-gray-500 border-b border-white/5 mb-1">
            Choose wallet
          </p>
          {connectors.map(c => (
            <button
              key={c.id}
              onClick={() => { connect({ connector: c }); setOpen(false) }}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
