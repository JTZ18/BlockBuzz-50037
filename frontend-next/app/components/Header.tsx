"use client";

import { useState, useEffect, useContext } from "react";
import type { JSX } from "react";
import { useTheme } from "next-themes";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
// import ButtonSignin from "./ButtonSignin";
import Container from "./ui/container";
import { Button } from "./ui/button";
import { Menu, Moon, ShoppingCart, Sun } from "lucide-react";
import {Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription, } from "./ui/sheet";
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "./ui/tooltip"
import ProfileButton from "./ui/ProfileButton";
import ConnectWalletButton from "./ConnectWalletButton";
import { IWeb3Context, useWeb3Context } from '../context/Web3Context'
import ConnectUniversalProfileButton from "./ConnectUniversalProfileButton";
import EthersContext from "../context/EthersContext/EthersContext";
import clsx from "clsx";


const Header = () => {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  // const {
  //   connectWallet,
  //   disconnect,
  //   state: { isAuthenticated, address, currentChain, provider },
  // } = useWeb3Context() as IWeb3Context;

  const { universalProfile } = useContext(EthersContext)

  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  useEffect(() => {
    console.log(universalProfile)
  }, [universalProfile])


  return (
    <header className="sm:flex sm:justify-between py-3 px-4 border-b fixed w-full bg-slate-950" style={{zIndex: 1}}>
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger>
                <Menu className="h-6 md:hidden w-6" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  {/* {routes.map((route, i) => (
                    <Link
                      key={i}
                      href={route.href}
                      className="block px-2 py-1 text-lg"
                    >
                      {route.label}
                    </Link>
                  ))} */}
                    <Link
                      href={`/`}
                      className="block px-2 py-1 text-lg"
                    >
                      {`Home`}
                    </Link>
                    {universalProfile ? (
                      <Link
                        href={`/profile/${universalProfile.address}`}
                        className="block px-2 py-1 text-lg"
                      >
                        {`Profile`}
                      </Link>
                      ) : (
                        <span className="block px-2 py-1 text-lg text-gray-500 cursor-not-allowed">
                          {`Profile`}
                        </span>
                    )}
                    {universalProfile ? (
                      <Link
                        href={`/following/${universalProfile.address}`}
                        className="block px-2 py-1 text-lg"
                      >
                        {`Following`}
                      </Link>
                      ) : (
                      <span className="block px-2 py-1 text-lg text-gray-500 cursor-not-allowed">
                        {`Following`}
                      </span>
                    )}
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="ml-4 lg:ml-0">
              <h1 className="text-xl font-bold">BlockBuzz</h1>
            </Link>
          </div>
          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 hidden md:block">
            {/* {routes.map((route, i) => (
              <Button key={i} asChild variant="ghost">
                <Link
                  key={i}
                  href={route.href}
                  className="text-sm font-medium transition-colors"
                >
                  {route.label}
                </Link>
              </Button>
            ))} */}
            <Button asChild variant="ghost">
              <Link
                href={`/`}
                className={clsx("text-sm font-medium transition-colors", {
                  "underline": pathname === '/'
                })}
              >
                {`Home`}
              </Link>
            </Button>
            <Button asChild variant="ghost">
              {universalProfile ? (
                <Link
                  href={`/profile/${universalProfile.address}`}
                  className={clsx("text-sm font-medium transition-colors", {
                    "underline": pathname === `/profile/${universalProfile.address}`
                  })}
                >
                  {`Profile`}
                </Link>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <span className="text-sm font-medium text-gray-500 cursor-not-allowed">
                      {`Profile`}
                    </span>
                    </TooltipTrigger>
                  <TooltipContent>
                   <p>Connect your UP</p>
                 </TooltipContent>
               </Tooltip>
             </TooltipProvider>
              )}
            </Button>
            <Button asChild variant="ghost">
              {universalProfile ? (
                <Link
                  href={`/following/${universalProfile.address}`}
                  className={clsx("text-sm font-medium transition-colors", {
                    "underline": pathname === `/following/${universalProfile.address}`
                  })}
                >
                  {`Following`}
                </Link>
              ) : (
                <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                <span className="text-sm font-medium text-gray-500 cursor-not-allowed">
                  {`Following`}
                </span>
                </TooltipTrigger>
                <TooltipContent>
                 <p>Connect your UP</p>
               </TooltipContent>
             </Tooltip>
           </TooltipProvider>
              )}
            </Button>
          </nav>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              className="mr-6"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle Theme</span>
            </Button>
            {/* {isAuthenticated ? <ProfileButton /> : <ConnectWalletButton />} */}
            {universalProfile ? <ProfileButton /> : <ConnectUniversalProfileButton />}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;