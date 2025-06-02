import { basicUniswapV2Contracts } from "@/contracts/contracts";
import { notFound } from "next/navigation";
import { SwapETHForLINK } from "./SwapETHForLINK";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;

  const isValidNetwork = basicUniswapV2Contracts.find(
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
      <div className="mb-4 font-bold uppercase">
        Change your ETH for LINK tokens
      </div>
      <SwapETHForLINK />
    </div>
  );
}
