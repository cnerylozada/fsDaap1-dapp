import { CreateNewClassroom } from "@/app/storage/_components/CreateNewClassroom";
import { storageFactoryContracts } from "@/contracts/contracts";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ networkName: string }>;
}) {
  const { networkName } = await params;
  const isValidNetwork = storageFactoryContracts.find(
    (_) => _.path === networkName
  );
  if (!isValidNetwork) return notFound();

  return (
    <div className="p-4">
      <CreateNewClassroom factoryAddress={isValidNetwork.address} />
    </div>
  );
}
