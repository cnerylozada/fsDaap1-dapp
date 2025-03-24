"use server";
import { AppChainId, appNetworkRecord } from "@/contracts/settings";
import { thirdwebServerSide } from "@/lib/thirdweb/server";
import { getWalletBalance } from "thirdweb/wallets";

export const getTokensBalance = async (
  walletAddress: string,
  chainId: AppChainId,
  tokenAddressList: string[]
) => {
  const tokens = await Promise.all(
    tokenAddressList.map((_) =>
      getWalletBalance({
        client: thirdwebServerSide,
        chain: appNetworkRecord[chainId],
        address: walletAddress,
        tokenAddress: _,
      })
    )
  );
  return tokens;
};
