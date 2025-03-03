import { getStorageContractServerSideByNetwork } from "@/contracts/server";
import { readContract } from "thirdweb";
import { ChainOptions } from "thirdweb/chains";

export const GetCourse = async ({ chain }: { chain: ChainOptions }) => {
  const course = await readContract({
    contract: getStorageContractServerSideByNetwork(chain),
    method: "function getCourse() external view returns (string memory)",
    params: [],
  });
  return (
    <div>
      <span className="font-bold">Course:</span> {course}
    </div>
  );
};
