"use client";
import { useState } from "react";
import { EnterCustomers } from "./EnterCustomers";
import { IAppContract } from "@/contracts/settings";
import { DeploySourceMinter } from "./DeploySourceMinter";
import { SetSourceMinter } from "./SetSourceMinter";
import { useActiveAccount } from "thirdweb/react";

export enum Steps {
  ENTER_DATA,
  DEPLOY_SOURCE_MINTER,
  SET_SOURCE_MINTER,
}
export interface IManageCreation {
  currentStep: Steps;
  destinyContractAddress: string | null;
  sourceContractAddress: string | null;
}

export const CreationFlow = ({
  factoryContract,
}: {
  factoryContract: IAppContract;
}) => {
  const [manageCreation, setManageCreation] = useState<IManageCreation>({
    currentStep: Steps.ENTER_DATA,
    destinyContractAddress: null,
    sourceContractAddress: null,
  });

  const activeAccount = useActiveAccount();
  if (!activeAccount)
    return <div>Connect your wallet to perform operations</div>;

  return (
    <div>
      {manageCreation.currentStep === Steps.ENTER_DATA && (
        <EnterCustomers
          factoryContract={factoryContract}
          setManageCreation={setManageCreation}
        />
      )}
      {manageCreation.currentStep === Steps.DEPLOY_SOURCE_MINTER && (
        <DeploySourceMinter
          manageCreation={manageCreation}
          setManageCreation={setManageCreation}
        />
      )}
      {manageCreation.currentStep === Steps.SET_SOURCE_MINTER && (
        <SetSourceMinter
          factoryContract={factoryContract}
          manageCreation={manageCreation}
        />
      )}
    </div>
  );
};
