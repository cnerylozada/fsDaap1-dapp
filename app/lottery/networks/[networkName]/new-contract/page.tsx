import { appNetworkPathRecord } from "@/contracts/settings";
import { notFound } from "next/navigation";
import { ActiveSubscriptions } from "./_components/ActiveSubscriptions";

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

  return (
    <div className="p-4">
      <div>Create new Lottery</div>
      <ActiveSubscriptions />
    </div>
  );
}
