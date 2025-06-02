"use client";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { EnterLotteryDataForm } from "./EnterLotteryDataForm";
import { ConfigureAutomation } from "./ConfigureAutomation";
import { ConnectNewLotteryWithSubscription } from "./ConnectNewLotteryWithSubscription";
import { CreateSubscription } from "./CreateSubscription";
import { WalletTokensBalance } from "@/components/WalletTokensBalance";

export enum Steps {
  ENTER_DATA,
  CREATE_SUBSCRIPTION,
  ADD_CONSUMER,
  CONFIG_AUTOMATION,
}

export const schema = z.object({
  title: z.string().min(5).max(30),
  description: z.string().min(5).max(50),
  prize: z.number().positive().min(0.0032),
  numTickets: z.number().int().positive().min(2).max(5),
  eventDate: z.date().refine(
    (date) => {
      const minDate = new Date();
      minDate.setMinutes(minDate.getMinutes() + 10);
      return date >= minDate;
    },
    {
      message: "Date must be at least 10 minutes from now",
    }
  ),
  ticketPrice: z.number().positive().min(0.0032),
});
export type LotterySchemaType = z.infer<typeof schema>;

export interface IManageCreation {
  currentStep: Steps;
  metadata: LotterySchemaType | null;
  lotteryContractAddress: string | null;
  subscriptionId: bigint | null;
}

export const LotteryCreationFlow = () => {
  const { networkName } = useParams();

  const {
    isWalletConnectedToCorrectChain,
    targetAppNetwork,
    walletAddress,
    appChainId,
    activeAccount,
  } = useCheckWalletAndNetwork(`${networkName}`);

  const [manageCreation, setManageCreation] = useState<IManageCreation>({
    currentStep: Steps.ENTER_DATA,
    metadata: null,
    lotteryContractAddress: null,
    subscriptionId: null,
  });

  if (!activeAccount || !walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div className="space-y-4">
      <WalletTokensBalance
        activeAccount={activeAccount}
        currentChainId={appChainId}
      />

      {manageCreation.currentStep === Steps.ENTER_DATA && (
        <EnterLotteryDataForm
          setManageCreation={setManageCreation}
          currentChainId={appChainId}
        />
      )}
      {manageCreation.currentStep === Steps.CREATE_SUBSCRIPTION && (
        <CreateSubscription
          manageCreation={manageCreation}
          currentChainId={appChainId}
          setManageCreation={setManageCreation}
        />
      )}
      {manageCreation.currentStep === Steps.ADD_CONSUMER && (
        <ConnectNewLotteryWithSubscription
          currentChainId={appChainId}
          manageCreation={manageCreation}
          setManageCreation={setManageCreation}
        />
      )}
      {manageCreation.currentStep === Steps.CONFIG_AUTOMATION && (
        <ConfigureAutomation
          manageCreation={manageCreation}
          currentChainId={appChainId}
        />
      )}
    </div>
  );
};
