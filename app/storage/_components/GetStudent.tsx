"use client";
import { storageContractClientSideOpSepolia } from "@/contracts/client";
import { useReadContract } from "thirdweb/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  index: z.number().int(),
});
type SchemaType = z.infer<typeof schema>;

export const GetStudent = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SchemaType>({
    mode: "all",
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<SchemaType> = () => {
    refetch();
  };

  const { data, isLoading, refetch } = useReadContract({
    contract: storageContractClientSideOpSepolia,
    method:
      "function getStudentByIndex(uint _index) external view returns (Utils.Student memory)",
    params: [BigInt(isNaN(getValues("index")) ? 0 : getValues("index"))],
  });

  return (
    <div>
      <div className="font-bold">GetStudent</div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-x-2 items-center">
            <div>
              <div>
                <input
                  {...register("index", { valueAsNumber: true })}
                  placeholder="99"
                  className="border"
                />
              </div>
              {!!errors.index && (
                <div className="mt-1 text-sm text-red-700">
                  {errors.index.message}
                </div>
              )}
            </div>
            <div>
              <button
                className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
                type="submit"
                disabled={isLoading}
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
      <div>
        {isLoading && <div>Searching student ...</div>}
        {!isLoading && !data && (
          <div>No results for student index: {getValues("index")}</div>
        )}
        {!isLoading && !!data && <div>{JSON.stringify(data)}</div>}
      </div>
    </div>
  );
};
