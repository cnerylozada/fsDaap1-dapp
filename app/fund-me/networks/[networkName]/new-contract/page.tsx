import { CreateNewCrowdFundingForm } from "./CreateNewCrowdFundingForm";
import { notFound } from "next/navigation";
import { appNetworkPathRecord } from "@/contracts/settings";
import { fundMeFactoryContracts } from "@/contracts/contracts";
import { getAppChainIdByPath } from "@/components/utils/contracts";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;
  const isValidNetwork = Object.values(appNetworkPathRecord).find(
    (_) => _ === networkName
  );
  if (!isValidNetwork) return notFound();
  const appChainId = getAppChainIdByPath(networkName);
  const appContract = fundMeFactoryContracts.filter(
    (_) => _.chainId === appChainId
  )[0];

  return (
    <div className="p-4">
      <CreateNewCrowdFundingForm factoryAddress={appContract.address} />
    </div>
  );
}
