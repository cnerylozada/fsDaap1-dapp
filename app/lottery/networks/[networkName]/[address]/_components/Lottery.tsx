import { getContractByChainAndAddress } from "@/contracts/server";
import { AppChainId } from "@/contracts/settings";
import { readContract, toEther, ZERO_ADDRESS } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { PurchaseTicket } from "./PurchaseTicket";

export const Lottery = async ({
  currentChainId,
  address,
}: {
  currentChainId: AppChainId;
  address: string;
}) => {
  const lotteryContract = getContractByChainAndAddress(currentChainId, address);

  const [state, winnerAddress, participants, ticketPrice] = await Promise.all([
    readContract({
      contract: lotteryContract,
      method: "function getState() external view returns (uint8)",
      params: [],
    }),
    readContract({
      contract: lotteryContract,
      method: "function getWinnerAddress() external view returns (address)",
      params: [],
    }),
    readContract({
      contract: lotteryContract,
      method:
        "function getParticipants() external view returns (address[] memory)",
      params: [],
    }),
    readContract({
      contract: lotteryContract,
      method: "function getTicketPrice() external view returns (uint)",
      params: [],
    }),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <div>Price of token: {toEther(ticketPrice)} ETH</div>
        <div>State: {state}</div>
        <div>
          <div>Participants:</div>
          {participants.length ? (
            participants.map((_) => <div key={_}>{shortenAddress(_)}</div>)
          ) : (
            <div>There are no participants yet</div>
          )}
        </div>
        <div>
          Winner address:{" "}
          {winnerAddress === ZERO_ADDRESS
            ? "No winner yet :)"
            : shortenAddress(winnerAddress)}
        </div>
      </div>

      <PurchaseTicket ticketPrice={ticketPrice} />
    </div>
  );
};
