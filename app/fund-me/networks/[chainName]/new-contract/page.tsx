import { fundMeFactoryContractAddress } from "@/contracts/networks";
import { CreateNewCrowdFundingForm } from "./CreateNewCrowdFundingForm";
import { getAppContractByChain } from "@/components/utils/contracts";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ chainName: string }>;
}) {
  const { chainName } = await params;
  const appContract = getAppContractByChain(
    fundMeFactoryContractAddress,
    chainName
  );
  if (!appContract) return notFound();

  return (
    <div className="p-4">
      <CreateNewCrowdFundingForm factoryAddress={appContract.address} />
    </div>
  );
}
