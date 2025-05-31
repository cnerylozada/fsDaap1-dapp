import { AppChainId } from "@/contracts/settings";
import { getTokensBalance } from "@/server/commons";
import { useEffect, useState } from "react";
import { formatNumber } from "thirdweb/utils";
import { Account } from "thirdweb/wallets";

export const TokensBalance = ({
  activeAccount,
  currentChainId,
  tokenAddressList,
}: {
  activeAccount: Account;
  currentChainId: AppChainId;
  tokenAddressList: string[];
}) => {
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
