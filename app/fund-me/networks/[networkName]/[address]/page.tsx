import { fundMeFactoryContracts } from "@/contracts/contracts";
import { Metadata } from "./_components/Metadata";
import { FundMe } from "./_components/FundMe";
import { notFound } from "next/navigation";
import { isAddress } from "thirdweb";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string; address: string }>;
}) {
  const { networkName, address } = await params;
  const fundMeFactory = fundMeFactoryContracts.find(
    (_) => _.path === networkName
  );

  if (!fundMeFactory || !isAddress(address)) return notFound();

  return (
    <div className="p-4 space-y-4">
      <div className="text-right">
        <Link href={`./`} className="text-blue-700">
          Go back
        </Link>
      </div>
      <Metadata fundMeFactory={fundMeFactory} address={address} />
      <FundMe currentChainId={fundMeFactory.chainId} address={address} />
    </div>
  );
}
