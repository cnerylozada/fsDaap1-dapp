"use client";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { useParams } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { EnterLotteryDataForm } from "./EnterLotteryDataForm";
import { SelectSubscription } from "./SelectSubscription";
import { ConfigAutomation } from "./ConfigAutomation";
import { ConnectNewLotteryWithSubscription } from "./ConnectNewLotteryWithSubscription";

export enum Steps {
  ENTER_DATA,
  SELECT_SUBSCRIPTION,
  ADD_CONSUMER,
  CONFIG_AUTOMATION,
}

export const schema = z.object({
  title: z.string().min(5).max(30),
  description: z.string().min(5).max(50),
  prize: z.number().positive().min(0.0032),
  numTickets: z.number().int().positive().min(2).max(5),
  date: z.date().refine(
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
export type SchemaType = z.infer<typeof schema>;

export interface IManageCreation {
  currentStep: Steps;
  metadata: SchemaType | null;
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
  } = useCheckWalletAndNetwork(`${networkName}`);

  const [manageCreation, setManageCreation] = useState<IManageCreation>({
    currentStep: Steps.ENTER_DATA,
    metadata: null,
    lotteryContractAddress: null,
    subscriptionId: null,
  });

  if (!walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div>
      {manageCreation.currentStep === Steps.ENTER_DATA && (
        <EnterLotteryDataForm setManageCreation={setManageCreation} />
      )}
      {manageCreation.currentStep === Steps.SELECT_SUBSCRIPTION && (
        <SelectSubscription
          walletAddress={walletAddress}
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
        <ConfigAutomation
          manageCreation={manageCreation}
          currentChainId={appChainId}
        />
      )}
    </div>
  );
};
