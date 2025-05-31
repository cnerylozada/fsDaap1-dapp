"use server";
import { AppChainId, appNetworkRecord } from "@/contracts/settings";
import { thirdwebServerSide } from "@/lib/thirdweb/server";
import { getWalletBalance } from "thirdweb/wallets";

export const getTokensBalance = async (
  walletAddress: string,
  currentChainId: AppChainId,
  tokenAddressList: string[]
) => {
  return Promise.all(
    tokenAddressList.map((_) =>
      getWalletBalance({
        client: thirdwebServerSide,
        chain: appNetworkRecord[currentChainId],
        address: walletAddress,
        tokenAddress: _,
      })
    )
  );
};
