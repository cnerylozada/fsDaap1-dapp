import { ChainOptions } from "thirdweb/chains";
import { GetStudent } from "./GetStudent";
import { AddNewStudentForm } from "./AddNewStudentForm";

export const Students = ({
  contractChain,
}: {
  contractChain: ChainOptions;
}) => {
  return (
    <div className="space-y-4">
      {<GetStudent contractChain={contractChain} />}
      <AddNewStudentForm contractChain={contractChain} />
    </div>
  );
};
