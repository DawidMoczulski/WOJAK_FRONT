import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Message } from "../Types/Message";
import { Conversation } from "../Types/Conversation";
import MessageForm from "./Forms/Messages/MessageForm";
import MessageComponent from "./Message";
import { ReceiveMessageDto } from "../Types/ReceiveMessageDto";
import { decryptWithRSA } from "../crypto/CryptoProvider";
import { useAuth } from "../Auth/AuthProvider";
import LoadingComponent from "./common/LoadingComponent";
import { ConversationParticipant } from "../Types/ConversationParticipant";

interface ChatComponentProps {
  conversation: Conversation;
}

function ChatComponent({ conversation }: ChatComponentProps) {
  const [connection, setConnection] = useState<null | signalR.HubConnection>(
    null
  );
  const [areMessagesLoaded, setAreMessagesLoaded] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { currentUser } = useAuth();

  console.log("conversation in chat component", conversation);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/chatHub",
        { withCredentials: true }
      )
      .build();
    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.invoke("JoinConversation", {
            ConversationId: conversation.id.toString(),
          });
          connection.on("ReceiveMessage", handleNewMessage);
        })
        .catch((e) => console.log(e));
    }
  }, [connection]);

  useEffect(() => {
    async function getMessages() {
      console.log("conversation", conversation);
      console.log("conversationid", conversation.id);
      try {
        const response = await fetch(
          `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/conversations/${conversation.id}/messages`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log("data", data);
        const decryptedMessages = [];
        for (const message of data) {
          const decryptedMessage = await decryptMessage(message);
          decryptedMessages.push(decryptedMessage);
        }
        setMessages(decryptedMessages);
        setAreMessagesLoaded(true);
      } catch (err) {
        console.log(err);
        setAreMessagesLoaded(false);
      }
    }
    getMessages();
  }, []);

  async function decryptMessage(message: ReceiveMessageDto): Promise<Message> {
    const privateKey = localStorage.getItem(
      `${currentUser?.username}_privateKey`
    );
    if (!privateKey) {
      throw Error("private key is null");
    }
    const decryptedMessage = await decryptWithRSA(
      privateKey,
      message.encryptedMessage
    );
    const username = getUsernameById(message.senderId, conversation.users);
    return {
      id: message.id,
      username: username,
      content: decryptedMessage,
      timestamp: message.timestamp,
    };
  }

  function getUsernameById(id: string, users: Array<ConversationParticipant>) {
    const participant = users.find((participant) => participant.id === id);
    if (!participant)
      throw Error("Receiver id doesn't match any conversation participant id");

    return participant?.username;
  }

  async function handleNewMessage(message: ReceiveMessageDto) {
    const decryptedMessage = await decryptMessage(message);
    setMessages((messages) => [...messages, decryptedMessage]);
  }
  return (
    <div className="flex flex-col h-full min-h-[80vh] bg-[#dae4f0]">
      {/* Lista wiadomości */}

      <ul className="flex-1 overflow-y-auto mt-10 px-2 space-y-2 pr-4 pb-24">
        {!areMessagesLoaded && <LoadingComponent />}

        {areMessagesLoaded &&
          messages.map((message) => (
            <MessageComponent
              key={message.id}
              message={message}
              currentUsername={currentUser?.username || ""}
            />
          ))}
      </ul>

      {/* Formularz wiadomości */}
      <div className="mt-2 w-full">
        <MessageForm connection={connection} users={conversation.users} />
      </div>
    </div>
  );
}

export default ChatComponent;
