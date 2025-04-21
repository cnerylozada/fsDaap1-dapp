import { getDateAndTime } from "@/components/utils/utils";
import { IAppContact } from "@/contracts/settings";
import { getLotteryList } from "@/server/lottery";
import { toEther } from "thirdweb";

export const Metadata = async ({
  lotteryFactory,
  address,
}: {
  lotteryFactory: IAppContact;
  address: string;
}) => {
  const lotteryList = await getLotteryList(
    lotteryFactory.chainId,
    lotteryFactory.address
  );

  return (
    <div>
      {lotteryList
        .filter((_) => _[0] === address)
        .map((_) => {
          const contractAddress = _[0];
          const metadata = _[2];

          return (
            <div key={contractAddress} className="border rounded-md p-3">
              <div>Title: {metadata[0]} </div>
              <div>Prize: {toEther(metadata[6])} ETH</div>
              <div>Event date: {getDateAndTime(metadata[3])}</div>
              <div>Number of tickets: {metadata[4].toString()}</div>
            </div>
          );
        })}
    </div>
  );
};
