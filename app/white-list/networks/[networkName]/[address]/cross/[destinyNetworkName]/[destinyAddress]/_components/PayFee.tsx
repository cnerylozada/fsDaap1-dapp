import { Account } from "thirdweb/wallets";
import { IToken } from "./models";
import { getContractByChainAndAddress } from "@/contracts/client";
import { transfer } from "thirdweb/extensions/erc20";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getSendingFee } from "@/server/cross-minting";
import { AppChainId } from "@/contracts/settings";
import { IManageClaiming, Steps } from "./CrossChainClaimingFlow";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { WalletTokensBalance } from "@/components/WalletTokensBalance";
import { getProofByCustomers } from "../../../../_components/utils";
import Link from "next/link";

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

  const onPaySendingFee = async () => {
    const transaction = transfer({
      amountWei: feeDetails.token.rawAmount,
      contract: getContractByChainAndAddress(
        currentChainId,
        feeDetails.token.tokenAddress
      ),
      to: sourceMinterAddress,
    });
    mutate(transaction);
  };

  useEffect(() => {
    getSendingFeeDetails(activeAccount.address);
  }, [activeAccount]);

  return (
    <div className="space-y-3">
      <div>
        <div>
          Performing cross chain transactions cost some money, so first pay the
          fees using your LINK tokens
        </div>

        <div>
          {isLoading ? (
            <>Loading fee ...</>
          ) : (
            <>Sending Fee: {feeDetails.token.formattedAmount} LINK</>
          )}
        </div>
      </div>

      <div>
        <WalletTokensBalance
          activeAccount={activeAccount}
          currentChainId={currentChainId}
        />
        <Link
          href={"https://faucets.chain.link/"}
          className="text-blue-700 underline"
        >
          Dont have enough LINK? Get ETH or LINK from chainlink
        </Link>
      </div>

      {!isLoading && (
        <div>
          {!data && (
            <button
              className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
              onClick={async () => {
                await onPaySendingFee();
              }}
              disabled={isPending}
            >
              Pay Fee {feeDetails.token.formattedAmount} LINK
            </button>
          )}

          {isPending && <div>Sending funds...</div>}
          {isSuccess && data && (
            <div>
              <button
                className="p-2 bg-blue-100 rounded-md cursor-pointer"
                onClick={() => {
                  setManageClaiming((_) => ({
                    ..._,
                    currentStep: Steps.CLAIM_CROSS_TICKET,
                    proof: feeDetails.proof,
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
        </div>
      )}
    </div>
  );
};
