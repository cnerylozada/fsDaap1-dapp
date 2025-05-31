import { GetTokenId } from "./_components/GetTokenId";

export default async function Page({
  params,
}: {
  params: Promise<{ address: string; networkName: string }>;
}) {
  const { networkName } = await params;
  console.log(`networkName`, networkName);

  return (
    <div className="p-4 space-y-4">
      <GetTokenId />
    </div>
  );
}
