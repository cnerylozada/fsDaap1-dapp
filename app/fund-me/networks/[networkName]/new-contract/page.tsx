import { CreateNewCrowdFundingForm } from "./CreateNewCrowdFundingForm";
import { notFound } from "next/navigation";
import { fundMeFactoryContracts } from "@/contracts/contracts";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;
  const isValidNetwork = fundMeFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!isValidNetwork) return notFound();

  return (
    <div className="p-4">
      <div className="text-right">
        <Link href={`./`} className="text-blue-700">
          Go back
        </Link>
      </div>
      <CreateNewCrowdFundingForm factoryAddress={isValidNetwork.address} />
    </div>
  );
}
