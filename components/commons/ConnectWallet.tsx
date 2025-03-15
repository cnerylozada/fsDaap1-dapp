"use client";
import { appNetworkRecord } from "@/contracts/settings";
import { thirdwebClientSide } from "@/lib/thirdweb/client";
import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";

export const ConnectWallet = () => {
  const wallets = [
    inAppWallet({ auth: { options: ["google"] } }),
    createWallet("io.metamask"),
  ];

  return (
    <div>
      <ConnectButton
        client={thirdwebClientSide}
        showAllWallets={false}
        wallets={wallets}
        chains={Object.values(appNetworkRecord)}
      />
    </div>
  );
};
