"use client";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { getContractByChainAndAddress } from "@/contracts/client";
import { AppChainId } from "@/contracts/settings";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";

export const MyNFTs = ({
  currentChainId,
  contractAddress,
}: {
  currentChainId: AppChainId;
  contractAddress: string;
}) => {
  const { networkName, address } = useParams();
  const { isWalletConnectedToCorrectChain, targetAppNetwork, walletAddress } =
    useCheckWalletAndNetwork(`${networkName}`);

  const [ticketList, setTicketList] = useState<
    { name?: string; image?: string; id: bigint }[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const onGetMyNFTs = async (walletAddress: string) => {
    setIsLoading(true);
    const ownedNFTs = await getOwnedNFTs({
      contract: getContractByChainAndAddress(currentChainId, contractAddress),
      owner: walletAddress,
    });
    const NFTList = ownedNFTs.map((_) => ({
      name: _.metadata.name,
      image: _.metadata.image,
      id: _.id,
    }));
    setTicketList(NFTList);
    setIsLoading(false);
  };

  useEffect(() => {
    if (walletAddress) setTicketList(null);
  }, [walletAddress]);

  if (!walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div>
      <div>
        NFT contract address:{" "}
        <span className="text-xs md:text-base">{address}</span>
      </div>

      <div className="mb-2 font-bold">Did you already claim your NFT?</div>
      <div className="mb-2">
        <button
          className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
          disabled={isLoading}
          onClick={() => {
            onGetMyNFTs(walletAddress);
          }}
        >
          List my NFTs
        </button>
      </div>
      {isLoading && <div>Loading your NFTs ...</div>}
      {!isLoading &&
        ticketList &&
        (ticketList.length ? (
          <div>
            {ticketList.map(
              (_) =>
                _.image && (
                  <div key={_.id}>
                    <div>Id: {_.id}</div>
                    <div>Name: {_.name}</div>
                    <Image src={_.image} width={100} height={100} alt={"NFT"} />
                  </div>
                )
            )}
          </div>
        ) : (
          <div>You dont have NFT claimed</div>
        ))}
    </div>
  );
};
