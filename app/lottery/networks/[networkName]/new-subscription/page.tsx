import { notFound } from "next/navigation";
import { CreateSubscription } from "./CreateSubscription";
import { chainlinkVRFCoordinatorContracts } from "@/contracts/chainlink";

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
