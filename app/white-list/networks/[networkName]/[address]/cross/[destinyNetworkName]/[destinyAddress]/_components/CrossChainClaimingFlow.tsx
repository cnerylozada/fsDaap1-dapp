"use client";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { useParams } from "next/navigation";
import { getProofByCustomers } from "../../../../_components/utils";
import { useEffect, useState } from "react";
import { getFormattedSendingFee } from "@/server/cross-minting";
import { IToken } from "./models";
import { PayFee } from "./PayFee";
import { ClaimCrossTicket } from "./ClaimCrossTicket";

export const CrossChainClaimingFlow = ({
  customers,
}: {
  customers: readonly (readonly [string, bigint])[];
}) => {
  const { networkName, address } = useParams();

  const {
    isWalletConnectedToCorrectChain,
    targetAppNetwork,
    appChainId,
    walletAddress,
    activeAccount,
  } = useCheckWalletAndNetwork(`${networkName}`);

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
  const getSendingFee = async (walletAddress: string) => {
    const proof = getProofByCustomers(customers, walletAddress, appChainId);
    const fee = await getFormattedSendingFee(
      appChainId,
      `${address}`,
      proof,
      walletAddress
    );
    return { fee, proof };
  };

  useEffect(() => {
    if (walletAddress)
      getSendingFee(walletAddress).then((_) =>
        setSendingFee({ token: _.fee, proof: _.proof })
      );
  }, [walletAddress]);

  if (!activeAccount || !walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div>
      <div>CrossClaimTicket</div>

      <div className="mb-3">
        Sending Fee: {sendingFee.token.formattedAmount} LINK
      </div>

      <PayFee
        sendingFee={sendingFee.token}
        sourceMinterAddress={`${address}`}
        activeAccount={activeAccount}
      />

      <ClaimCrossTicket
        walletAddress={walletAddress}
        appChainId={appChainId}
        proof={sendingFee.proof}
        sourceMinterContractAddress={`${address}`}
      />
    </div>
  );
};
