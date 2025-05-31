import { whiteListFactoryContracts } from "@/contracts/contracts";
import { GetTokenId } from "./_components/GetTokenId";
import { isAddress } from "thirdweb";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ address: string; networkName: string }>;
}) {
  const { networkName, address } = await params;

  const whiteListFactory = whiteListFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!whiteListFactory || !isAddress(address)) return notFound();

  return (
    <div className="p-4 space-y-4">
      <div className="text-right">
        <Link href={`../`} className="text-blue-700">
          Go back
        </Link>
      </div>
      <GetTokenId />
    </div>
  );
}
