import Link from "next/link";

export default async function Home() {
  return (
    <div className="p-4">
      <div className="mb-4">
        <div>
          <Link
            href={"https://github.com/cnerylozada/fsDaap1-dapp"}
            target="_blank"
            className="font-bold"
          >
            GITHUB: fsDaap1-dapp
          </Link>
        </div>
        <div>
          <Link
            href={"https://github.com/cnerylozada/fsDapp1-contracts"}
            target="_blank"
            className="font-bold"
          >
            GITHUB: fsDapp1-contracts
          </Link>
        </div>
        <div>
          <Link
            href={"https://github.com/cnerylozada/fsDapp2-contracts"}
            target="_blank"
            className="font-bold"
          >
            GITHUB: fsDapp2-contracts
          </Link>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Link href={"/classroom"} className="block p-2 border rounded-md">
            Classroom
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
        <div>
          <Link href={"/white-list"} className="block p-2 border rounded-md">
            Cross chain White list
          </Link>
        </div>
      </div>
    </div>
  );
}
