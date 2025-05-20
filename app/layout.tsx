import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from './components/ClientLayout'

export const metadata: Metadata = {
  title: 'Blog Website',
  description: 'A modern blog website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
} 