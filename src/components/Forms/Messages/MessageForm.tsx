import React, { useState } from "react";
import { useAuth } from "../../../Auth/AuthProvider";
import { useParams } from "react-router";
import { encryptWithRSA } from "../../../crypto/CryptoProvider";
import { MessageRecipientDto } from "../../../Types/MessageRecipientDto";
import { SendMessageToChatDto } from "../../../Types/SendMessageToChatDto";
import { ConversationParticipant } from "../../../Types/ConversationParticipant";
import { SimpleSendMessageToChatDto } from "../../../Types/SimpleSendMessageToChatDto";

interface MessageFormProps {
  connection: signalR.HubConnection | null;
  users: Array<ConversationParticipant>;
}

function MessageForm({ connection, users }: MessageFormProps) {
  console.log(users, "users in message form");
  const [messageInput, setMessageInput] = useState<string>("");
  const { currentUser } = useAuth();
  const { conversationId } = useParams();

  function handleMessageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMessageInput(e.target.value);
  }

  async function handleClick() {
    if (!connection) {
      return;
    }
    if (messageInput === "") {
      return;
    }
    console.log(users);
    const messageRecipients: MessageRecipientDto[] = await Promise.all(
      users.map(async (participant) => {
        const encryptedMessage = await encryptWithRSA(
          participant.publicKey,
          messageInput
        );
        return {
          recipientId: participant.id,
          encryptedMessage: encryptedMessage,
        };
      })
    );
    console.log("messageRecipients", messageRecipients);
    if (!currentUser)
      throw Error("Cannot send message because there is no current user");
    if (!conversationId)
      throw Error("Cannot send message because there is no conversationId");

    const sendMessageDto: SendMessageToChatDto = {
      conversationId: conversationId,
      senderId: currentUser.id,
      messageRecipients: messageRecipients,
    };

    const simpleSendMessageDto: SimpleSendMessageToChatDto = {
      messageRecipients: messageRecipients,
    };

    async function validateResponse(response: Response) {
      if (response.ok) {
        return;
      }

      if (response.status === 404) {
        throw Error("User not found!");
      }
      if (response.status === 400) {
        const text = await response.text();
        throw Error(text);
      }
    }

    console.log(sendMessageDto, "sendmessagedtoprzedwyslaniem");

    if (connection.connectionId != null) {
      connection.invoke("SendMessageToChat", sendMessageDto);
    } else {
      const response = await fetch(
        `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/conversations/${conversationId}/messages/send-message`,
        {
          headers: {
            "content-type": "application/json",
          },
          method: "POST",
          credentials: "include",
          body: JSON.stringify(simpleSendMessageDto),
        }
      );
      await validateResponse(response);
      await window.location.reload();

      console.error("No connection id");
    }

    connection.invoke("GetConnectionId");

    setMessageInput("");
  }

  return (
    <div className="w-full sticky bottom-0 z-20 bg-gray-900 px-2 py-2 sm:px-4 sm:py-3 shadow-inner border-t border-gray-700">
      <div className="flex flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
        <label className="text-white text-sm sm:text-base whitespace-nowrap">
          Wiadomość:
        </label>

        <input
          type="text"
          value={messageInput}
          onChange={handleMessageInputChange}
          className="flex-grow min-w-0 p-2 pb-6 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          placeholder="Wpisz wiadomość..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Prevent form submission or newline
              handleClick();
            }
          }}
        />
        {connection && (
          <button
            type="submit"
            onClick={handleClick}
            className="bg-[#7a9a6e] text-white pl-5 pr-5 px-4 py-2 rounded-md hover:bg-green-700 transition text-sm sm:text-base w-full sm:w-auto"
          >
            Wyślij
          </button>
        )}
      </div>
    </div>
  );
}

export default MessageForm;
