import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PIT Solutions - Sales Intelligence Dashboard',
  description: 'Advanced sales intelligence platform for merging company and people datasets to provide actionable insights for sales teams.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-white min-h-screen'}>
        {children}
      </body>
    </html>
  )
} 