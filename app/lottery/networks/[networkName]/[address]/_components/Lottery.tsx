import { getContractByChainAndAddress } from "@/contracts/server";
import { AppChainId } from "@/contracts/settings";
import { readContract, toEther, ZERO_ADDRESS } from "thirdweb";
import { shortenAddress } from "thirdweb/utils";
import { PurchaseTicket } from "./PurchaseTicket";

const INIT = 0;
const PROCESSING = 1;
const FINISHED = 2;
const getLotteryState = (rawState: number) => {
  let lotteryState = "Started";
  if (rawState === PROCESSING) lotteryState = "In Progress";
  if (rawState === FINISHED) lotteryState = "Finished";
  return lotteryState;
};

export const Lottery = async ({
  currentChainId,
  address,
}: {
  currentChainId: AppChainId;
  address: string;
}) => {
  const lotteryContract = getContractByChainAndAddress(currentChainId, address);

  const [state, winnerAddress, participants, ticketPrice, numberOfTickets] =
    await Promise.all([
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
      readContract({
        contract: lotteryContract,
        method: "function getNumTickets() external view returns (uint)",
        params: [],
      }),
    ]);

  const isSoldOut = participants.length === +numberOfTickets.toString();

  return (
    <div className="space-y-4">
      <div>
        <div>Price of ticket: {toEther(ticketPrice)} ETH</div>
        <div className="font-bold">State: {getLotteryState(state)}</div>
        <div>
          Number of tickets: {numberOfTickets.toString()}{" "}
          {isSoldOut && <span className="font-bold">SOLD OUT</span>}
        </div>
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
            ? "No winner yet or lottery is finished :)"
            : shortenAddress(winnerAddress)}
        </div>
      </div>

      {!isSoldOut && state === INIT && (
        <PurchaseTicket ticketPrice={ticketPrice} />
      )}
    </div>
  );
};
