"use client";
import { EnterCustomers } from "./EnterCustomers";
import { IAppContract } from "@/contracts/settings";

export const CreationFlow = ({
  factoryContract,
}: {
  factoryContract: IAppContract;
}) => {
  return (
    <div>
      <EnterCustomers factoryContract={factoryContract} />
    </div>
  );
};
