"use client";

import dynamic from "next/dynamic";

const Earn = dynamic(() => import("./earn"), {
  ssr: false,
});

export default function EarnWrapper() {
  return <Earn />;
}
