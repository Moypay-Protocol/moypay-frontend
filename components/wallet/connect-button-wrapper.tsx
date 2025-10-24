import React from "react";
import { useAccount } from "wagmi";

import { ConnectButton } from "./connect-button";

export default function ConnectButtonWrapper({
  children,
}: {
  children?: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}) {
  const { isConnected } = useAccount();

  return (
    <React.Fragment>
      {!isConnected ? (
        <ConnectButton />
      ) : (
        <React.Fragment>{children}</React.Fragment>
      )}
    </React.Fragment>
  );
}
