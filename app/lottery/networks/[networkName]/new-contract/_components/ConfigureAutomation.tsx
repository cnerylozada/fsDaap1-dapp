import { useSendAndConfirmTransaction } from "thirdweb/react";
import { IManageCreation } from "./LotteryCreationFlow";
import { AppChainId } from "@/contracts/settings";
import { prepareContractCall, toEther } from "thirdweb";
import { registerUpkeepContracts } from "@/contracts/contracts";
import { LINKTokenContracts } from "@/contracts/chainlink";
import { getContractByChainAndAddress } from "@/contracts/client";
import { LotteryData } from "./LotteryData";
import Link from "next/link";

const RegisterNewUpkeep = ({
  currentChainId,
  lotteryContractAddress,
  tokensToSend,
}: {
  currentChainId: AppChainId;
  lotteryContractAddress: string;
  tokensToSend: bigint;
}) => {
  const { data, mutate, isPending, isSuccess, isError, error } =
    useSendAndConfirmTransaction();

  const onAddConsumer = async () => {
    const registerUpkeep = registerUpkeepContracts.find(
      (_) => _.chainId === currentChainId
    );
    if (registerUpkeep) {
      const tx = prepareContractCall({
        contract: getContractByChainAndAddress(
          registerUpkeep.chainId,
          registerUpkeep.address
        ),
        method:
          "function registerAndPredictID(string memory _name, address _contractAddress, uint _linksToSend) external",
        params: [`lottery${Date.now()}`, lotteryContractAddress, tokensToSend],
      });
      mutate(tx);
    }
  };

  return (
    <div>
      {!data && (
        <div>
          <div>Finally connect your lottery with your automation</div>
          <button
            className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
            onClick={() => onAddConsumer()}
            disabled={isPending}
          >
            Register automation
          </button>
        </div>
      )}
      {isPending && <div>Registering new upkeep ...</div>}
      {isSuccess && data && (
        <div>
          <Link
            href={"./"}
            className="bg-green-100 p-2 rounded-md cursor-pointer"
          >
            Kudos! Go back to lottery list
          </Link>
        </div>
      )}
      {isError && <div className="text-sm text-red-700">{error.message}</div>}
    </div>
  );
};

export const ConfigureAutomation = ({
  manageCreation,
  currentChainId,
}: {
  manageCreation: IManageCreation;
  currentChainId: AppChainId;
}) => {
  const LINK_TOKENS_TO_SEND = BigInt(0.2 * 10 ** 18);
  const { data, mutate, isPending, isSuccess, isError, error } =
    useSendAndConfirmTransaction();
  const { lotteryContractAddress, metadata } = manageCreation;

  const onFundAutomation = async () => {
    const registerUpkeep = registerUpkeepContracts.find(
      (_) => _.chainId === currentChainId
    );
    const LINKToken = LINKTokenContracts.find(
      (_) => _.chainId === currentChainId
    );
    if (registerUpkeep && LINKToken) {
      const sendLINkTx = prepareContractCall({
        contract: getContractByChainAndAddress(
          currentChainId,
          LINKToken.address
        ),
        method:
          "function transfer(address to, uint256 amount) public returns (bool)",
        params: [registerUpkeep.address, LINK_TOKENS_TO_SEND],
      });
      mutate(sendLINkTx);
    }
  };

  return (
    <div>
      <div>Lottery inputs:</div>
      {metadata && (
        <LotteryData lotteryDataEntered={metadata} className="mb-4" />
      )}

      {isSuccess && data && lotteryContractAddress ? (
        <RegisterNewUpkeep
          currentChainId={currentChainId}
          lotteryContractAddress={lotteryContractAddress}
          tokensToSend={LINK_TOKENS_TO_SEND}
        />
      ) : (
        <>
          <div>
            <div>
              Now lets send some tokens to perform automation, it means winner
              selection process will be triggered automatic
            </div>
            <button
              className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
              onClick={onFundAutomation}
              disabled={isPending}
            >
              Send {toEther(LINK_TOKENS_TO_SEND)} LINK to Automation
            </button>
          </div>

          <div>
            {isPending && <div>Funding automation ...</div>}
            {isError && (
              <div className="text-sm text-red-700">{error.message}</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
