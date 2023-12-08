'use client';

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import Header from './components/Header'
import LeftNavBar from './components/LeftNav';
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
  // return (
  //   <html lang="en">
  //     <body className={inter.className}>
  //       <ThemeProvider
  //         attribute="class"
  //         defaultTheme="system"
  //         enableSystem
  //         disableTransitionOnChange
  //         >
  //         {/* <Web3ContextProvider> */}
  //         <CachedProfilesAndPostsContextProvider>
  //           <EthersContextProvider>
  //             <div className="flex flex-col min-h-screen">
  //               <Header />
  //               <main className="flex-1">{children}</main>
  //             </div>
  //             <Toaster/>
  //           </EthersContextProvider>
  //         </CachedProfilesAndPostsContextProvider>
  //         {/* </Web3ContextProvider> */}
  //       </ThemeProvider>
  //     </body>
  //   </html>
  // )
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CachedProfilesAndPostsContextProvider>
            <EthersContextProvider>
              {/* Flex container for the entire page */}
              <div className="flex flex-col min-h-screen">
                
                {/* Header at the top of the page */}
                <Header />
  
                {/* Flex container for the main content area and LeftNavBar */}
                <div className="flex flex-row flex-1">
                  
                  {/* LeftNavBar should also have `flex-shrink-0` to prevent it from shrinking */}
                  <LeftNavBar />
  
                  {/* Main content area to the right of the LeftNavBar */}
                  <main className="flex-1 mt-24 ml-24">{children}</main>
                </div>
  
              </div>
              <Toaster/>
            </EthersContextProvider>
          </CachedProfilesAndPostsContextProvider>
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