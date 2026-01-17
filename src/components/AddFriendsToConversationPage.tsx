import { useEffect, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate, useParams } from "react-router";
import main_background from "../Images/Main_Background.jpg";

interface Friend {
  id: string;
  username: string;
  email: string;
}

interface Participant {
  id: string;
  username: string;
  email: string;
}

function AddFriendsToConversationPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { conversationId } = useParams();
  const navigate = useNavigate();

  async function getFriends() {
    try {
      const response = await fetch(
        "https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/users/user-all-friends",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setFriends(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function AddToConversation(userId: string) {
    try {
      const response = await fetch(
        `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/conversations/${conversationId}/users`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (!response.ok) {
        throw Error("Failed to add user to conversation");
      }
      const addedUser = friends.find((friend) => friend.id === userId);
      if (addedUser) {
        setParticipants((prev) => [...prev, addedUser]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function getParticipants() {
      try {
        const response = await fetch(
          `https://wojak-hbhdh4dgcaayb3eg.polandcentral-01.azurewebsites.net/api/conversations/${conversationId}/users`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log(data, "data-participants");
        setParticipants(data);
      } catch (err) {
        console.log(err);
      }
    }
    getFriends();
    getParticipants();
  }, [conversationId]);

  const availableFriends = friends.filter(
    (friend) => !participants.some((p) => p.id === friend.id)
  );

  return (
    <div
      className="justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${main_background})` }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <button
            onClick={() => navigate(`/chats/${conversationId}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors w-full"
          >
            Powrót
          </button>

          <h2 className="text-2xl font-bold text-gray-800">
            Dodaj nowych członków:
          </h2>

          {availableFriends.length === 0 ? (
            <p className="text-gray-500">Brak znajomych do dodania.</p>
          ) : (
            <ul className="space-y-4">
              {availableFriends.map((friend) => (
                <li
                  key={friend.id}
                  className="flex items-center justify-between bg-gray-100 rounded-xl p-4"
                >
                  <div>
                    <p className="font-medium text-gray-700">
                      {friend.username}
                    </p>
                    <p className="text-sm text-gray-500">{friend.email}</p>
                  </div>
                  <IoIosAddCircleOutline
                    onClick={() => AddToConversation(friend.id)}
                    className="text-red-500 w-6 h-6 cursor-pointer hover:text-red-600 transition duration-200"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddFriendsToConversationPage;
