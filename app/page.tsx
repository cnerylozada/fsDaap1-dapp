import { merkleContracts } from "@/contracts/contracts";
import { getContractByChainAndAddress } from "@/contracts/server";
import { AppChainId } from "@/contracts/settings";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";
import Link from "next/link";
import { readContract, Address } from "thirdweb";
import { encodeAbiParameters } from "thirdweb/utils";

export default async function Home() {
  // const allowList: Address[] = [
  //   `0x54e8dc4C949eEFAdb78DB60F3feCe3A47FcBFDa1`,
  //   `0x3d4670AE7C08e5812F616E16bCf14b79a25F6F53`,
  //   `0x091C29BF5d90b6472c0e19E73C5F1f19b1259020`,
  // ];

  // const leaves = allowList.map((x) => keccak256(x));
  // const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  // const walletAddress: Address = "0x54e8dc4C949eEFAdb78DB60F3feCe3A47FcBFDa1";
  // const hashed = keccak256(walletAddress);
  // const root = tree.getHexRoot();
  // const proof = tree.getHexProof(hashed);

  const whiteList: { walletAddress: Address; chainId: number }[] = [
    {
      walletAddress: "0x54e8dc4C949eEFAdb78DB60F3feCe3A47FcBFDa1",
      chainId: 11155420,
    },
    {
      walletAddress: "0x3d4670AE7C08e5812F616E16bCf14b79a25F6F53",
      chainId: 11155420,
    },
    {
      walletAddress: "0x091C29BF5d90b6472c0e19E73C5F1f19b1259020",
      chainId: 11155420,
    },
  ];
  const leaves2 = whiteList.map((_) => {
    const encodeItem = encodeAbiParameters(
      [
        { name: "walletAddress", type: "address" },
        { name: "chainId", type: "uint256" },
      ],
      [_.walletAddress, BigInt(_.chainId)]
    );
    return keccak256(encodeItem);
  });
  const tree2 = new MerkleTree(leaves2, keccak256, { sortPairs: true });
  const root2 = tree2.getHexRoot();

  const hashed2 = keccak256(
    encodeAbiParameters(
      [
        { name: "walletAddress", type: "address" },
        { name: "chainId", type: "uint256" },
      ],
      ["0x54e8dc4C949eEFAdb78DB60F3feCe3A47FcBFDa1", BigInt(11155420)]
    )
  );
  const proof2 = tree2.getHexProof(hashed2);

  console.log(`root2x proof2: `, root2, proof2);

  const contract = merkleContracts.filter(
    (_) => _.chainId === AppChainId.optimismSepolia
  );
  const merkleContract = contract[0];
  const usersDBContract = await readContract({
    contract: getContractByChainAndAddress(
      merkleContract.chainId,
      merkleContract.address
    ),
    method: "function geDBAddress() external view returns (address)",
    params: [],
  });

  const users = await readContract({
    contract: getContractByChainAndAddress(
      merkleContract.chainId,
      usersDBContract
    ),
    method:
      "function getUsers() external view returns ((address,uint256)[] memory)",
    params: [],
  });
  const usersFromBlockchain = users.map((_) => ({
    walletAddress: _[0] as Address,
    chainId: +`${_[1]}`,
  }));
  console.log(`usersFromBlockchain`, usersFromBlockchain);

  // const isValid = await readContract({
  //   contract: getContractByChainAndAddress(
  //     merkleContract.chainId,
  //     merkleContract.address
  //   ),
  //   method:
  //     "function verify(bytes32[] memory _proof, (address, uint256) memory _user) external view returns (bool)",
  //   params: [
  //     proof2 as Hex[],
  //     ["0x54e8dc4C949eEFAdb78DB60F3feCe3A47FcBFDa1", BigInt(11155420)],
  //   ],
  // });
  // console.log(`isValid`, isValid);

  return (
    <div className="p-4">
      <div className="mb-4">
        <div>
          <Link
            href={"https://github.com/cnerylozada/fsDaap1-dapp"}
            target="_blank"
            className="font-bold"
          >
            GITHUB: fsDaap1-dapp
          </Link>
        </div>
        <div>
          <Link
            href={"https://github.com/cnerylozada/fsDapp1-contracts"}
            target="_blank"
            className="font-bold"
          >
            GITHUB: fsDapp1-contracts
          </Link>
        </div>
        <div>
          <Link
            href={"https://github.com/cnerylozada/fsDapp2-contracts"}
            target="_blank"
            className="font-bold"
          >
            GITHUB: fsDapp2-contracts
          </Link>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Link href={"/classroom"} className="block p-2 border rounded-md">
            Classroom
          </Link>
        </div>
        <div>
          <Link href={"/fund-me"} className="block p-2 border rounded-md">
            FundMe
          </Link>
        </div>
        <div>
          <Link href={"/lottery"} className="block p-2 border rounded-md">
            Lottery
          </Link>
        </div>
        <div>
          <Link href={"/white-list"} className="block p-2 border rounded-md">
            White list
          </Link>
        </div>
      </div>
    </div>
  );
}
