"use client";

import React from "react";
import { usePathname } from "next/navigation";

import Navbar from "../navbar";
import BackgroundFluid from "../animations/background-fluid";

import { LayoutProvider } from "./layout-context";

interface AdaptiveLayoutProps {
  children: React.ReactNode;
}

export default function AdaptiveLayout({ children }: AdaptiveLayoutProps) {
  const pathname = usePathname();

  const getLayoutConfig = (path: string) => {
    if (path === "/home" || path === "/") {
      return {
        showNavbar: true,
        showBackground: true,
        containerClasses: "w-screen h-svh overflow-hidden",
        contentClasses:
          "bg-background w-full flex-1 rounded-2xl overflow-hidden z-40",
        innerClasses:
          "h-full w-full overflow-y-auto flex items-center justify-center",
        wrapperClasses: "flex flex-col h-full w-full relative p-2 sm:p-5",
        pageType: "home",
      };
    }

    if (path === "/dashboard") {
      return {
        showNavbar: true,
        showBackground: true,
        containerClasses: "w-screen h-svh overflow-hidden",
        contentClasses:
          "bg-background w-full flex-1 rounded-2xl overflow-hidden z-40",
        innerClasses: "h-full w-full overflow-y-auto",
        wrapperClasses: "flex flex-col h-full w-full relative p-2 sm:p-5",
        pageType: "dashboard",
      };
    }

    if (path.startsWith("/dashboard/")) {
      return {
        showNavbar: true,
        showBackground: true,
        containerClasses: "w-screen h-svh overflow-hidden",
        contentClasses:
          "bg-background w-full flex-1 rounded-2xl overflow-hidden z-40",
        innerClasses: "h-full w-full overflow-y-auto",
        wrapperClasses: "flex flex-col h-full w-full relative p-2 sm:p-5",
        pageType: "dashboard-detail",
      };
    }

    if (path.startsWith("/earn")) {
      return {
        showNavbar: true,
        showBackground: true,
        containerClasses: "w-screen h-svh overflow-hidden",
        contentClasses:
          "bg-background w-full flex-1 rounded-2xl overflow-hidden z-40",
        innerClasses: "h-full w-full overflow-y-auto",
        wrapperClasses: "flex flex-col h-full w-full relative p-2 sm:p-5",
        pageType: "earn",
      };
    }

    if (
      path.startsWith("/auth") ||
      path.startsWith("/login") ||
      path.startsWith("/signup")
    ) {
      return {
        showNavbar: false,
        showBackground: true,
        containerClasses: "w-screen h-svh overflow-hidden",
        contentClasses: "w-full h-full flex items-center justify-center z-40",
        innerClasses: "w-full max-w-md",
        wrapperClasses: "h-full w-full relative p-4",
        pageType: "auth",
      };
    }

    if (
      path.includes("error") ||
      path.includes("404") ||
      path.includes("500")
    ) {
      return {
        showNavbar: true,
        showBackground: true,
        containerClasses: "w-screen h-svh overflow-hidden",
        contentClasses:
          "bg-background w-full flex-1 rounded-2xl overflow-hidden z-40 flex items-center justify-center",
        innerClasses: "w-full max-w-lg text-center",
        wrapperClasses: "flex flex-col h-full w-full relative p-2 sm:p-5",
        pageType: "error",
      };
    }

    return {
      showNavbar: true,
      showBackground: true,
      containerClasses: "w-screen h-svh overflow-hidden",
      contentClasses:
        "bg-background w-full flex-1 rounded-2xl overflow-hidden z-40",
      innerClasses: "h-full w-full overflow-y-auto",
      wrapperClasses: "flex flex-col h-full w-full relative p-2 sm:p-5",
      pageType: "default",
    };
  };

  const config = getLayoutConfig(pathname);

  return (
    <LayoutProvider>
      <div className={config.containerClasses}>
        {config.showBackground && <BackgroundFluid />}
        <div className={config.wrapperClasses}>
          {config.showNavbar && <Navbar />}
          <div className={config.contentClasses}>
            <div className={config.innerClasses}>{children}</div>
          </div>
        </div>
      </div>
    </LayoutProvider>
  );
}
