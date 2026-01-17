import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ConversationParticipantsModal from "./ConversationParticipantsModal";
import ChatComponent from "./ChatComponent";
import { Conversation } from "../Types/Conversation";
import LoadingComponent from "./common/LoadingComponent";

function ConversationPage() {
  const [conversation, setConversation] = useState<Conversation>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConversationLoaded, setIsConversationLoaded] = useState(false);
  const { conversationId } = useParams();

  const navigate = useNavigate();
  async function handleLeaveConversation() {
    try {
      console.log(conversationId);

      const response = await fetch(
        `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/conversations/${conversationId}/users`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw Error("Response nie jest ok");
      }
      navigate(`/chats`);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function getConversationData() {
      try {
        const response = await fetch(
          `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/conversations/${conversationId}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log(data, "conversation data");
        setConversation(data);
        setIsConversationLoaded(true);
      } catch (err) {
        console.log(err);
        setIsConversationLoaded(false);
      }
    }

    getConversationData();
  }, [conversationId]);

  console.log(conversation, "conversation w conversationPage");

  return (
    <div className="flex flex-col lg:flex-row min-h-screen overflow-hidden bg-gray-100 bg-opacity-50 bg-cover bg-center lg:pb-0">
      {/* Część główna: 80% szerokości */}
      {conversation && isConversationLoaded && (
        <div className="w-full lg:w-4/5 mt-4 lg:mt-20 flex flex-col flex-grow overflow-auto">
          <ChatComponent conversation={conversation} />
        </div>
      )}
      {/* Panel boczny: 20% szerokości */}
      <div className="w-full lg:w-1/5 pt-5 flex flex-col  lg:mt-20 space-y-4 bg-gradient-to-l from-[#14151a] from-3% via-[#293147] via-15% to-[#3c4352] to-90% px-2">
        {isConversationLoaded && conversation && (
          <div
            className="ml-4 mr-4 border-amber-700 border-2 p-3 rounded-md cursor-pointer hover:bg-[#a3a6a8] transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <h1 className="text-white font-bold text-base">
              {conversation.name}
            </h1>
            <h2 className="text-white font-bold text-sm break-words">
              {conversation.description}
            </h2>
            <h2 className="text-white text-sm break-words">
              (Kliknij aby zobaczyć członków)
            </h2>
          </div>
        )}

        {!isConversationLoaded && <LoadingComponent />}

        {isModalOpen && conversation && (
          <ConversationParticipantsModal
            setIsModalOpen={setIsModalOpen}
            users={conversation?.users}
          />
        )}

        <button
          onClick={() => navigate("/chats")}
          className="ml-5 mr-5 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold py-2 px-3 rounded-md shadow-md transition-all duration-300 transform hover:from-gray-600 hover:to-gray-700 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          Powrót
        </button>

        <button
          onClick={() => navigate(`/chats/${conversationId}/add-friends`)}
          className="ml-5 mr-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-3 rounded-md shadow-md transition-all duration-300 transform hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          Dodaj członka drużyny
        </button>
        <button
          onClick={() => navigate(`/chats/${conversationId}/add-by-qr`)}
          className="ml-5 mr-5 bg-gradient-to-r from-[#4a7d7c] to-[#4d8c8b] text-white font-semibold py-2 px-3 rounded-md shadow-md transition-all duration-300 transform hover:from-[#4d8c8b] hover:to-[#4d8c8b] hover:scale-105 hover:shadow-lg active:scale-95"
        >
          Dodaj członka drużyny (QR Code)
        </button>
        <button
          onClick={() => {
            console.log("users", conversation?.users);
            return navigate(`/maps/${conversationId}`, {
              state: { users: conversation?.users, pins: conversation?.pins },
            });
          }}
          className=" ml-5 mr-5 bg-[#7a9a6e] hover:bg-[#86b376] text-white font-semibold py-2 px-3 rounded-md shadow-md transition-all duration-300 transform hover:from-green-600 hover:to-green-800 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          Mapa
        </button>

        <button
          onClick={handleLeaveConversation}
          className="mb-5 ml-5 mr-5 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold py-2 px-3 rounded-md shadow-md transition-all duration-300 transform hover:from-red-600 hover:to-red-800 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          Opuść drużynę
        </button>
      </div>
    </div>
  );
}

export default ConversationPage;
