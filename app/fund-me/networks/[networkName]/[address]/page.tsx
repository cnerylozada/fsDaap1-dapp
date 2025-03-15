import { fundMeFactoryContracts } from "@/contracts/contracts";
import { Metadata } from "./_components/Metadata";
import { getContractByChainAndAddress } from "@/contracts/server";
import { getAppChainIdByPath } from "@/components/utils/contracts";
import { FundMe } from "./_components/FundMe";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string; address: string }>;
}) {
  const { networkName, address } = await params;

  const appChainId = getAppChainIdByPath(networkName);
  const appContract = fundMeFactoryContracts.filter(
    (_) => _.chainId === appChainId
  )[0];
  const fundMeFactoryContract = getContractByChainAndAddress(
    appContract.chainId,
    appContract.address
  );

  return (
    <div className="p-4 space-y-4">
      <Metadata
        fundMeFactoryContract={fundMeFactoryContract}
        address={address}
      />
      <FundMe currentChainId={appContract.chainId} address={address} />
    </div>
  );
}
