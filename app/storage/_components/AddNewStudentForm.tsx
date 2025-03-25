"use client";
import { useCheckWalletAndNetwork } from "@/components/hooks";
import { getContractByChainAndAddress } from "@/contracts/client";
import { appScanURLRecord } from "@/contracts/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { prepareContractCall } from "thirdweb";
import { useSendAndConfirmTransaction } from "thirdweb/react";
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

export const AddNewStudentForm = () => {
  const { networkName, address } = useParams();

  const {
    isWalletConnectedToCorrectChain,
    targetAppNetwork,
    appChainId,
    walletAddress,
  } = useCheckWalletAndNetwork(`${networkName}`);

  const { mutate, data, isPending, isSuccess, error } =
    useSendAndConfirmTransaction();

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
      contract: getContractByChainAndAddress(appChainId, `${address}`),
      method:
        "function addNewStudent(string calldata _name, uint8 _level) external",
      params: [data.name, data.level],
    });
    mutate(tx);
  };

  if (!walletAddress || !isWalletConnectedToCorrectChain)
    return (
      <div>
        Connect your wallet to {targetAppNetwork?.name} to perform operations
      </div>
    );

  return (
    <div>
      <div className="font-bold">AddNewStudentForm</div>
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
              disabled={isPending}
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
                href={`${appScanURLRecord[appChainId]}/${data.transactionHash}`}
                target="_blank"
                className="text-blue-700 text-sm underline"
              >
                Transaction Hash: {shortenHex(data.transactionHash)}
              </Link>
            </div>
          )}
          {error && <div>{error.message}</div>}
        </div>
      </div>
    </div>
  );
};
