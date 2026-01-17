import { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";
import { Link, useNavigate } from "react-router";
import login_background from "../Images/login_background.jpeg";

//####### CHATS  #######

interface Conversation {
  id: number;
  name: string;
  description: string;
}

function ConversationsPage() {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch(
          `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/conversations/users/${currentUser?.id}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        setConversations(data);
      } catch (err) {
        console.log("Error during fetching chats", err);
      }
    }
    fetchChats();
  }, [currentUser?.id]);

  return (
    <div
      className="bg-opacity-50 flex flex-col items-center p-4 bg-gray-100 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${login_background})` }}
    >
      <div className="mt-30 p-10 space-y-6 w-full max-w-3xl">
        <Link
          to="/chats/addConversation"
          className="relative p-0.5 mb-5 me-2 inline-flex items-center justify-center transition-all ease-in duration-75 bg-white dark:bg-gray-600 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent
          hover:scale-105 hover:translate-y-[-2px] 
                        hover:shadow-2xl"
        >
          <span className="relative px-8 py-2.5 overflow-hidden text-sm font-medium text-white rounded-lg border border-[#7a9a6e] bg-[#7a9a6e] hover:bg-black transition-colors duration-200">
            Dodaj Drużynę
          </span>
        </Link>

        {conversations.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/chats/${c.id}`)}
            className="bg-[#62755a] p-6 rounded-xl shadow-lg border-gray-500 cursor-pointer 
                        transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] 
                        hover:shadow-2xl hover:border-gray-300 hover:bg-[#708466]"
          >
            <div className="text-xl font-bold text-gray-100 mb-2">{c.name}</div>
            <p className="text-gray-200">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConversationsPage;
