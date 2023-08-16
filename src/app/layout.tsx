// Layout for entire app
// Uses providers.tsx

import { Inter } from 'next/font/google'
import { Providers } from "./providers";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Reddit - Dive into anything',
  description: 'App created with Next.js',
}

import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
