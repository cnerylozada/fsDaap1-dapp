import { notFound } from "next/navigation";
import { LotteryCreationFlow } from "./_components/LotteryCreationFlow";
import { lotteryFactoryContracts } from "@/contracts/contracts";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;
  const isValidNetwork = lotteryFactoryContracts.find(
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
      <div className="font-bold">Create new Lottery</div>
      <LotteryCreationFlow />
    </div>
  );
}
