import { getDateAndTime } from "@/components/utils/utils";
import {
  ContractOptions,
  getContractEvents,
  prepareEvent,
  toEther,
} from "thirdweb";

export const Metadata = async ({
  lotteryFactoryContract,
  address,
}: {
  lotteryFactoryContract: Readonly<ContractOptions<[], `0x${string}`>>;
  address: string;
}) => {
  const newLotteryEvent = prepareEvent({
    signature:
      "event NewLottery(address indexed _address, uint _createdAt, (string,string,address,uint256,uint256,uint256,uint256) _detail)",
    filters: { _address: address },
  });

  const lotteryList = await getContractEvents({
    contract: lotteryFactoryContract,
    events: [newLotteryEvent],
    fromBlock: "earliest",
    toBlock: "latest",
  });

  return (
    <div>
      {lotteryList.map((_) => {
        const { args } = _;
        const { _detail } = args;

        return (
          <div key={_.transactionHash} className="block border rounded-md p-3">
            <div>Title: {_detail[0]} </div>
            <div>Prize: {toEther(_detail[6])} ETH</div>
            <div>Event date: {getDateAndTime(_detail[3])}</div>
            <div>Number of tickets: {_detail[4].toString()}</div>
          </div>
        );
      })}
    </div>
  );
};
