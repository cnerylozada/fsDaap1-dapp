"use client";
import { getStorageContractClientSideByNetwork } from "@/contracts/client";
import { appNetworks } from "@/contracts/networks";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { prepareContractCall } from "thirdweb";
import { ChainOptions } from "thirdweb/chains";
import {
  useActiveAccount,
  useActiveWalletChain,
  useSendAndConfirmTransaction,
} from "thirdweb/react";
import { shortenHex } from "thirdweb/utils";
import { z } from "zod";

export const studentLevels = [
  { value: 0, label: "Beginner" },
  { value: 1, label: "Medium" },
  { value: 2, label: "Advanced" },
];

const schema = z.object({
  name: z.string().min(5),
  level: z.number().int(),
});
type SchemaType = z.infer<typeof schema>;

export const AddNewStudentForm = ({
  contractChain,
}: {
  contractChain: ChainOptions;
}) => {
  const appNetwork = appNetworks.filter(
    (_) => _.chain.name === contractChain.name
  )[0];
  const activeAccount = useActiveAccount();
  const activeWalletChain = useActiveWalletChain();

  const {
    mutate: sendAndConfirmTx,
    data,
    isPending,
    isSuccess,
    error,
  } = useSendAndConfirmTransaction();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaType>({
    mode: "all",
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    const tx = prepareContractCall({
      contract: getStorageContractClientSideByNetwork(contractChain),
      method:
        "function addNewStudent(string calldata _name, uint8 _level) external",
      params: [data.name, data.level],
    });
    sendAndConfirmTx(tx);
  };

  return (
    <div>
      <div className="font-bold">AddNewStudentForm</div>
      {activeAccount &&
      activeWalletChain &&
      activeWalletChain.id === contractChain.id ? (
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <div>
                <input
                  {...register("name")}
                  className="border"
                  placeholder="Name"
                />
              </div>
              <div>
                {!!errors.name && (
                  <div className="mt-1 text-sm text-red-700">
                    {errors.name.message}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div>
                <select {...register("level", { valueAsNumber: true })}>
                  {studentLevels.map((_) => (
                    <option key={_.value} value={_.value}>
                      {_.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <button
                className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
                type="submit"
              >
                Add new student
              </button>
            </div>
          </form>
          <div>
            {isPending && <div>Loading transaction ...</div>}
            {isSuccess && (
              <div>
                Check your transaction:{" "}
                <Link
                  href={`${appNetwork.scan}/${data.transactionHash}`}
                  target="_blank"
                  className="text-blue-700 text-sm underline"
                >
                  Transaction Hash: {shortenHex(data.transactionHash)}
                </Link>
              </div>
            )}
            {error && <div>{JSON.stringify(error)}</div>}
          </div>
        </div>
      ) : (
        <div>
          <div>
            Please connect your wallet and change to{" "}
            <span className="font-bold">{contractChain.name}</span> to perform
            this operation
          </div>
        </div>
      )}
    </div>
  );
};
