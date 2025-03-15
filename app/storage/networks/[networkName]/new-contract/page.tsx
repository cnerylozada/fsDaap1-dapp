import { CreateNewClassroom } from "@/app/storage/_components/CreateNewClassroom";
import { getAppChainIdByPath } from "@/components/utils/contracts";
import { storageFactoryContracts } from "@/contracts/contracts";
import { appNetworkPathRecord } from "@/contracts/settings";
import { notFound } from "next/navigation";

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
  const appContract = storageFactoryContracts.filter(
    (_) => _.chainId === appChainId
  )[0];

  return (
    <div className="p-4">
      <CreateNewClassroom factoryAddress={appContract.address} />
    </div>
  );
}
