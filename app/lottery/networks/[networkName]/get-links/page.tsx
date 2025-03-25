import { basicUniswapV2Contracts } from "@/contracts/contracts";
import { notFound } from "next/navigation";
import { SwapETHForLINK } from "./SwapETHForLINK";

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
      <div className="mb-4 font-bold uppercase">
        Change your ETH for LINK tokens
      </div>
      <SwapETHForLINK currentChainId={isValidNetwork.chainId} />
    </div>
  );
}
