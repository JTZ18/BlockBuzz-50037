'use client';

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import Header from './components/Header'
import { Toaster } from './components/ui/toaster';
import Web3ContextProvider from './context/Web3Context';
import CachedProfilesAndPostsContextProvider from './context/CachedProfilesAndPostsContext/CachedProfilesAndPostsContextProvider';
import EthersContextProvider from './context/EthersContext/EthersContextProvider';


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
              <Header />
              {children}
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