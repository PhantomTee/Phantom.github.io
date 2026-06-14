import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import { AgentsProvider } from '@/components/agents/agents-provider'
import { Web3Providers } from '@/components/web3-providers'
import { NavBar } from '@/components/nav-bar'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Anita — AI That Understands, Acts, Learns',
  description:
    'The technology framework behind human-like AI cognition. Hire AI agents, assign USDC budgets, and enforce trust-gated autonomy on Arbitrum.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#030a12] text-white antialiased font-body">
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
