import { LotterySchemaType } from "./LotteryCreationFlow";

export const LotteryData = ({
  lotteryDataEntered,
  className,
}: {
  lotteryDataEntered: LotterySchemaType;
  className?: string;
}) => {
  return (
    <div className={className}>
      <div>Title: {lotteryDataEntered.title}</div>
      <div>Description: {lotteryDataEntered.description}</div>
      <div>Event date: {lotteryDataEntered.eventDate.toISOString()}</div>
      <div>Prize: {lotteryDataEntered.prize} ETH</div>
      <div>Number of tickets: {lotteryDataEntered.numTickets}</div>
      <div>Ticket price: {lotteryDataEntered.ticketPrice} ETH</div>
    </div>
  );
};
