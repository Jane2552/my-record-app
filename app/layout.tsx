import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Noto_Sans_TC } from 'next/font/google'
import './globals.css'

const _notoSansTC = Noto_Sans_TC({ subsets: ['latin'], weight: ['400', '500', '700'] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '600'] })

export const metadata: Metadata = {
  title: '日記簿 · 月曆記錄',
  description: '用月曆咁睇自己嘅每日記錄，隨時新增，點開任何一日睇返詳情。',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f3f6f9',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-HK" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
