import { Account } from "thirdweb/wallets";
import { IToken } from "./models";
import { getContractByChainAndAddress } from "@/contracts/client";
import { transfer } from "thirdweb/extensions/erc20";
import { sendAndConfirmTransaction } from "thirdweb";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getProofByCustomers } from "../../../../_components/utils";
import { getFormattedSendingFee } from "@/server/cross-minting";
import { AppChainId } from "@/contracts/settings";
import { IManageCreation, Steps } from "./CrossChainClaimmingFlow";

export const PayFee = ({
  customers,
  sourceMinterAddress,
  appChainId,
  activeAccount,
  setManageCreation,
}: {
  customers: readonly (readonly [string, bigint])[];
  activeAccount: Account;
  appChainId: AppChainId;
  sourceMinterAddress: string;
  setManageCreation: Dispatch<SetStateAction<IManageCreation>>;
}) => {
  const [sendingFee, setSendingFee] = useState<{
    token: IToken;
    proof: string[];
  }>({
    token: {
      rawAmount: BigInt(0),
      formattedAmount: 0,
      tokenDecimals: 0,
      tokenAddress: "",
      chainId: appChainId,
    },
    proof: [""],
  });
  const [isPaid, setIsPaid] = useState(false);
  const getSendingFee = async (walletAddress: string) => {
    const proof = getProofByCustomers(customers, walletAddress, appChainId);
    const fee = await getFormattedSendingFee(
      appChainId,
      sourceMinterAddress,
      proof,
      walletAddress
    );
    return { fee, proof };
  };

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

  useEffect(() => {
    getSendingFee(activeAccount.address).then((_) =>
      setSendingFee({ token: _.fee, proof: _.proof })
    );
  }, []);

  if (!sendingFee.token.formattedAmount) return <div>Loading fee...</div>;

  return (
    <div>
      <div>
        Performing cross chain transactions cost some money, so first pay the
        fees using your LINK tokens
      </div>
      <div className="mb-3">
        Sending Fee: {sendingFee.token.formattedAmount} LINK
      </div>

      {isPaid ? (
        <div>
          <button
            className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
            onClick={() => {
              setManageCreation((_) => ({
                ..._,
                currentStep: Steps.CLAIM_CROSS_TICKET,
                proof: sendingFee.proof,
              }));
            }}
          >
            Continue
          </button>
        </div>
      ) : (
        <button
          className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
          onClick={async () => {
            await transferTokens(
              sendingFee.token,
              sourceMinterAddress,
              activeAccount
            );
            setIsPaid(true);
          }}
        >
          Pay Fee {sendingFee.token.formattedAmount} LINK
        </button>
      )}
    </div>
  );
};
