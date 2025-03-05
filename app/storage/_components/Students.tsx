import { ChainOptions } from "thirdweb/chains";
import { GetStudent } from "./GetStudent";
import { AddNewStudentForm } from "./AddNewStudentForm";

export const Students = ({
  contractChain,
  address,
}: {
  contractChain: ChainOptions;
  address: string;
}) => {
  return (
    <div className="space-y-4">
      <GetStudent contractChain={contractChain} contractAddress={address} />
      <AddNewStudentForm
        contractChain={contractChain}
        contractAddress={address}
      />
    </div>
  );
};
