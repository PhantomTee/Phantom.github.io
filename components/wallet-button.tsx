'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useState } from 'react'

interface WalletButtonProps {
  textMode?: boolean
}

export function WalletButton({ textMode = false }: WalletButtonProps) {
  const { address, isConnected, chain } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [open, setOpen] = useState(false)

  const textClass = textMode
    ? 'text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity font-sans'
    : 'flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-neutral-500 border border-neutral-200 px-5 py-3 hover:border-neutral-400 hover:text-neutral-900 transition-all'

  if (isConnected && address) {
    return (
      <div className="relative">
        <button onClick={() => setOpen(o => !o)} className={textMode ? textClass : textClass}>
          {textMode ? (
            <>
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1 align-middle" />
              {address.slice(0, 6)}…{address.slice(-4)}
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-green-400/80" />
              <span className="hidden sm:inline">{address.slice(0, 6)}…{address.slice(-4)}</span>
              <span className="sm:hidden">Connected</span>
            </>
          )}
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-52 border border-neutral-100 bg-white shadow-lg p-2 z-50">
            <div className="px-4 py-3 font-mono text-[10px] text-neutral-400 tracking-[0.18em] uppercase border-b border-neutral-100 mb-1">
              {chain?.name ?? 'Unknown network'}
            </div>
            <button
              onClick={() => { disconnect(); setOpen(false) }}
              className="w-full text-left px-4 py-3 font-mono text-[11px] tracking-[0.15em] uppercase text-red-400 hover:text-red-600 hover:bg-neutral-50 transition-colors"
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
        className={textMode
          ? `${textClass} disabled:opacity-40`
          : 'font-mono text-[11px] tracking-[0.18em] uppercase text-neutral-500 border border-neutral-200 px-5 py-3 hover:border-neutral-400 hover:text-neutral-900 transition-all disabled:opacity-30'
        }
      >
        {isPending ? 'Connecting…' : 'Connect Wallet'}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 border border-neutral-100 bg-white shadow-lg p-2 z-50">
          <p className="px-4 py-3 font-mono text-[10px] text-neutral-400 tracking-[0.18em] uppercase border-b border-neutral-100 mb-1">
            Choose Wallet
          </p>
          {connectors.map(c => (
            <button
              key={c.id}
              onClick={() => { connect({ connector: c }); setOpen(false) }}
              className="w-full text-left px-4 py-3 font-mono text-[11px] tracking-[0.12em] uppercase text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
