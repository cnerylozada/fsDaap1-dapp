import { formatToValidPath } from "@/components/utils";
import { fundMeFactoryContractAddress } from "@/contracts/networks";
import Link from "next/link";

export default function Page() {
  return (
    <div className="p-4">
      <div>
        <div className="font-bold">FundMe Factory Contract</div>
        <div>Select your network:</div>
        <div className="space-x-4">
          {fundMeFactoryContractAddress.map((_) => (
            <div
              key={_.chain.name}
              className="border rounded-md p-1 inline-block"
            >
              <Link
                href={`fund-me/networks/${formatToValidPath(_.chain.name!)}`}
              >
                {_.chain.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
