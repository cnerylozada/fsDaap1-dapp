import { notFound } from "next/navigation";
import { whiteListFactoryContracts } from "@/contracts/contracts";
import Link from "next/link";
import { CreationFlow } from "./_components/CreationFlow";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;
  const whiteListFactory = whiteListFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!whiteListFactory) return notFound();

  return (
    <div className="p-4">
      <div className="text-right">
        <Link href={`./`} className="text-blue-700">
          Go back
        </Link>
      </div>
      <div className="font-bold">Create new Cross chain WhiteList</div>

      <CreationFlow factoryContract={whiteListFactory} />
    </div>
  );
}
