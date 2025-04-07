import { useState } from "react";
import { EnterLotteryDataForm } from "./EnterLotteryDataForm";
import { SelectSubscription } from "./SelectSubscription";
import { AppChainId } from "@/contracts/settings";

export enum Steps {
  ENTER_DATA,
  SELECT_SUBSCRIPTION,
  CONFIG_AUTOMATION,
}

export const ManageCreation = ({
  walletAddress,
  currentChainId,
}: {
  walletAddress: string;
  currentChainId: AppChainId;
}) => {
  const [manageCreation, setManageCreation] = useState({
    currentStep: Steps.ENTER_DATA,
  });

  return (
    <div>
      {manageCreation.currentStep === Steps.ENTER_DATA && (
        <EnterLotteryDataForm setManageCreation={setManageCreation} />
      )}
      {manageCreation.currentStep === Steps.SELECT_SUBSCRIPTION && (
        <SelectSubscription
          walletAddress={walletAddress}
          currentChainId={currentChainId}
          setManageCreation={setManageCreation}
        />
      )}
      {manageCreation.currentStep === Steps.CONFIG_AUTOMATION && <></>}
    </div>
  );
};
