// For Chakra
// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../chakra/theme'
import Layout from "../components/Layout/Layout"
import { RecoilRoot } from 'recoil'

export function Providers({ children } : { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Layout>
            {children}
          </Layout>
        </ChakraProvider>
      </RecoilRoot>
    </CacheProvider>
  )
}
