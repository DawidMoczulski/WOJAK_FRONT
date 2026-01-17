import { Message } from "../Types/Message";

interface MessageProps {
  message: Message;
  currentUsername: string;
}

function MessageComponent({ message, currentUsername }: MessageProps) {
  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    }).format(date);
  }

  const isOwnMessage = message.username === currentUsername;

  return (
    <li
      key={message.id}
      className={`flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      } w-full`}
    >
      <div
        className={`p-2 max-w-[70%] ${
          isOwnMessage ? "bg-gray-700 text-white" : "bg-[#6ec277] text-black"
        } rounded-lg shadow-md`}
      >
        {!isOwnMessage && (
          <div className="text-base font-mono">{message.username}</div>
        )}

        <div>{message.content}</div>
        <div className="text-xs opacity-80 text-right">
          {formatDate(message.timestamp)}
        </div>
      </div>
    </li>
  );
}

export default MessageComponent;
