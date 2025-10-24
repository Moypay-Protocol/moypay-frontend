"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface LayoutConfig {
  showNavbar?: boolean;
  showBackground?: boolean;
  pageTitle?: string;
  pageDescription?: string;
  containerClasses?: string;
  contentClasses?: string;
  innerClasses?: string;
  wrapperClasses?: string;
  pageType?: string;
}

interface LayoutContextType {
  config: LayoutConfig;
  updateConfig: (newConfig: Partial<LayoutConfig>) => void;
  resetConfig: () => void;
}

const defaultConfig: LayoutConfig = {
  showNavbar: true,
  showBackground: true,
  pageTitle: "",
  pageDescription: "",
  containerClasses: "w-screen h-screen overflow-hidden",
  contentClasses:
    "bg-background w-full flex-1 rounded-2xl overflow-hidden z-40",
  innerClasses: "h-full w-full overflow-y-auto",
  wrapperClasses: "flex flex-col h-full w-full relative p-2 sm:p-5",
  pageType: "default",
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<LayoutConfig>(defaultConfig);

  const updateConfig = (newConfig: Partial<LayoutConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  return (
    <LayoutContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);

  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }

  return context;
}

export function usePageLayout(layoutConfig: Partial<LayoutConfig>) {
  const { updateConfig, resetConfig } = useLayout();

  React.useEffect(() => {
    updateConfig(layoutConfig);

    return () => {
      resetConfig();
    };
  }, [layoutConfig, updateConfig, resetConfig]);
}
