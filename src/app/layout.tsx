import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space',
  display: 'swap',
  preload: false,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#020617',
}

export const metadata: Metadata = {
  title: 'AI Revenue Department — Enterprise AI Platform',
  description: '6 specialized AI agents that qualify leads, manage your pipeline, forecast revenue, and close deals — 24/7.',
  keywords: 'AI revenue, sales automation, lead qualification, pipeline intelligence, revenue forecasting',
  authors: [{ name: 'AI Revenue Department' }],
  openGraph: {
    title: 'AI Revenue Department',
    description: 'Your AI-powered revenue team. 6 agents. 24/7 operation.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Revenue Department',
    description: 'Your AI-powered revenue team. 6 agents. 24/7 operation.',
  },
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-ai-bg text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
