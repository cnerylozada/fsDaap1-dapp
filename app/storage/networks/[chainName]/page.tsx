import { GetCourse } from "../../_components/GetCourse";
import { notFound } from "next/navigation";
import { appNetworks } from "@/contracts/networks";
import { Students } from "../../_components/Students";

export default async function Page({
  params,
}: {
  params: Promise<{ chainName: string }>;
}) {
  const { chainName } = await params;
  const validChain = appNetworks.find((_) => _.path === chainName);
  if (!validChain) return notFound();

  return (
    <div className="px-4">
      <div>{validChain.chain.name}</div>
      <GetCourse chain={validChain.chain} />
      <Students contractChain={validChain.chain} />
    </div>
  );
}
