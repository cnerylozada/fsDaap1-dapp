import { fundMeFactoryContracts } from "@/contracts/contracts";
import { Metadata } from "./_components/Metadata";
import { FundMe } from "./_components/FundMe";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string; address: string }>;
}) {
  const { networkName, address } = await params;
  const fundMeFactory = fundMeFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!fundMeFactory) return notFound();

  return (
    <div className="p-4 space-y-4">
      <Metadata fundMeFactory={fundMeFactory} address={address} />
      <FundMe currentChainId={fundMeFactory.chainId} address={address} />
    </div>
  );
}
