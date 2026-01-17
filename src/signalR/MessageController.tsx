import * as signalR from "@microsoft/signalr";
import { useEffect, useState } from "react";
import MessageForm from "../components/Forms/Messages/MessageForm";
import { useAuth } from "../Auth/AuthProvider";
import { MdDeleteOutline } from "react-icons/md";
import backgroundImage from "../Images/Background_Image.png";
import LoadingComponent from "../components/common/LoadingComponent";

interface Message {
  id: number;
  content: string;
  timestamp: string;
}

function MessageController() {
  const [connection, setConnection] = useState<null | signalR.HubConnection>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnectionReady, setIsConnectionReady] = useState<boolean>();
  const [areMessagesLoaded, setAreMessagesLoaded] = useState<boolean>(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function getMessages() {
      try {
        const data = await fetch(
          "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/messages/user-messages",
          {
            credentials: "include",
          }
        );
        const parsedData = await data.json();
        const fetchedMessages = parsedData.map((message: Message) => {
          return {
            id: message.id,
            content: message.content,
            timestamp: message.timestamp,
          };
        });
        setMessages(fetchedMessages);
        setAreMessagesLoaded(true);
      } catch (err) {
        console.log("Error", err);
      }
    }

    getMessages();
  }, []);

  try{
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
          .withUrl(
            "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/chatHub",
            { withCredentials: true }
          )
          .build();
        setConnection(newConnection);
      }, []);
  } catch (err){
    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
          .withUrl(
            "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/chatHub",
            { withCredentials: true }
          )
          .build();
        setConnection(newConnection);
      }, []);
    console.error(err)
  }
  

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("connected");
          setIsConnectionReady(true);
          console.log(connection.connectionId);
          connection.on("ReceiveMessage", handleNewMessage);
        })
        .catch((e) => console.log(e));
    }
  }, [connection]);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true, // Use 12-hour format (e.g., 2:46 PM)
    }).format(date);
  }

  function handleNewMessage(message: Message) {
    message.timestamp = new Date().toString();
    setMessages((messages) => [...messages, message]);
  }

  async function handleDelete(id: number) {
    const newMessages = messages.filter((message) => {
      return message.id !== id;
    });
    setMessages(newMessages);
    try {
      const result = await fetch(
        `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/messages/user-messages/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!result.ok) {
        throw new Error("Error during deleting a message");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div
      className="bg-opacity-50 flex flex-col items-center p-4 bg-gray-100 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {!isConnectionReady && <LoadingComponent />}
      {isConnectionReady && (
        <div className="w-full mt-24 max-w-md bg-white p-4 rounded-lg shadow-md">
          <MessageForm connection={connection} users={[]} />
          {/* TUTAJ JEST PUSTA LISTA UCZESTNIKOW KONWERSACJI!! */}
        </div>
      )}
      <ul className="w-full max-w-md mt-4 space-y-2">
        {!areMessagesLoaded && <LoadingComponent />}
        {areMessagesLoaded &&
          messages.map((message) => (
            <li
              key={message.id}
              className="p-2 bg-blue-500 text-white rounded-lg shadow-md flex justify-between"
            >
              <div>
                <span className="font-bold">{currentUser?.username}:</span>{" "}
                <span>{message.content}</span>
              </div>
              <span className="flex justify-center items-center">
                {formatDate(message.timestamp)}
                <MdDeleteOutline
                  onClick={() => handleDelete(message.id)}
                  className="cursor-pointer"
                />
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default MessageController;
