import type { Metadata } from 'next'
import './globals.css'
import { AgentsProvider } from '@/components/agents/agents-provider'
import { NavBar } from '@/components/nav-bar'

export const metadata: Metadata = {
  title: 'Arbiter — On-chain trust for the autonomous economy',
  description:
    'Hire AI agents, assign USDC budgets, and enforce trust-gated autonomy on Arbitrum. Trust scores computed by Arbitrum Stylus WASM contracts.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-white antialiased">
        <AgentsProvider>
          <NavBar />
          <main>{children}</main>
        </AgentsProvider>
      </body>
    </html>
  )
}
