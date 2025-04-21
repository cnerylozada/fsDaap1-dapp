import { getDateAndTime } from "@/components/utils/utils";
import { IAppContact } from "@/contracts/settings";
import { getCrowdFundingList } from "@/server/crow-funding";
import { shortenAddress } from "thirdweb/utils";

export const Metadata = async ({
  fundMeFactory,
  address,
}: {
  fundMeFactory: IAppContact;
  address: string;
}) => {
  const crowdFundingList = await getCrowdFundingList(
    fundMeFactory.chainId,
    fundMeFactory.address
  );

  return (
    <div>
      {crowdFundingList
        .filter((_) => _[0] === address)
        .map((_) => {
          const contractAddress = _[0];
          const createdAt = _[1];
          const metadata = _[2];
          return (
            <div key={contractAddress} className="block border rounded-md p-3">
              <div>Title: {metadata[0]}</div>
              <div>Contract address: {shortenAddress(contractAddress)}</div>
              <div>Created at: {getDateAndTime(createdAt)}</div>
              <div>Description: {metadata[1]}</div>
            </div>
          );
        })}
    </div>
  );
};
