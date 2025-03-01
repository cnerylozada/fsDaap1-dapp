import { storageContractServerSideOpSepolia } from "@/contracts/storage";
import { readContract } from "thirdweb";

export default async function Page() {
  const course = await readContract({
    contract: storageContractServerSideOpSepolia,
    method: "function getCourse() external view returns (string memory)",
    params: [],
  });

  return (
    <div>
      <div className="font-bold">Storage Contract</div>
      <div>
        <span className="font-bold">Course:</span> {course}
      </div>
    </div>
  );
}
