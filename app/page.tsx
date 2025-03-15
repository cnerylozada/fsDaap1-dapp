import Link from "next/link";

export default async function Home() {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <div>
          <Link href={"/storage"} className="block p-2 border rounded-md">
            Storage
          </Link>
        </div>
        <div>
          <Link href={"/fund-me"} className="block p-2 border rounded-md">
            FundMe
          </Link>
        </div>
        <div>
          <Link href={"/lottery"} className="block p-2 border rounded-md">
            Lottery
          </Link>
        </div>
      </div>
    </div>
  );
}
