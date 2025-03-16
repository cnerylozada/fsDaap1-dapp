import { fundMeFactoryContracts } from "@/contracts/contracts";
import { Metadata } from "./_components/Metadata";
import { getContractByChainAndAddress } from "@/contracts/server";
import { FundMe } from "./_components/FundMe";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string; address: string }>;
}) {
  const { networkName, address } = await params;
  const isValidNetwork = fundMeFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!isValidNetwork) return notFound();

  const fundMeFactoryContract = getContractByChainAndAddress(
    isValidNetwork.chainId,
    isValidNetwork.address
  );

  return (
    <div className="p-4 space-y-4">
      <Metadata
        fundMeFactoryContract={fundMeFactoryContract}
        address={address}
      />
      <FundMe currentChainId={isValidNetwork.chainId} address={address} />
    </div>
  );
}
