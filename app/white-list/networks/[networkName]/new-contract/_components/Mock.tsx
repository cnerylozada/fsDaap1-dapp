"use client";

import { thirdwebClientSide } from "@/lib/thirdweb/client";
import { arbitrumSepolia } from "thirdweb/chains";
import { useActiveWalletChain, useNetworkSwitcherModal } from "thirdweb/react";

export const Mock = () => {
  const activeWalletChain = useActiveWalletChain();
  const networkSwitcher = useNetworkSwitcherModal();
  return (
    <div>
      <div>Current network: {activeWalletChain?.name}</div>
      <button
        onClick={async () => {
          networkSwitcher.open({
            client: thirdwebClientSide,
            sections: [
              { label: "To continue change to", chains: [arbitrumSepolia] },
            ],
          });
        }}
      >
        Swith to sepolia
      </button>
    </div>
  );
};
