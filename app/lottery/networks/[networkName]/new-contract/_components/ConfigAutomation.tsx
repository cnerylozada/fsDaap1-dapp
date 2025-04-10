import { useSendAndConfirmTransaction } from "thirdweb/react";
import { IManageCreation } from "./LotteryCreationFlow";
import { AppChainId } from "@/contracts/settings";
import { prepareContractCall } from "thirdweb";
import { registerUpkeepContracts } from "@/contracts/contracts";
import { LINKTokenContracts } from "@/contracts/chainlink";
import { getContractByChainAndAddress } from "@/contracts/client";

const RegisterNewUpkeep = ({
  currentChainId,
  lotteryContractAddress,
}: {
  currentChainId: AppChainId;
  lotteryContractAddress: string;
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
          "function registerAndPredictID(string memory _name, address _contractAddress) external",
        params: [`lottery${Date.now()}`, lotteryContractAddress],
      });
      mutate(tx);
    }
  };

  return (
    <div>
      {!data && (
        <div>
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
      {isSuccess && data && <div>END</div>}
      {isError && <div className="text-sm text-red-700">{error.message}</div>}
    </div>
  );
};

export const ConfigAutomation = ({
  manageCreation,
  currentChainId,
}: {
  manageCreation: IManageCreation;
  currentChainId: AppChainId;
}) => {
  const { data, mutate, isPending, isSuccess, isError, error } =
    useSendAndConfirmTransaction();
  const { lotteryContractAddress } = manageCreation;

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
        params: [registerUpkeep.address, BigInt(1 * 10 ** 18)],
      });
      mutate(sendLINkTx);
    }
  };

  return (
    <div>
      <div>Your lottery inputs:</div>
      <div></div>

      {isSuccess && data && lotteryContractAddress ? (
        <RegisterNewUpkeep
          currentChainId={currentChainId}
          lotteryContractAddress={lotteryContractAddress}
        />
      ) : (
        <>
          <div>
            <button
              className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
              onClick={onFundAutomation}
              disabled={isPending}
            >
              Fund Automation
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
