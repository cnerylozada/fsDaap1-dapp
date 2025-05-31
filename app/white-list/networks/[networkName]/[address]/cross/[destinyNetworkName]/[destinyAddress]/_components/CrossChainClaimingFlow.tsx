"use client";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { useParams } from "next/navigation";
import { PayFee } from "./PayFee";
import { useState } from "react";
import { ClaimCrossTicket } from "./ClaimCrossTicket";

export enum Steps {
  PAY_FEE,
  CLAIM_CROSS_TICKET,
}

export interface IManageClaiming {
  currentStep: Steps;
  proof: string[] | null;
}

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

  const [manageClaiming, setManageClaiming] = useState<IManageClaiming>({
    currentStep: Steps.PAY_FEE,
    proof: null,
  });

  if (!activeAccount || !walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div>
      <div>CrossClaimTicket</div>
      <div className="mb-3 font-bold">
        If you are on the white-list, then you will be able to claim just 1 NFT!
        Even if you are on the list, performing cross-chain transaction can
        cause errors difficult to debug. So please before continue, check if you
        already have this NFT in your wallet.
      </div>

      {manageClaiming.currentStep === Steps.PAY_FEE && (
        <PayFee
          customers={customers}
          activeAccount={activeAccount}
          currentChainId={appChainId}
          sourceMinterAddress={`${address}`}
          setManageClaiming={setManageClaiming}
        />
      )}

      {manageClaiming.currentStep === Steps.CLAIM_CROSS_TICKET && (
        <ClaimCrossTicket
          manageClaiming={manageClaiming}
          walletAddress={walletAddress}
          currentChainId={appChainId}
        />
      )}
    </div>
  );
};
