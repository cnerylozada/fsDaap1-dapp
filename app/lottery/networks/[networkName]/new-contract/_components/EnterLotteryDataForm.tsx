import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  IManageCreation,
  schema,
  SchemaType,
  Steps,
} from "./LotteryCreationFlow";

export const EnterLotteryDataForm = ({
  setManageCreation,
}: {
  setManageCreation: Dispatch<SetStateAction<IManageCreation>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SchemaType>({
    mode: "all",
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    console.log("data", (data.date.getTime() - new Date().getTime()) / 1000);

    setManageCreation((_) => ({
      ..._,
      currentStep: Steps.SELECT_SUBSCRIPTION,
      metadata: data,
    }));
  };

  useEffect(() => {
    reset();
  }, []);

  return (
    <div>
      <div>Enter lottery main data</div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <div>
            <input
              {...register("title")}
              placeholder="Title"
              className="border"
            />
          </div>
          <div>
            {!!errors.title && (
              <div className="mt-1 text-sm text-red-700">
                {errors.title.message}
              </div>
            )}
          </div>
        </div>
        <div>
          <div>
            <input
              {...register("description")}
              placeholder="Description"
              className="border"
            />
          </div>
          <div>
            {!!errors.description && (
              <div className="mt-1 text-sm text-red-700">
                {errors.description.message}
              </div>
            )}
          </div>
        </div>
        <div>
          <div>
            <input
              {...register("prize", { valueAsNumber: true })}
              placeholder="Prize in ETH"
              className="border"
            />
          </div>
          <div>
            {!!errors.prize && (
              <div className="mt-1 text-sm text-red-700">
                {errors.prize.message}
              </div>
            )}
          </div>
        </div>
        <div>
          <div>
            <input
              {...register("numTickets", { valueAsNumber: true })}
              placeholder="Number of tickets"
              className="border"
            />
          </div>
          <div>
            {!!errors.numTickets && (
              <div className="mt-1 text-sm text-red-700">
                {errors.numTickets.message}
              </div>
            )}
          </div>
        </div>
        <div>
          <div>
            <input
              {...register("ticketPrice", { valueAsNumber: true })}
              placeholder="Ticket price in ETH"
              className="border"
            />
          </div>
          <div>
            {!!errors.ticketPrice && (
              <div className="mt-1 text-sm text-red-700">
                {errors.ticketPrice.message}
              </div>
            )}
          </div>
        </div>
        <div>
          <div>
            <input
              {...register("date", { valueAsDate: true })}
              type="datetime-local"
              className="border"
            />
          </div>
          <div>
            {!!errors.date && (
              <div className="mt-1 text-sm text-red-700">
                {errors.date.message}
              </div>
            )}
          </div>
        </div>
        <div>
          <button
            className="p-2 bg-blue-100 rounded-md disabled:bg-gray-200"
            type="submit"
          >
            Save and continue
          </button>
        </div>
      </form>
    </div>
  );
};
