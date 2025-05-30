import { Account } from "thirdweb/wallets";
import { IToken } from "./models";
import { getContractByChainAndAddress } from "@/contracts/client";
import { transfer } from "thirdweb/extensions/erc20";
import { sendAndConfirmTransaction } from "thirdweb";

export const PayFee = ({
  sendingFee,
  sourceMinterAddress,
  activeAccount,
}: {
  sendingFee: IToken;
  sourceMinterAddress: string;
  activeAccount: Account;
}) => {
  const transferTokens = async (
    token: IToken,
    sourceMinterAddress: string,
    activeAccount: Account
  ) => {
    const transaction = transfer({
      contract: getContractByChainAndAddress(token.chainId, token.tokenAddress),
      amountWei: token.rawAmount,
      to: sourceMinterAddress,
    });
    await sendAndConfirmTransaction({
      transaction,
      account: activeAccount,
    });
  };

  return (
    <div>
      <div className="mb-3">
        Performing cross chain transactions cost some money, so please pay the
        fees
      </div>
      <button
        className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
        onClick={async () => {
          await transferTokens(sendingFee, sourceMinterAddress, activeAccount);
        }}
      >
        Pay Fee
      </button>
    </div>
  );
};
