import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";
import { encodeAbiParameters } from "thirdweb/utils";

export const getMerkleTree = (
  customers: readonly (readonly [string, bigint])[]
) => {
  const leaves = customers.map((_) => {
    const encodeItem = encodeAbiParameters(
      [
        { name: "walletAddress", type: "address" },
        { name: "chainId", type: "uint256" },
      ],
      [_[0], _[1]]
    );
    return keccak256(encodeItem);
  });
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  return merkleTree;
};

export const getProofByCustomers = (
  customers: readonly (readonly [string, bigint])[],
  walletAddress: string,
  currentChainId: number
) => {
  const merkleTree = getMerkleTree(customers);
  const hash = keccak256(
    encodeAbiParameters(
      [
        { name: "walletAddress", type: "address" },
        { name: "chainId", type: "uint256" },
      ],
      [walletAddress, BigInt(currentChainId)]
    )
  );
  return merkleTree.getHexProof(hash);
};
