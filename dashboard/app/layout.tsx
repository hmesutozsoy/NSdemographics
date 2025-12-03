import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NS Demographics Dashboard',
  description: 'Privacy-preserving demographic tracking for Network States',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

