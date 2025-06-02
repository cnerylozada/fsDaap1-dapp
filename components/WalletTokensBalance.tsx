"use client";
import { LINKTokenContracts } from "@/contracts/chainlink";
import { AppChainId } from "@/contracts/settings";
import { getTokensBalance } from "@/server/commons";
import { useEffect, useState } from "react";
import { formatNumber } from "thirdweb/utils";
import { Account } from "thirdweb/wallets";

const getTokenAddressList = (currentChainId: AppChainId) => {
  const LINKToken = LINKTokenContracts.find(
    (_) => _.chainId === currentChainId
  );
  const tokenAddressList = LINKToken ? ["", LINKToken.address] : [""];
  return tokenAddressList;
};

export const WalletTokensBalance = ({
  activeAccount,
  currentChainId,
}: {
  activeAccount: Account;
  currentChainId: AppChainId;
}) => {
  const tokenAddressList = getTokenAddressList(currentChainId);
  const [walletTokens, setWalletTokens] = useState<
    { displayValue: string; name: string; symbol: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWalletTokens = async (activeAccount: Account) => {
    setIsLoading(true);

    const tokensBalance = await getTokensBalance(
      activeAccount.address,
      currentChainId,
      tokenAddressList
    );
    setWalletTokens(
      tokensBalance.map((_) => ({
        displayValue: _.displayValue,
        name: _.name,
        symbol: _.symbol,
      }))
    );
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWalletTokens(activeAccount);
  }, [activeAccount]);

  return (
    <div className="p-3 border rounded-md">
      {isLoading ? (
        <div>Loading my wallet tokens ...</div>
      ) : (
        <>
          <div className="font-bold">Tokens in my wallet:</div>
          {walletTokens.map((_, index) => (
            <div key={_.name}>
              #{index + 1} {_.name}: {formatNumber(+_.displayValue, 5)}{" "}
              {_.symbol}
            </div>
          ))}
        </>
      )}
    </div>
  );
};
