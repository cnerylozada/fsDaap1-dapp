import { Account } from "thirdweb/wallets";
import { IToken } from "./models";
import { getContractByChainAndAddress } from "@/contracts/client";
import { transfer } from "thirdweb/extensions/erc20";
import { sendAndConfirmTransaction } from "thirdweb";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getProofByCustomers } from "../../../../_components/utils";
import { getSendingFee } from "@/server/cross-minting";
import { AppChainId } from "@/contracts/settings";
import { IManageClaiming, Steps } from "./CrossChainClaimingFlow";
import { LINKTokenContracts } from "@/contracts/chainlink";
import { TokensBalance } from "./TokensBalance";
import { useSendAndConfirmTransaction } from "thirdweb/react";

export const PayFee = ({
  customers,
  sourceMinterAddress,
  currentChainId,
  activeAccount,
  setManageClaiming,
}: {
  customers: readonly (readonly [string, bigint])[];
  activeAccount: Account;
  currentChainId: AppChainId;
  sourceMinterAddress: string;
  setManageClaiming: Dispatch<SetStateAction<IManageClaiming>>;
}) => {
  const LINKToken = LINKTokenContracts.find(
    (_) => _.chainId === currentChainId
  );
  const tokenAddressList = LINKToken ? ["", LINKToken.address] : [""];

  const [isLoading, setIsLoading] = useState(true);
  const [feeDetails, setFeeDetails] = useState<{
    token: IToken;
    proof: string[];
  }>({
    token: {
      rawAmount: BigInt(0),
      formattedAmount: 0,
      tokenAddress: "",
    },
    proof: [""],
  });

  const getSendingFeeDetails = async (walletAddress: string) => {
    setIsLoading(true);
    const proof = getProofByCustomers(customers, walletAddress, currentChainId);
    const fee = await getSendingFee(
      currentChainId,
      sourceMinterAddress,
      proof,
      walletAddress
    );
    setFeeDetails({ token: fee, proof });
    setIsLoading(false);
  };

  const { mutate, isPending, isSuccess, data, isError, error } =
    useSendAndConfirmTransaction();
  const onPaySendingFee = async (
    token: IToken,
    sourceMinterAddress: string,
    activeAccount: Account
  ) => {
    const transaction = transfer({
      contract: getContractByChainAndAddress(
        currentChainId,
        token.tokenAddress
      ),
      amountWei: token.rawAmount,
      to: sourceMinterAddress,
    });
    await sendAndConfirmTransaction({
      transaction,
      account: activeAccount,
    });
  };

  useEffect(() => {
    getSendingFeeDetails(activeAccount.address);
  }, [activeAccount]);

  return (
    <div>
      <div>
        Performing cross chain transactions cost some money, so first pay the
        fees using your LINK tokens
      </div>

      <div className="mb-3">
        {isLoading ? (
          <>Loading fee ...</>
        ) : (
          <>Sending Fee: {feeDetails.token.formattedAmount} LINK</>
        )}
      </div>

      <TokensBalance
        activeAccount={activeAccount}
        currentChainId={currentChainId}
        tokenAddressList={tokenAddressList}
      />

      {!isLoading && (
        <>
          {!data && (
            <button
              className="mt-3 p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
              onClick={async () => {
                await onPaySendingFee(
                  feeDetails.token,
                  sourceMinterAddress,
                  activeAccount
                );
              }}
            >
              Pay Fee {feeDetails.token.formattedAmount} LINK
            </button>
          )}

          {isPending && <div>Sending funds...</div>}
          {isSuccess && data && (
            <div>
              <button
                className="p-2 bg-blue-100 rounded-md"
                onClick={() => {
                  setManageClaiming((_) => ({
                    ..._,
                    currentStep: Steps.CLAIM_CROSS_TICKET,
                  }));
                }}
              >
                Continue
              </button>
            </div>
          )}
          {isError && (
            <div className="text-sm text-red-700">{error.message}</div>
          )}
        </>
      )}
    </div>
  );
};
