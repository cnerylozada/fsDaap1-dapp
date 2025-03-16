import { notFound } from "next/navigation";
import { chainlinkVRFCoordinatorContracts } from "@/contracts/contracts";
import { CreateSubscription } from "./CreateSubscription";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;
  const isValidNetwork = chainlinkVRFCoordinatorContracts.find(
    (_) => _.path === networkName
  );
  if (!isValidNetwork) return notFound();

  return (
    <div className="p-4">
      <CreateSubscription currentChainId={isValidNetwork.chainId} />
    </div>
  );
}
