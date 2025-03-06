"use client";
import { getStorageFactoryContractClientSideByNetwork } from "@/contracts/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { prepareContractCall } from "thirdweb";
import { optimismSepolia } from "thirdweb/chains";
import { useSendAndConfirmTransaction } from "thirdweb/react";
import { z } from "zod";

const schema = z.object({ course: z.string().min(5) });
type SchemaType = z.infer<typeof schema>;

export const CreateNewClassroom = () => {
  const router = useRouter();
  const { chainName } = useParams();
  const { mutateAsync: sendAndConfirmTx, isPending } =
    useSendAndConfirmTransaction();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({ mode: "all", resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    const tx = prepareContractCall({
      contract: getStorageFactoryContractClientSideByNetwork(optimismSepolia),
      method: "function createStorage(string calldata _course) external",
      params: [data.course],
    });

    await sendAndConfirmTx(tx);
    router.push(`../${chainName}/`);
  };

  return (
    <div>
      <div className="font-bold">CreateNewClassroom</div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex space-x-2 items-center">
            <div>
              <div>
                <input
                  {...register("course")}
                  className="border"
                  placeholder="Name"
                />
              </div>
              <div>
                {!!errors.course && (
                  <div className="mt-1 text-sm text-red-700">
                    {errors.course.message}
                  </div>
                )}
              </div>
            </div>
            <div>
              <button
                className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
                type="submit"
                disabled={isPending}
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
      <div>{isPending && <div>Loading transaction ...</div>}</div>
    </div>
  );
};
