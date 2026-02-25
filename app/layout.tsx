import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ArchiveProvider } from '@/shared/lib/archive-context'
import '../styles/style.css'

export const metadata: Metadata = {
  title: 'The Museum - Digital Performance NFT Platform',
  description: 'Discover, mint, and showcase legendary digital performances on the blockchain. Join a global community of creators and collectors.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ArchiveProvider>
          {children}
        </ArchiveProvider>
        <Analytics />
      </body>
    </html>
  )
}
