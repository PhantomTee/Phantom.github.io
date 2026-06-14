import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'Anita — AI That Understands, Acts, Learns',
  description:
    'The technology framework behind human-like AI cognition. Hire AI agents, assign USDC budgets, and enforce trust-gated autonomy on Arbitrum.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="relative bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
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
