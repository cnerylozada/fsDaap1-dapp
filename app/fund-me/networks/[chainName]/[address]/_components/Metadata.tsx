import { getDateAndTime } from "@/components/utils/utils";
import { ContractOptions, getContractEvents, prepareEvent } from "thirdweb";

export const Metadata = async ({
  fundMeFactoryContract,
  address,
}: {
  fundMeFactoryContract: Readonly<ContractOptions<[], `0x${string}`>>;
  address: string;
}) => {
  const newCrowdFundingEvent = prepareEvent({
    signature:
      "event NewCrowdFunding(address indexed _address, uint _createdAt, string _title, string _description, uint _minAmountInUsd, address _priceFeedAddress, int _priceFeedDecimals)",
    filters: { _address: address },
  });

  const crowdFundingDetail = await getContractEvents({
    contract: fundMeFactoryContract,
    events: [newCrowdFundingEvent],
    fromBlock: "earliest",
    toBlock: "latest",
  });

  return (
    <div>
      {crowdFundingDetail.map((_) => (
        <div key={_.transactionHash} className="block border rounded-md p-3">
          <div>Title: {_.args._title}</div>
          <div>Contract address: {_.args._address}</div>
          <div>Created at: {getDateAndTime(_.args._createdAt)}</div>
          <div>Description: {_.args._description}</div>
        </div>
      ))}
    </div>
  );
};
