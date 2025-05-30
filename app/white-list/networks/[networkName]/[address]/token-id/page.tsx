export default async function Page({
  params,
}: {
  params: Promise<{ address: string; networkName: string }>;
}) {
  return (
    <div className="p-4 space-y-4">
      <div>token id</div>
    </div>
  );
}
