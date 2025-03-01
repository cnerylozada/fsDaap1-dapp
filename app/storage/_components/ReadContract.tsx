"use client";
import { storageContractOpSepolia } from "@/contracts/storage";
import { useReadContract } from "thirdweb/react";

export const ReadContract = () => {
  const { data } = useReadContract({
    contract: storageContractOpSepolia,
    method: "function getCourse() external view returns (string memory)",
    params: [],
  });

  console.log(`data`, data);
  return (
    <div>
      <div>ReadContract</div>
    </div>
  );
};
