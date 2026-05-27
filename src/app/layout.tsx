import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PERSONA X — Build Your AI Influencer',
  description: 'Create your AI influencer persona, generate consistent photos, animate cinematic reels, and write viral content. Your Brand. Your AI. Your Rules.',
  keywords: 'AI influencer, AI persona, virtual influencer, content creator, AI image generator, Persona X',
  openGraph: {
    title: 'PERSONA X',
    description: 'Your Brand. Your AI. Your Rules.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
