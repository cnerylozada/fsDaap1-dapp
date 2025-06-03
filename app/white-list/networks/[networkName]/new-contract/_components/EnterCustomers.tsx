import { getContractByChainAndAddress } from "@/contracts/client";
import {
  AppChainId,
  appNetworkPathRecord,
  appNetworkRecord,
  IAppContract,
} from "@/contracts/settings";
import {
  Hex,
  isAddress,
  parseEventLogs,
  prepareContractCall,
  prepareEvent,
} from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { getMerkleTree } from "../../[address]/_components/utils";
import { Dispatch, SetStateAction } from "react";
import { IManageCreation, Steps } from "./CreationFlow";
import { TransactionReceipt } from "thirdweb/transaction";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const getDestinyMinterContractAddress = (txReceipt: TransactionReceipt) => {
  const newDestinyMinter = prepareEvent({
    signature:
      "event NewDestinyMinter(address indexed destinyMinter, bytes32 merkleRoot)",
  });
  const createWhiteListLogs = parseEventLogs({
    events: [newDestinyMinter],
    logs: txReceipt.logs,
  });
  const { args } = createWhiteListLogs[0];
  return args;
};

const chains = [
  {
    value: AppChainId.optimismSepolia,
    label: appNetworkPathRecord[AppChainId.optimismSepolia],
  },
  {
    value: AppChainId.arbitrumSepolia,
    label: appNetworkPathRecord[AppChainId.arbitrumSepolia],
  },
];
const isUnique = (array: string[]) => new Set(array).size === array.length;
const schema = z.object({
  audience: z
    .array(
      z.object({
        walletAddress: z.string().refine((_) => isAddress(_), {
          message: `Enter a valid wallet address`,
        }),
        chainId: z.number().int(),
      })
    )
    .min(1, "Enter at least 1 user")
    .refine(
      (audience) => {
        const walletAddresses = audience.map((user) => user.walletAddress);
        return isUnique(walletAddresses);
      },
      {
        message: "Wallet addresses must be unique",
      }
    ),
});
type SchemaType = z.infer<typeof schema>;

export const EnterCustomers = ({
  factoryContract,
  setManageCreation,
}: {
  factoryContract: IAppContract;
  setManageCreation: Dispatch<SetStateAction<IManageCreation>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<SchemaType>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      audience: [{ walletAddress: "0x0", chainId: AppChainId.optimismSepolia }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "audience",
  });

  const { mutate, isPending, isSuccess, isError, error, data } =
    useSendAndConfirmTransaction();
  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    const formatWhiteList = data.audience.map(
      (_) => [_.walletAddress, BigInt(_.chainId)] as const
    );
    const merkleRoot = getMerkleTree(formatWhiteList).getHexRoot();
    const transaction = prepareContractCall({
      contract: getContractByChainAndAddress(
        factoryContract.chainId,
        factoryContract.address
      ),
      method:
        "function createWhiteList((address,uint256)[] memory _users, bytes32 _merkleRoot) external",
      params: [formatWhiteList, merkleRoot as Hex],
    });
    mutate(transaction);
  };

  return (
    <div>
      <div className="mb-3">
        <div>
          First, lets enter the data of your audience. Enter their wallet
          address and the network where they will perform minting After the
          final step, only they will be able to claim only 1 NFT stored in{" "}
          {appNetworkRecord[factoryContract.chainId]?.name}
        </div>
        <div>Please enter at least 1 row. Wallet addresses must be unique</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="text-right">
          <button
            className="p-2 text-sm bg-blue-100 rounded-md cursor-pointer"
            type="button"
            onClick={() => {
              append({
                chainId: AppChainId.optimismSepolia,
                walletAddress: "0x0",
              });
            }}
          >
            Add new user
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => {
            return (
              <div
                key={field.id}
                className="p-3 md:flex space-y-3 md:space-y-0 md:space-x-3 border rounded-md"
              >
                <div className="md:w-[50%]">
                  <input
                    className="border w-full"
                    placeholder="0x54e8dc4C949eEFAdb78DB60F3feCe3A47FcBFDa1"
                    {...register(`audience.${index}.walletAddress`)}
                  />
                  {!!errors?.audience?.[index]?.walletAddress && (
                    <div className="mt-1 text-sm text-red-700">
                      {errors?.audience?.[index]?.walletAddress?.message}
                    </div>
                  )}
                </div>
                <div className="md:w-[50%] flex space-x-3 justify-between">
                  <select
                    className="grow border"
                    {...register(`audience.${index}.chainId`, {
                      valueAsNumber: true,
                    })}
                  >
                    {chains.map((_) => (
                      <option key={_.value} value={_.value}>
                        {_.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="py-1 px-2 text-xs bg-blue-100 rounded-md cursor-pointer"
                    onClick={() => remove(index)}
                  >
                    Remove field
                  </button>
                </div>
              </div>
            );
          })}
          {!!errors?.audience && (
            <div className="mt-1 text-sm text-red-700">
              {errors?.audience?.message}
            </div>
          )}
        </div>
        <div>
          {isSuccess && data ? (
            <div>
              <button
                type="button"
                className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
                onClick={() => {
                  const { destinyMinter, merkleRoot } =
                    getDestinyMinterContractAddress(data);
                  setManageCreation((_) => ({
                    ..._,
                    currentStep: Steps.DEPLOY_SOURCE_MINTER,
                    destinyContractAddress: destinyMinter,
                    merkleRoot,
                  }));
                }}
              >
                Continue
              </button>
            </div>
          ) : (
            <>
              <div>
                <button
                  className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200 cursor-pointer"
                  type="submit"
                  disabled={!isValid || isPending}
                >
                  Submit my audience
                </button>
              </div>
              {isPending && <div>Loading transaction ...</div>}
              {isError && (
                <div className="text-sm text-red-700">{error.message}</div>
              )}
            </>
          )}
        </div>
      </form>
    </div>
  );
};
