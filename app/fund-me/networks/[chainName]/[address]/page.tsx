import { getAppContractByChain } from "@/components/utils/contracts";
import { fundMeFactoryContractAddress } from "@/contracts/networks";
import { notFound } from "next/navigation";
import { Metadata } from "./_components/Metadata";
import { FundMe } from "./_components/FundMe";
import { getServerSideContractByChainAndAddress } from "@/contracts/server";

export default async function Page({
  params,
}: {
  params: Promise<{ chainName: string; address: string }>;
}) {
  const { chainName, address } = await params;
  const appContract = getAppContractByChain(
    fundMeFactoryContractAddress,
    chainName
  );
  if (!appContract) return notFound();

  const fundMeFactoryContract = getServerSideContractByChainAndAddress(
    appContract.chain,
    appContract.address
  );

  return (
    <div className="p-4 space-y-4">
      <Metadata
        fundMeFactoryContract={fundMeFactoryContract}
        address={address}
      />
      <FundMe currentChain={appContract.chain} address={address} />
    </div>
  );
}
