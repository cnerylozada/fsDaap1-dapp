"use client";
import { thirdwebClientSide } from "@/lib/thirdweb";
import { sepolia, optimismSepolia } from "thirdweb/chains";
import { ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";

export const ConnectWallet = () => {
  const wallets = [
    inAppWallet({ auth: { options: ["google"] } }),
    createWallet("io.metamask"),
  ];
  const chains = [sepolia, optimismSepolia];

  return (
    <div>
      <ConnectButton
        client={thirdwebClientSide}
        showAllWallets={false}
        wallets={wallets}
        chains={chains}
        chain={optimismSepolia}
      />
    </div>
  );
};
