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

export interface IManageCreation {
  currentStep: Steps;
  proof: string[] | null;
  merkleRoot: string | null;
}

export const CrossChainClaimingFlow = ({
  customers,
}: {
  customers: readonly (readonly [string, bigint])[];
}) => {
  const { networkName, address, destinyAddress } = useParams();

  const {
    isWalletConnectedToCorrectChain,
    targetAppNetwork,
    appChainId,
    walletAddress,
    activeAccount,
  } = useCheckWalletAndNetwork(`${networkName}`);

  const [manageCreation, setManageCreation] = useState<IManageCreation>({
    currentStep: Steps.PAY_FEE,
    proof: null,
    merkleRoot: null,
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
        Even if you are on the list, performing cross-chain claiming can cause
        errors difficult to debug. So please before continue, check if you
        already have this NFT in your wallet.
      </div>

      {manageCreation.currentStep === Steps.PAY_FEE && (
        <PayFee
          customers={customers}
          activeAccount={activeAccount}
          appChainId={appChainId}
          sourceMinterAddress={`${address}`}
          setManageCreation={setManageCreation}
        />
      )}

      {manageCreation.currentStep === Steps.CLAIM_CROSS_TICKET && (
        <ClaimCrossTicket
          manageCreation={manageCreation}
          walletAddress={walletAddress}
          appChainId={appChainId}
          sourceMinterContractAddress={`${address}`}
          destinyAddress={`${destinyAddress}`}
        />
      )}
    </div>
  );
};
