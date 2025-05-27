import { IAppContract } from "@/contracts/settings";
import { getAnswerByUserQuestion, queryContract } from "@/server/nebula";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useActiveAccount } from "thirdweb/react";
import { z } from "zod";

const schema = z.object({ question: z.string().min(15) });
type SchemaType = z.infer<typeof schema>;

export const AIChat = ({
  appContract,
  sessionId,
}: {
  appContract: IAppContract;
  sessionId: string;
}) => {
  const activeAccount = useActiveAccount();

  const [messages, setMessages] = useState<
    { role: "ai" | "user"; message: string }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);

  const onFetchContractDetails = async () => {
    setIsTyping(true);
    const response = await queryContract(
      sessionId,
      appContract.address,
      appContract.chainId,
      activeAccount ? activeAccount?.address : ""
    );
    setIsTyping(false);
    return response.message;
  };

  const onDefaultMessage = async () => {
    const response = await onFetchContractDetails();
    setMessages((_) => [..._, { role: "ai", message: response }]);
  };

  useEffect(() => {
    onDefaultMessage();
  }, []);

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm({ mode: "all", resolver: zodResolver(schema) });

  const onSendUserMessage = async (question: string) => {
    setIsTyping(true);
    const response = await getAnswerByUserQuestion(
      sessionId,
      question,
      appContract.chainId,
      activeAccount ? activeAccount?.address : ""
    );
    setIsTyping(false);
    setMessages((_) => [
      ..._,
      {
        role: "ai",
        message: response.message,
      },
    ]);
  };

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    setMessages((_) => [..._, { role: "user", message: data.question }]);
    onSendUserMessage(data.question);
    reset();
  };

  return (
    <div className="p-4 rounded-md border">
      <div className="mb-2 font-bold">Lets chat with our OnChain AI</div>

      <div className="mb-3 space-y-2 max-h-[400px] overflow-y-auto">
        {messages.map((_, index) =>
          _.role === "ai" ? (
            <div key={index} className="p-1 rounded-md w-fit bg-green-50">
              <ReactMarkdown>{_.message}</ReactMarkdown>
            </div>
          ) : (
            <div
              key={index}
              className="p-1 rounded-md w-fit ml-auto bg-yellow-50"
            >
              {_.message}
            </div>
          )
        )}
        {isTyping && (
          <div className="p-1 rounded-md w-fit bg-green-50">Typing ...</div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-4">
        <div className="grow">
          <input
            {...register("question")}
            placeholder="Enter some ask"
            className="p-1 w-full border disabled:bg-gray-200 disabled:cursor-not-allowed"
            disabled={isTyping}
          />
          {!!errors.question && (
            <div className="mt-1 text-sm text-red-700">
              {errors.question.message}
            </div>
          )}
        </div>
        <div>
          <button
            className="p-2 bg-blue-100 rounded-md cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
            type="submit"
            disabled={isTyping}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
