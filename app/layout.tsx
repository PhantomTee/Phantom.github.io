import type { Metadata } from 'next'
import './globals.css'
import { AgentsProvider } from '@/components/agents/agents-provider'
import { Web3Providers } from '@/components/web3-providers'
import { NavBar } from '@/components/nav-bar'

export const metadata: Metadata = {
  title: 'Anita — AI That Understands, Acts, Learns',
  description:
    'The technology framework behind human-like AI cognition. Hire AI agents, assign USDC budgets, and enforce trust-gated autonomy on Arbitrum.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        <Web3Providers>
          <AgentsProvider>
            <NavBar />
            <main>{children}</main>
          </AgentsProvider>
        </Web3Providers>
      </body>
    </html>
  )
}
