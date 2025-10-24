"use client";

import dynamic from "next/dynamic";

const Faucet = dynamic(() => import("./faucet"), {
  ssr: false,
});

export default function FaucetWrapper() {
  return <Faucet />;
}
