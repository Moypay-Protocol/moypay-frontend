import React from "react";

import Navbar from "../navbar";
import BackgroundFluid from "../animations/background-fluid";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <BackgroundFluid />
      <div className="flex flex-col h-full w-full relative p-2 sm:p-5">
        <Navbar />
        <div className="bg-background w-full flex-1 rounded-2xl overflow-hidden z-40">
          <div className="h-full w-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
