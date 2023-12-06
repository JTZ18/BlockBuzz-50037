'use client';

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { ThemeProvider } from '@/app/components/ThemeProvider'
import Header from '@/app/components/Header'
import { Toaster } from '@/app/components/ui/toaster';
import Web3ContextProvider from '@/app/context/Web3Context';
import CachedProfilesAndPostsContextProvider from '@/app/context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContextProvider';
import EthersContextProvider from '@/app/context/EthersContext/EthersContextProvider';


const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
          {/* <Web3ContextProvider> */}
          <CachedProfilesAndPostsContextProvider>
            <EthersContextProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
              </div>
              <Toaster/>
            </EthersContextProvider>
          </CachedProfilesAndPostsContextProvider>
          {/* </Web3ContextProvider> */}
        </ThemeProvider>
      </body>
    </html>
  )
}


{/* <CachedProfilesAndPostsContextProvider>
<EthersContextProvider>
  <App />
  <ToastContainer
      style={{ cursor: "default" }}
      autoClose={15000}
      theme="colored"
      closeOnClick={false}
      pauseOnFocusLoss={false}
    />
</EthersContextProvider>
</CachedProfilesAndPostsContextProvider> */}