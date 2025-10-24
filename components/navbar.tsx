"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { ConnectButton } from "./wallet/connect-button";
import { NetworkSwitcher } from "./wallet/network-switcher";

import { siteConfig } from "@/config/site";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative px-5 lg:px-5 w-full mx-auto rounded-t-2xl z-30 pt-5 pb-8 bg-background/50 -mb-5">
      <div className="flex justify-between items-center pointer-events-auto z-40 relative">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 z-50">
            <Link href="/" onClick={closeMobileMenu}>
              <Image
                alt="Logo"
                className="h-12 w-12"
                height={48}
                src="/logo-white.png"
                width={48}
              />
            </Link>
          </div>

          <div className="hidden lg:flex gap-2 z-10">
            {siteConfig.navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  className={clsx(
                    "relative text-sm font-normal px-4 py-2 rounded-full",
                    isActive ? "text-foreground" : "text-foreground/80",
                  )}
                  href={item.href}
                >
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 z-0 bg-foreground/5 mix-blend-difference"
                      layoutId="bubble"
                      style={{ borderRadius: 9999 }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10 font-semibold">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 z-50">
          <div className="hidden lg:flex">
            <NetworkSwitcher />
          </div>
          <div className="lg:hidden">
            <button
              aria-expanded={isMobileMenuOpen}
              className="outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="nav-icon-circle">
                <Menu className={isMobileMenuOpen ? "hidden" : "block"} />
                <X className={isMobileMenuOpen ? "block" : "hidden"} />
              </div>
            </button>
          </div>
          <div className="hidden lg:flex">
            <ConnectButton />
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden mt-4 py-5">
          <div className="flex flex-col gap-10">
            <NetworkSwitcher />
            <div className="flex flex-col gap-2">
              {siteConfig.navItems.map((item) => (
                <Link
                  key={item.href}
                  className={clsx(
                    "px-4 py-2 rounded-md text-sm",
                    pathname === item.href
                      ? "bg-foreground/5 hover:bg-foreground/10"
                      : "hover:bg-foreground/10",
                  )}
                  href={item.href}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <ConnectButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
